const { InfluxDB } = require('@influxdata/influxdb-client');
const config = require("../config");

const url = config.INFLUXDB_URL
const token = config.INFLUXDB_TOKEN
const org = config.INFLUXDB_ORG
const bucket = config.INFLUXDB_BUCKET

const influxDB = new InfluxDB({ url, token });

module.exports = { influxDB, org, bucket };