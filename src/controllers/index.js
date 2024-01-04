const historyController = require('./history');

function initializeControllers(app) {
    app.get('/history/:username', historyController.getLatestEntries);
}

module.exports = { initializeControllers };