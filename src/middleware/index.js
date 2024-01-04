const express = require('express');
const { responseTimes } = require('../utils/metrics');

function setupMiddleware(app) {
    app.use(express.json());
    app.use(responseTimeMiddleware);
}

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


module.exports = { setupMiddleware };