const messaging = require('../utils/messaging');
const service = require('./history');
const messageEmitter = require("../utils/emitter");

function startMessageListeners() {
    // Start listening to RabbitMQ queues
    messaging.startListeningForInsertingRecord(process.env.HISTORY_QUEUE);
    messaging.startListeningForDeletion(process.env.DELETION_QUEUE);

    // Add an event listener for the 'message' event
    messageEmitter.on('message', (content) => {
        service.insertListeningHistory(content.userId, content.songId)
            .then(() => {
                console.log(`Listening history recorded successfully for userId: ${content.userId}`);
                publishEventMessage(content);
            })
            .catch(error => {
                console.error(`Error recording listening history for userId: ${content.userId}`, error.message);
            });
    });

    // Add an event listener for the 'deleteUser' event
    messageEmitter.on('deleteUser', (userId) => {
        service.deleteUserRecords(userId)
            .then(() => console.log(`User records deleted successfully for userId: ${userId}`))
            .catch(error => {
                console.error(`Error deleting user records for userId: ${userId}`, error.message);
            });
    });
}

function publishEventMessage(content) {
    const message = {
        "userId": content.userId,
        "actionType": "listenedTo",
        "objectId": content.songId
    };
    messaging.publishMessage(process.env.EVENTS_QUEUE, message, {})
        .then(() => {
            console.log(`Event message published successfully for userId: ${content.userId}, songId: ${content.songId}`);
        })
        .catch(error => {
            console.error(`Error publishing event message for userId: ${content.userId}, songId: ${content.songId}:`, error.message);
        });
}

module.exports = { startMessageListeners };