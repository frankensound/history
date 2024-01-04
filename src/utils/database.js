const { InfluxDB } = require('@influxdata/influxdb-client');
const { API } = require('@influxdata/influxdb-client-apis');

const url = process.env.INFLUXDB_URL
const token = process.env.INFLUXDB_TOKEN
const org = process.env.INFLUXDB_ORG
const bucket = process.env.INFLUXDB_BUCKET

const influxDB = new InfluxDB({ url, token });

module.exports = { influxDB, org, bucket, API };