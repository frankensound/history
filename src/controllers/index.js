const historyController = require('./history');

function initializeControllers(app) {
    app.get('/history', historyController.getLatestEntries);
}

module.exports = { initializeControllers };