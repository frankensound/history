const express = require('express');
const config = require("./src/utils/config");
const { startListening } = require('./src/controllers/history/controller');
const metricsController = require('./src/controllers/metrics/controller');

const app = express();

app.use(express.json());

app.get('/metrics', metricsController.getMetrics);

startListening();

// Start the server
app.listen(config.PORT, config.HOST, () => {
    console.log(`Server listening at http://${config.HOST}:${config.PORT}`);
});