const amqp = require('amqplib');
const config = require("../../config");
const messageEmitter = require("../../emitter");

async function connectRabbitMQ(retryCount = 5, delay = 3000) {
    for (let i = 0; i < retryCount; i++) {
        try {
            const connection = await amqp.connect(config.RABBITMQ);
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

function isValidMessage(m) {
    try {

        // Attempt to parse the JSON string
        const message = JSON.parse(m);

        // Validate the 'username' field (should be a non-empty string)
        if (typeof message.username !== 'string' || message.username.trim().length === 0) {
            throw new Error("Invalid or missing 'username' field");
        }

        // Validate the 'id' field (should be a number and an integer)
        if (typeof message.id !== 'number' || !Number.isInteger(message.id)) {
            throw new Error("Invalid or missing 'id' field");
        }

        // If all validations pass, return true
        return true;
    } catch (error) {
        // If any error occurs (either in parsing or validation), return false
        console.error('Message validation error:', error.message);
        return false;
    }
}

async function consumeMessage(queue, callback) {
    connectRabbitMQ().then(async channel => {
        // Use the channel for messaging
        await channel.assertQueue(queue, {durable: false});

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        await channel.consume(queue, message => {

            if (message !== null) {
                try {
                    let content = message.content.toString();
                    // Validate message content
                    if (isValidMessage(content)) {
                        // Process message
                        console.log(`Received: ${content}`);
                        callback(JSON.parse(content));
                        channel.ack(message);
                    } else {
                        console.error('Invalid message format:', content);
                    }
                } catch (error) {
                    console.error('Error processing message:', error.message);
                }
            } else {
                console.error('Message is null!');
            }
        });
    }).catch(error => {
        console.error('Error fetching message:', error.message);
    });
}

async function startListening(queue){
    await consumeMessage(queue, async (content) => {
        messageEmitter.emit('message', content);
    })
}

module.exports = {consumeMessage, isValidMessage, startListening};