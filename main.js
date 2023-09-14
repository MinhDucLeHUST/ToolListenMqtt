// const mqtt = require("mqtt");
// var config = require("./config.js");
var Constants = {
  flag_t: 'isOk',
};

const fs = require("fs");
var handle_func = require("./handleFunction.js");
var variable = require("./variable.js");
const client = variable.client_mqtt;

client.on("error", (error) => {
  console.error("Client on ERROR !!!", error);
});

client.on('reconnect', () => {
  console.log('Client went offline (lost connection) => reconnect ...');
});

var jsonData = "";
fs.readFile(variable.file_data, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }
  // var data_exist = "";
  // Parse the JSON data into a JavaScript object
  jsonData = JSON.parse(data);
  console.log("eui gw in readfile: ", jsonData.eui_gateway);
  // Check if the value of the "email" key is an empty string
  if (jsonData.ip_gateway === '') {
    console.log('The "ip_gateway" key is empty.');

  } else {
    // data_exist = jsonData.eui_gateway;
    console.log('The "ip_gateway" key is not empty.');
  }
  console.log("ip in readFile: ", jsonData.ip_gateway);
  // handle_func.isIpDifferent(jsonData.ip_gateway);
});
// handle_func.isIpDifferent(JSON.parse(data_in_file).ip_gateway);


process.on("SIGINT", () => {
  fs.appendFileSync(variable.LOG_FILE, "]");

  // Exit the Node.js process gracefully
  process.exit(0);
});

client.on("connect", () => {
  console.log(">> Connected to ", jsonData.ip_gateway);
  var temp = jsonData.ip_gateway;
  var eui_gw = jsonData.eui_gateway;
  // console.log(">>>> temp connect = ", temp);
  if (!temp || Constants.flag_t == 'isNone') {
    client.subscribe("#", (error) => {
      if (error) {
        rejects(error);
      }
      console.log(`->> Subscribe topic # to extract EUI`);
    });
  } else {
    handle_func.logOn2(eui_gw);
  }
});

client.on("message", (topic, payload) => {
  var temp = jsonData.ip_gateway;
  // console.log(">>>> Received message from GW_EUI: ", temp);
  if (!temp) {
    if (/gw\//.test(topic)) {
      // console.log(`Catch topic contains EUI: ${topic}`);

      const parts = topic.split("/");
      var EUI = parts[1];
      handle_func.saveDataIntoFile(EUI);
      console.log(`EUI Gateway: ${EUI}`);
      client.removeAllListeners();
      handle_func.logOn(EUI);
    }
  }
  // saveDataIntoFile(variable.EUI)
});

module.exports = { Constants: Constants };