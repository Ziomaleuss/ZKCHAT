const fs = require('fs');
const path = require('path');

// Path to log.json (used for local/dev only)
const LOG_PATH = path.join(__dirname, '..', 'SQL', 'log.json');

// Helper: read messages from file (dev) or return in-memory fallback
function readMessages() {
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

// Helper: write messages to file (dev). On Vercel this may fail (ephemeral fs)
function writeMessages(data) {
  try {
    fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.warn('writeMessages: could not write log.json (ephemeral filesystem?)', e);
    return false;
  }
}

// Create a new message structure
function makeMessage({ nick, pic, text, timestamp }, currentMessages) {
  const lastId = (currentMessages.messages.length && currentMessages.messages[currentMessages.messages.length - 1].id) || 0;
  return {
    id: lastId + 1,
    nick: nick || 'Anonymous',
    pic: pic || 'https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40',
    text: (text || '').trim(),
    timestamp: timestamp || new Date().toISOString()
  };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // Simple CORS - Vercel functions are often called by the same origin, but keep it permissive
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const method = req.method.toUpperCase();

    if (method === 'GET') {
      const data = readMessages();
      return res.status(200).json(data);
    }

    if (method === 'POST') {
      const body = req.body || (req._body ? req.body : undefined);
      const payload = body && Object.keys(body).length ? body : req.body;

      if (!payload || !payload.text || payload.text.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const messages = readMessages();
      const newMessage = makeMessage(payload, messages);
      messages.messages.push(newMessage);

      const persisted = writeMessages(messages);

      const resp = { success: true, message: newMessage };
      if (!persisted) resp.warning = 'persistence-not-available-on-vercel-ephemeral-fs';

      return res.status(201).json(resp);
    }

    if (method === 'DELETE') {
      // /api/messages or /api/messages/:id
      const urlParts = (req.url || '').split('/').filter(Boolean); // e.g. ['api','messages','3']
      const maybeId = urlParts[urlParts.length - 1];
      const data = readMessages();

      // If last segment is an integer -> delete that message
      if (maybeId && !isNaN(parseInt(maybeId))) {
        const id = parseInt(maybeId);
        const initialLen = data.messages.length;
        data.messages = data.messages.filter(m => m.id !== id);
        if (data.messages.length === initialLen) {
          return res.status(404).json({ error: 'Message not found' });
        }
        const persisted = writeMessages(data);
        const resp = { success: true, message: 'Message deleted' };
        if (!persisted) resp.warning = 'persistence-not-available-on-vercel-ephemeral-fs';
        return res.status(200).json(resp);
      }

      // Otherwise clear all
      data.messages = [];
      const persisted = writeMessages(data);
      const resp = { success: true, message: 'All messages cleared' };
      if (!persisted) resp.warning = 'persistence-not-available-on-vercel-ephemeral-fs';
      return res.status(200).json(resp);
    }

    // Unsupported method
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};