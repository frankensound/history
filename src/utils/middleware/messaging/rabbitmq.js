const amqp = require('amqplib');

async function connectRabbitMQ(retryCount = 5, delay = 3000) {
    for (let i = 0; i < retryCount; i++) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ);
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

async function consumeMessage(queue, callback) {
    connectRabbitMQ().then(async channel => {
        // Use the channel for messaging
        await channel.assertQueue(queue, {durable: false});

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        await channel.consume(queue, message => {
            const content = message.content.toString();
            console.log(`Received: ${content}`);
            callback(content);
            channel.ack(message);
        }, {noAck: false});
    }).catch(error => {
        console.error(error.message);
        process.exit(1); // Exit if connection is critical
    });
}

module.exports = {consumeMessage};