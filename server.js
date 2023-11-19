const express = require('express');
const config = require("./src/utils/config");
const { startListening } = require('./src/utils/middleware/messaging/rabbitmq');
const metricsController = require('./src/controllers/metrics/controller');
const {processMessage} = require("./src/controllers/history/controller");

const app = express();

app.use(express.json());
processMessage();
app.get('/metrics', metricsController.getMetrics);

startListening(config.RABBITMQ_QUEUE);

// Start the server
app.listen(config.PORT, config.HOST, () => {
    console.log(`Server listening at http://${config.HOST}:${config.PORT}`);
});