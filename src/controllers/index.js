const historyController = require('./history');

function initializeControllers(app) {
    app.get('/history/:userId', historyController.getLatestEntries);
}

module.exports = { initializeControllers };