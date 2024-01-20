const { influxDB, org, bucket, API } = require('../utils/database');
const { Point } = require('@influxdata/influxdb-client');
const moment = require('moment');

async function insertListeningHistory(userId, songId) {
    console.log(`Attempting to insert listening history for userId: ${userId}, songId: ${songId}`);
    const writeApi = influxDB.getWriteApi(org, bucket);
    const point = new Point('listening_history')
        .tag('user_id', userId)
        .intField('song_id', songId)
        .timestamp(new Date());

    try {
        await writeApi.writePoint(point);
        await writeApi.close();
        console.log(`Successfully inserted listening history for userId: ${userId}, songId: ${songId}`);
    } catch (error) {
        console.error(`Error while inserting listening history for userId: ${userId}, songId: ${songId}:`, error.message);
        throw error;
    }
}

async function fetchLatestEntries(userId) {
    console.log(`Fetching latest entries for userId: ${userId}`);
    const queryApi = influxDB.getQueryApi(org);
    const query = `from(bucket: "${bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "listening_history")
        |> filter(fn: (r) => r["user_id"] == "${userId}")
        |> limit(n:10)
        |> sort(desc: true)`;

    try {
        const rawData = await queryApi.collectRows(query);
        console.log(`Fetched latest entries for userId: ${userId}`);

        // Process and format the raw data
        return rawData.map(entry => {
            return {
                songId: entry._value,
                listenedAt: moment(entry._time).format('DD-MM-YYYY HH:mm')
            };
        });
    } catch (err) {
        console.error(`Error querying data from InfluxDB for userId: ${userId}: ${err.stack}`);
        throw err;
    }
}

async function deleteUserRecords(userId) {
    console.log(`Attempting to delete records for userId: ${userId}`);
    const deleteAPI = new API(influxDB);
    const start = new Date('1970-01-01T00:00:00Z'); // Unix epoch start
    const stop = new Date(); // Current time

    const predicate = `_measurement="listening_history" AND user_id="${userId}"`;
    try {
        await deleteAPI.postDelete({
            org,
            bucket,
            body: {
                start: start.toISOString(),
                stop: stop.toISOString(),
                predicate: predicate,
            },
        });
        console.log(`Successfully deleted records for userId: ${userId}`);
    } catch (error) {
        console.error(`Error deleting records for userId: ${userId}:`, error.message);
        throw error;
    }
}

module.exports = { insertListeningHistory, fetchLatestEntries, deleteUserRecords };