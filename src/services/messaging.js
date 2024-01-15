const messaging = require('../utils/messaging');
const service = require('./history');

function startMessageListeners() {
    messaging.startListeningForInsertingRecord(process.env.HISTORY_QUEUE, (content) => {
        service.insertListeningHistory(content.userId, content.songId)
            .then(() => {
                console.log(`Listening history recorded successfully for userId: ${content.userId}`);
                publishEventMessage(content);
            })
            .catch(error => {
                console.error(`Error recording listening history for userId: ${content.userId}`, error.message);
            });
    });

    messaging.startListeningForDeletion(process.env.DELETION_QUEUE, (userId) => {
        service.deleteUserRecords(userId)
            .then(() => console.log(`User records deleted successfully for userId: ${userId}`))
            .catch(error => {
                console.error(`Error deleting user records for userId: ${userId}`, error.message);
            });
    });
}

function publishEventMessage(content) {
    const event = {
        userId: content.userId,
        objectId: content.songId,
        actionType: 'listenedTo'
    };
    messaging.publishMessage(process.env.EVENT_QUEUE, event)
        .then(() => {
            console.log(`Event message published successfully for userId: ${content.userId}, songId: ${content.songId}`);
        })
        .catch(error => {
            console.error(`Error publishing event message for userId: ${content.userId}, songId: ${content.songId}:`, error.message);
        });
}

module.exports = { startMessageListeners };