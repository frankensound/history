const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'history'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

const insertCounter = new client.Counter({
    name: 'listening_events',
    help: 'Total number of listening events registered in the history'
});

register.registerMetric(insertCounter);

module.exports = { register, insertCounter };