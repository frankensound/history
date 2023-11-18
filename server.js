const express = require('express');
require('dotenv').config();
const { startListening } = require('./src/controllers/history/controller');
const metricsController = require('./src/controllers/metrics/controller');

const app = express();

app.use(express.json());

app.get('/metrics', metricsController.getMetrics);

startListening();

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});