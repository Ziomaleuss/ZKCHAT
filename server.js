const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Load configuration
const config = require('./config');

const app = express();
const PORT = config.server.port;

// Validate configuration
config.validate();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: config.limits.maxRequestSize }));
app.use(express.static(path.join(__dirname)));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Path to log.json file
const logFilePath = config.paths.logFile;
const logsDir = config.paths.sql;

/**
 * GET /api/messages - Get all messages
 */
app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync(logFilePath, 'utf-8');
        const messages = JSON.parse(data);
        res.json(messages);
    } catch (error) {
        console.error('Error reading messages:', error);
        res.status(500).json({ error: 'Failed to read messages' });
    }
});

/**
 * POST /api/messages - Add a new message
 */
app.post('/api/messages', (req, res) => {
    try {
        const { nick, pic, text, timestamp } = req.body;

        // Validate input
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Check message length
        if (text.length > config.limits.maxMessageLength) {
            return res.status(400).json({ 
                error: `Message exceeds maximum length of ${config.limits.maxMessageLength} characters` 
            });
        }

        // Read existing messages
        const data = fs.readFileSync(logFilePath, 'utf-8');
        let messages = JSON.parse(data);

        // Create new message object
        const newMessage = {
            id: messages.messages.length + 1,
            nick: nick || config.messages.defaultNick,
            pic: pic || config.messages.defaultAvatarUrl,
            text: text.trim(),
            timestamp: timestamp || new Date().toISOString()
        };

        // Add to messages array
        messages.messages.push(newMessage);

        // Write back to file
        fs.writeFileSync(logFilePath, JSON.stringify(messages, null, 2));

        // Send response
        res.status(201).json({
            success: true,
            message: newMessage
        });

        console.log(`✓ Message added: "${newMessage.text.substring(0, 50)}..." by ${newMessage.nick}`);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Failed to add message' });
    }
});

/**
 * DELETE /api/messages/:id - Delete a specific message
 */
app.delete('/api/messages/:id', (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const data = fs.readFileSync(logFilePath, 'utf-8');
        let messages = JSON.parse(data);

        const initialLength = messages.messages.length;
        messages.messages = messages.messages.filter(msg => msg.id !== messageId);

        if (messages.messages.length === initialLength) {
            return res.status(404).json({ error: 'Message not found' });
        }

        fs.writeFileSync(logFilePath, JSON.stringify(messages, null, 2));
        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

/**
 * DELETE /api/messages - Clear all messages
 */
app.delete('/api/messages', (req, res) => {
    try {
        fs.writeFileSync(logFilePath, JSON.stringify({ messages: [] }, null, 2));
        res.json({ success: true, message: 'All messages cleared' });
        console.log('✓ All messages cleared');
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ error: 'Failed to clear messages' });
    }
});

/**
 * GET /api/stats - Get chat statistics
 */
app.get('/api/stats', (req, res) => {
    try {
        const data = fs.readFileSync(logFilePath, 'utf-8');
        const messages = JSON.parse(data);

        res.json({
            totalMessages: messages.messages.length,
            messagesPerUser: {}
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Start server
const server = app.listen(PORT, () => {
    const info = config.getServerInfo();
    const apiInfo = config.getApiInfo();

    console.log(`
╔════════════════════════════════════════╗
║   ${info.name}    ║
║   Version: ${info.version}                      ║
║   http://localhost:${PORT}              ║
║   Status: ✓ Running                    ║
╚════════════════════════════════════════╝

📁 Log file: ${info.logFile}
🌐 API Base: ${apiInfo.baseUrl}
⚙️  Environment: ${info.environment}

Available Endpoints:
  • GET    /api/messages
  • POST   /api/messages
  • DELETE /api/messages/:id
  • DELETE /api/messages
  • GET    /api/stats

Use Ctrl+C to stop the server.
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n[!] Shutting down gracefully...');
    server.close(() => {
        console.log('[✓] Server closed');
        process.exit(0);
    });
});

module.exports = app;
