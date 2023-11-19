const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `../../${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    HOST : process.env.HOST,
    PORT : process.env.HISTORY_PORT,
    INFLUXDB_URL: process.env.INFLUXDB_URL,
    INFLUXDB_TOKEN: process.env.INFLUXDB_TOKEN,
    INFLUXDB_ORG: process.env.INFLUXDB_ORG,
    INFLUXDB_BUCKET: process.env.INFLUXDB_BUCKET,
    RABBITMQ_QUEUE: process.env.HISTORY_RABBITMQ_QUEUE,
    RABBITMQ: process.env.HISTORY_RABBITMQ
}