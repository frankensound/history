
const { register } = require('../../utils/middleware/metrics/prometheus');

async function getMetrics(req, res) {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(`Error collecting metrics: ${err}`);
    }
}

module.exports = { getMetrics };