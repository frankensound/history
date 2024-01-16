const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

register.setDefaultLabels({
    app: 'history'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Histogram metric for response times
const responseTimes = new client.Histogram({
    name: 'request_duration_milliseconds',
    help: 'Response times in milliseconds',
    buckets: [0.1, 1, 5, 10, 25, 50, 100, 200, 500],
    labelNames: ['route', 'service'],
    registers: [register],
});

register.registerMetric(responseTimes);

module.exports = { register, responseTimes };