const historyService = require('../../services/history/service');
const messageEmitter = require("../../utils/emitter");
async function processMessage(){
    messageEmitter.on('message', (content) => {
        // Insert the processed message into the database
        historyService.insertListeningHistory(content.username, content.id);
    });
}

module.exports = {processMessage};