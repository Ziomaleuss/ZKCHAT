/**
 * Configuration File for Chat Application
 * Centralized configuration for the server
 */

const path = require('path');

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        hostname: 'localhost'
    },

    // File Paths
    paths: {
        root: __dirname,
        sql: path.join(__dirname, 'SQL'),
        logFile: path.join(__dirname, 'SQL', 'log.json')
    },

    // Features
    features: {
        enableMessageDeletion: process.env.ENABLE_MESSAGE_DELETION !== 'false',
        enableStats: process.env.ENABLE_STATS !== 'false',
        enableCors: process.env.ENABLE_CORS !== 'false'
    },

    // Limits
    limits: {
        maxMessageLength: 500,
        maxMessagesPerMinute: 100,
        maxRequestSize: '10mb'
    },

    // Polling
    polling: {
        interval: process.env.MESSAGE_POLL_INTERVAL || 2000,
        timeout: 30000
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Messages
    messages: {
        defaultNick: 'Anonymous',
        defaultAvatarUrl: 'https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40',
        idStartFrom: 1
    }
};

/**
 * Get server info
 */
config.getServerInfo = () => {
    return {
        name: 'Anonymous Chat Server',
        version: '1.0.0',
        port: config.server.port,
        environment: config.server.env,
        logFile: config.paths.logFile
    };
};

/**
 * Get API info
 */
config.getApiInfo = () => {
    return {
        baseUrl: `http://${config.server.hostname}:${config.server.port}`,
        endpoints: {
            messages: {
                getAll: 'GET /api/messages',
                create: 'POST /api/messages',
                delete: 'DELETE /api/messages/:id',
                deleteAll: 'DELETE /api/messages',
                stats: 'GET /api/stats'
            }
        }
    };
};

/**
 * Validate configuration
 */
config.validate = () => {
    const fs = require('fs');
    
    // Check if SQL directory exists
    if (!fs.existsSync(config.paths.sql)) {
        fs.mkdirSync(config.paths.sql, { recursive: true });
        console.log(`✓ Created SQL directory: ${config.paths.sql}`);
    }

    // Check if log.json exists
    if (!fs.existsSync(config.paths.logFile)) {
        fs.writeFileSync(config.paths.logFile, JSON.stringify({ messages: [] }, null, 2));
        console.log(`✓ Created log.json: ${config.paths.logFile}`);
    }

    return true;
};

module.exports = config;
