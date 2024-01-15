const express = require('express');
const { responseTimes } = require('../utils/metrics');
const winston = require('winston');

// Configure the Winston logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'logs/errors.log',
            maxsize: 10000000, // 10 MB
            maxFiles: 30, // Keep last 30 files
            tailable: true,
        })
    ]
});

// Handle unhandled exceptions
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
})

// Record response-time metrics
function responseTimeMiddleware(req, res, next) {
    const start = process.hrtime();

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        const routePath = req.route && req.route.path ? req.route.path : 'unknown';
        responseTimes.observe({ route: routePath }, durationInMilliseconds);
    });

    next();
}

function getDurationInMilliseconds(start) {
    const NS_PER_SEC = 1e9; // Convert nanoseconds to seconds
    const NS_TO_MS = 1e6; // Convert nanoseconds to milliseconds
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS; // Convert to milliseconds
}

function setupMiddleware(app) {
    app.use(express.json());
    app.use(responseTimeMiddleware);
    // Middleware for logging API request errors
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).send('An error occurred');
    });
}

module.exports = { setupMiddleware };