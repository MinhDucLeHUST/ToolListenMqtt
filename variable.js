const mqtt = require("mqtt");
var config = require("./config.js");

const timestamp = Date.now();
const dateFormat = new Date(timestamp);
const LOG_FILE = `./log/logGW_${dateFormat.getHours()}h${dateFormat.getMinutes()}m___${dateFormat.getDate()}thang${dateFormat.getMonth() + 1}.json`;
config.Config.GW_ADDRESS = process.argv[2];
// console.log("IP Gateway: ", process.argv[2]);
const HOST = config.Config.GW_ADDRESS;
const PORT = config.Config.GW_PORT;
var CLIENT_ID = "ThirdParty";
const connectUrl = `mqtt://${HOST}:${PORT}`;
const file_data = config.Config.DATA_FILE;
const client_mqtt = mqtt.connect(connectUrl, {
    clientId: CLIENT_ID,
    clean: true,
    connectTimeout: 4000,
    username: config.Config.USERNAME,
    password: config.Config.PASSWORD,
    reconnectPeriod: 1000,
});

var flag_check_ip_different_or_empty = "isOk";

module.exports = {
    LOG_FILE,
    file_data,
    client_mqtt,
    HOST,
    flag_check_ip_different_or_empty,
};



