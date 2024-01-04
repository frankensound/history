const messaging = require('../utils/messaging');
const service = require('./history');

function startMessageListeners() {
    messaging.startListeningForInsertingRecord(process.env.HISTORY_QUEUE, (content) => {
        service.insertListeningHistory(content.username, content.id);
    });

    messaging.startListeningForDeletion(process.env.USER_QUEUE, (username) => {
        service.deleteUserRecords(username);
    });
}

module.exports = { startMessageListeners };