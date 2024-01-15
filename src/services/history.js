const { influxDB, org, bucket, API } = require('../utils/database');
const { Point } = require('@influxdata/influxdb-client');

async function insertListeningHistory(userId, songId) {
    const writeApi = influxDB.getWriteApi(org, bucket);
    const point = new Point('listening_history')
        .tag('user_id', userId)
        .intField('song_id', songId)
        .timestamp(new Date());

    await writeApi.writePoint(point);
    await writeApi.close();
}

async function fetchLatestEntries(userId) {
    const queryApi = influxDB.getQueryApi(org);
    const query = `from(bucket: "${bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "listening_history")
        |> filter(fn: (r) => r["user_id"] == "${userId}")
        |> limit(n:10)
        |> sort(desc: true)`;
    try {
        const result = await queryApi.collectRows(query);
        console.log('Fetched latest entries');
        return result;
    } catch (err) {
        console.error(`Error querying data from InfluxDB! ${err.stack}`);
        throw err;
    }
}

async function deleteUserRecords(userId) {
    const deleteAPI = new API(influxDB);
    const start = new Date('1970-01-01T00:00:00Z'); // Unix epoch start
    const stop = new Date(); // Current time

    const predicate = `_measurement="listening_history" AND user_id="${userId}"`;
    await deleteAPI.postDelete({
        org,
        bucket,
        body: {
            start: start.toISOString(),
            stop: stop.toISOString(),
            predicate: predicate,
        },
    });
}

module.exports = { insertListeningHistory, fetchLatestEntries, deleteUserRecords };