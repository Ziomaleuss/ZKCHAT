const fs = require('fs');
const path = require('path');

// Config
const LOG_PATH = path.join(__dirname, '..', 'SQL', 'log.json');
const USE_KV = process.env.USE_KV === 'true';
let kvClient = null;

if (USE_KV) {
  try {
    // Import KV client (works on Vercel when KV is enabled)
    const { kv } = require('@vercel/kv');
    kvClient = kv;
    console.log('Vercel KV enabled for messages storage');
  } catch (e) {
    console.warn('Vercel KV module not available, falling back to file storage', e);
    kvClient = null;
  }
}

// Helpers for storage
async function readMessages() {
  if (kvClient) {
    try {
      const stored = await kvClient.json.get('messages');
      return stored && stored.messages ? stored : { messages: [] };
    } catch (e) {
      console.warn('KV read error, falling back to file:', e);
    }
  }

  // Fallback: local file (dev only)
  try {
    if (fs.existsSync(LOG_PATH)) {
      const raw = fs.readFileSync(LOG_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('readMessages: could not read log.json', e);
  }
  return { messages: [] };
}

async function writeMessages(data) {
  if (kvClient) {
    try {
      await kvClient.json.set('messages', data);
      return true;
    } catch (e) {
      console.warn('KV write error, falling back to file:', e);
      // continue to file fallback
    }
  }

  try {
    fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.warn('writeMessages: could not write log.json (ephemeral filesystem?)', e);
    return false;
  }
}

function makeMessage(payload, currentMessages) {
  const ids = currentMessages.messages.map(m => m.id || 0);
  const lastId = ids.length ? Math.max(...ids) : 0;
  return {
    id: lastId + 1,
    nick: payload.nick || 'Anonymous',
    pic: payload.pic || 'https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40',
    text: (payload.text || '').trim(),
    timestamp: payload.timestamp || new Date().toISOString()
  };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const method = req.method.toUpperCase();

    if (method === 'GET') {
      const data = await readMessages();
      return res.status(200).json(data);
    }

    if (method === 'POST') {
      const payload = req.body;
      if (!payload || !payload.text || payload.text.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const messages = await readMessages();
      const newMessage = makeMessage(payload, messages);
      messages.messages.push(newMessage);

      const persisted = await writeMessages(messages);
      const resp = { success: true, message: newMessage };
      if (!persisted) resp.warning = 'persistence-not-available';

      return res.status(201).json(resp);
    }

    if (method === 'DELETE') {
      const urlParts = (req.url || '').split('/').filter(Boolean);
      const maybeId = urlParts[urlParts.length - 1];
      const data = await readMessages();

      if (maybeId && !isNaN(parseInt(maybeId))) {
        const id = parseInt(maybeId);
        const initialLen = data.messages.length;
        data.messages = data.messages.filter(m => m.id !== id);
        if (data.messages.length === initialLen) {
          return res.status(404).json({ error: 'Message not found' });
        }
        const persisted = await writeMessages(data);
        const resp = { success: true, message: 'Message deleted' };
        if (!persisted) resp.warning = 'persistence-not-available';
        return res.status(200).json(resp);
      }

      data.messages = [];
      const persisted = await writeMessages(data);
      const resp = { success: true, message: 'All messages cleared' };
      if (!persisted) resp.warning = 'persistence-not-available';
      return res.status(200).json(resp);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};