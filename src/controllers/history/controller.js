const { consumeMessage } = require('../../utils/middleware/messaging/rabbitmq');
const historyService = require('../../services/history/service');
const config = require("../../utils/config");

function startListening() {
    consumeMessage(config.RABBITMQ_QUEUE, async (content) => {
        // Insert the processed message into the database
        const record = content;
        await historyService.insertListeningHistory(record.username, record.id);
    })
}

module.exports = { startListening };