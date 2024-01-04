const express = require('express');
const { setupMiddleware } = require('./src/middleware');
const { initializeControllers } = require('./src/controllers');
const { startMessageListeners } = require('./src/services/messaging');

const app = express();

setupMiddleware(app);
initializeControllers(app);
startMessageListeners();

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server listening at http://${process.env.HOST}:${process.env.PORT}`);
});