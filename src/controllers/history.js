const historyService = require('../services/history');

async function getLatestEntries(req, res) {
    try {
        const userId = req.headers['userid'];
        if (userId) {
            console.log(`Fetching latest entries for userId: ${userId}`);
            const entries = await historyService.fetchLatestEntries(userId);
            res.json(entries);
        } else {
            console.log("UserID header is missing");
            res.status(400).send("You don't seem to be logged in!");
        }
    } catch (err) {
        console.error("Error in getLatestEntries:", err.message); // Log the error message
        res.status(500).send("Error fetching history");
    }
}

module.exports = { getLatestEntries };