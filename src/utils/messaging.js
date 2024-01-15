const amqp = require('amqplib');
const messageEmitter = require("./emitter");

async function connectRabbitMQ(retryCount = 5, delay = 3000) {
    for (let i = 0; i < retryCount; i++) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            console.log('Connected to RabbitMQ');
            return channel;
        } catch (error) {
            console.error(`Attempt ${i + 1}: Error connecting to RabbitMQ`, error.message);
            if (i < retryCount - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error('Failed to connect to RabbitMQ after retries');
}

function isValidMessage(message, messageType) {
    try {
        // Parse the JSON string
        const m = JSON.parse(message);
        // Validate the 'userId' field (should be a non-empty string)
        if (typeof m.userId !== 'number' || !Number.isInteger(m.userId)) {
            return false;
        }
        if (messageType === "history") {
            // Validate the 'songId' field (should be a number and an integer)
            if (typeof m.songId !== 'number' || !Number.isInteger(m.songId)) {
                return false;
            }
        }
        // If all validations pass, return true
        return true;
    } catch {
        return false;
    }
}

async function consumeMessage(queue, context) {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, message => {
        if (message) {
            const content = message.content.toString();
            if (isValidMessage(content, context)) {
                const parsedContent = JSON.parse(content);
                console.log(`Received: ${content}`);
                channel.ack(message);
                if (context === "history") {
                    messageEmitter.emit('message', parsedContent);
                } else if (context === "deletion") {
                    messageEmitter.emit('deleteUser', parsedContent.userId);
                }
            } else {
                console.error('Invalid message format:', content);
            }
        } else {
            console.error('Message is null!');
        }
    });
}

async function publishMessage(queue, messageObj, options = {}) {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(messageObj);
    channel.sendToQueue(queue, Buffer.from(message), options);
    console.log(`Message sent to ${queue}: ${message}`);
}

async function startListeningForInsertingRecord(queue) {
    await consumeMessage(queue, "history");
}

async function startListeningForDeletion(queue) {
    await consumeMessage(queue, "deletion");
}

module.exports = {startListeningForInsertingRecord, startListeningForDeletion, isValidMessage, publishMessage};