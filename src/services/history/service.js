const {influxDB, org, bucket} = require('../../utils/database/influx');
const {Point} = require('@influxdata/influxdb-client');
const {insertCounter} = require("../../utils/middleware/metrics/prometheus");

async function insertListeningHistory(username, songId) {
    try {
        const writeApi = influxDB.getWriteApi(org, bucket);
        const point = new Point('listening_history')
            .tag('username', username)
            .intField('song_id', songId)
            .timestamp(new Date());

        writeApi.writePoint(point);
        await writeApi.close();
        // Increment the Prometheus counter
        insertCounter.inc();
        console.log('Listening history record inserted.');
    } catch (err) {
        console.error(`Error saving data to InfluxDB! ${err.stack}`);
    }
}

module.exports = {insertListeningHistory};