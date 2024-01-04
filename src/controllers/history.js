const historyService = require('../services/history');
const messageEmitter = require("../utils/emitter");

// Handle 'message' event for inserting records
messageEmitter.on('message', (content) => {
    historyService.insertListeningHistory(content.username, content.id);
});
 *
// Handle 'deleteUser' event for deleting user records
messageEmitter.on('deleteUser', (username) => {
    historyService.deleteUserRecords(username);
});

async function getLatestEntries(req, res) {
    try {
        const username = req.params.username;
        const entries = await historyService.fetchLatestEntries(username);
        res.json(entries);
    } catch (err) {
        res.status(500).send("Error fetching history");
    }
}

module.exports = { getLatestEntries };