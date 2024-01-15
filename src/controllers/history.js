const historyService = require('../services/history');
const messageEmitter = require("../utils/emitter");

// Handle 'message' event for inserting records
messageEmitter.on('message', (content) => {
    historyService.insertListeningHistory(content.userId, content.songId);
});
 
// Handle 'deleteUser' event for deleting user records
messageEmitter.on('deleteUser', (userId) => {
    historyService.deleteUserRecords(userId);
});

async function getLatestEntries(req, res) {
    try {
        const userId = req.headers['UserID'];
        if (userId) {
            const entries = await historyService.fetchLatestEntries(userId);
            res.json(entries);
        } else {
            res.status(400).send("You don't seem to be logged in!");
        }
    } catch (err) {
        res.status(500).send("Error fetching history");
    }
}

module.exports = { getLatestEntries };