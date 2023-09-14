const mqtt = require("mqtt");
var config = require("./config.js");
const fs = require("fs");

/**
 * Set up prequisites for connection
 */
const timestamp = Date.now();
const dateFormat = new Date(timestamp);
const LOG_FILE = `./log/logGW_${dateFormat.getHours()}h${dateFormat.getMinutes()}m___${dateFormat.getDate()}thang${dateFormat.getMonth() + 1}.json`;
config.Config.GW_ADDRESS = process.argv[2];
console.log("IP Gateway: ", process.argv[2]);
const HOST = config.Config.GW_ADDRESS;
const PORT = config.Config.GW_PORT;
const CLIENT_ID = "ThirdParty";
let get_eui_flag = false;
const connectUrl = `mqtt://${HOST}:${PORT}`;
const file_data = config.Config.DATA_FILE;
const client = mqtt.connect(connectUrl, {
    clientId: CLIENT_ID,
    clean: true,
    connectTimeout: 4000,
    username: config.Config.USERNAME,
    password: config.Config.PASSWORD,
    reconnectPeriod: 1000,
});

var jsonData = "";
fs.readFile(file_data, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }
    var data_exist = "";
    // Parse the JSON data into a JavaScript object
    jsonData = JSON.parse(data);
    console.log("eui gw: ", jsonData.eui_gateway);
    // Check if the value of the "email" key is an empty string
    if (jsonData.eui_gateway === '') {
        console.log('The "eui_gateway" key is empty.');

    } else {
        // data_exist = jsonData.eui_gateway;
        console.log('The "eui_gateway" key is not empty.');

        // console.log("value: ", jsonData.eui_gateway);
    }
});

/**
 *
 * @param {*} GW_EUI: EUI of GW we extract from topic prototype (gw/...EUI.../...)
 */
function logOn(GW_EUI) {
    /**
     * Un & Subcribe topic
     */
    config.Config.GW_EUI = GW_EUI;
    // console.log(`Asign GW_EUI = ${config.Config.GW_EUI}`);
    client.unsubscribe("#", () => {
        // get_eui_flag = true;
        console.log("->> Unsubcribe topic #");
    });
    get_eui_flag = true;
    config.assignTopics();
    const listenedTopics = Object.values(config.Topics);
    for (let topic of listenedTopics) {
        client.subscribe([topic], () => {
            console.log(`->> Subscribe topic '${topic}'`);
        });
    }

    /**
     * Write to file
     */
    // console.log("value = ", get_eui_flag);
    var countMessage = 0; // index the message
    fs.appendFile(LOG_FILE, "[", (err) => { });
    if (get_eui_flag == true) {
        client.on("message", (topic, payload) => {
            var time_log = getTimeLog();
            var content = `${time_log}// ${countMessage}. ${topic}:\n${payload},\n\n`;
            fs.appendFile(LOG_FILE, content, (err) => {
                if (err) {
                    console.error(err);
                }
                countMessage += 1;
            });
        });

    }
}

function logOn2(eui) {
    config.Config.GW_EUI = eui;
    config.assignTopics();
    const listenedTopics = Object.values(config.Topics);
    for (let topic of listenedTopics) {
        client.subscribe([topic], () => {
            console.log(`->> Subscribe topic '${topic}'`);
        });
    }

    /**
     * Write to file
     */
    // console.log("value = ", get_eui_flag);
    var countMessage = 0; // index the message
    fs.appendFile(LOG_FILE, "[", (err) => { });

    client.on("message", (topic, payload) => {
        var time_log = getTimeLog();
        var content = `${time_log}// ${countMessage}. ${topic}:\n${payload},\n\n`;
        fs.appendFile(LOG_FILE, content, (err) => {
            if (err) {
                console.error(err);
            }
            countMessage += 1;
        });
    });
}

/**
 * Set up write the ']' to file on SIGINT
 */
process.on("SIGINT", () => {
    fs.appendFileSync(LOG_FILE, "]");

    // Exit the Node.js process gracefully
    process.exit(0);
});

/*****************************************************
 *                    MAIN
 * ***************************************************/
client.on("connect", () => {
    console.log(">> Connected");
    var temp = jsonData.eui_gateway;
    // console.log(">>>> temp connect = ", temp);
    if (!temp) {
        client.subscribe("#", (error) => {
            if (error) {
                rejects(error);
            }
            console.log(`->> Subscribe topic # to extract EUI`);
        });
    } else {
        logOn2(temp);
    }
});

/**
 * Event handle: write to file (name file format: logGW_<time>.json)
 */
client.on("message", (topic, payload) => {
    var temp = jsonData.eui_gateway;
    // console.log(">>>> Received message from GW_EUI: ", temp);
    if (!temp) {
        if (/gw\//.test(topic)) {
            // console.log(`Catch topic contains EUI: ${topic}`);

            const parts = topic.split("/");
            var EUI = parts[1];
            saveDataIntoFile(EUI);
            console.log(`EUI Gateway: ${EUI}`);
            client.removeAllListeners();
            logOn(EUI);
        }
    }
});

/**
 * Catch client ERROR
 */
client.on("error", (error) => {
    console.error("Client on ERROR !!!", error);
});

client.on('reconnect', () => {
    console.log('Client went offline (lost connection) => reconnect ...');
});

function getTimeLog() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const millisecond = now.getMilliseconds();
    var time_log = `//Time: ${hour}:${minute}:${second}:${millisecond}   ${day}-${month + 1}-${year}\n`
    return time_log;
}

function saveDataIntoFile(eui_gw) {
    const jsonObject = {
        eui_gateway: '',
        ip_gateway: ''
    };

    jsonObject.eui_gateway = eui_gw;
    jsonObject.ip_gateway = config.Config.GW_ADDRESS;

    const json_data = JSON.stringify(jsonObject, null, 2);
    try {
        fs.writeFileSync(file_data, json_data);
        console.log(">> Save data into file");
    }
    catch (error) {
        console.log("Error: ", error);
    }
    // console.log("eui (saveDataIntoFile): ", jsonObject.eui_gateway);
    // return jsonObject.eui_gateway;
}
