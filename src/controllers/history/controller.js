const { consumeMessage } = require('../../utils/middleware/messaging/rabbitmq');
const historyService = require('../../services/history/service');

function startListening() {
    consumeMessage(process.env.RABBITMQ_QUEUE, async (content) => {
        // Parse the message content and insert it into the database
        const data = JSON.parse(content);
        await historyService.insertListeningHistory(data.username, data.id);
    })
}

module.exports = { startListening };