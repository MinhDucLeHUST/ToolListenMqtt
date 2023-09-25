var config = require("./config.js");
var variable = require("./variable.js");
const fs = require("fs");
let get_eui_flag = false;
const client = variable.client_mqtt;
var clear_data = false;

function subTopicWithoutListenAll(eui) {
    config.Config.GW_EUI = eui;
    config.assignTopics();
    const listenedTopics = Object.values(config.Topics);
    for (let topic of listenedTopics) {
        client.subscribe([topic], () => {
            console.log(`->> Subscribe topic '${topic}'`);
        });
    }

    var countMessage = 0; // index the message
    fs.appendFile(variable.LOG_FILE, "[", (err) => { });

    client.on("message", (topic, payload) => {
        var time_log = getTimeLog();
        var content = `${time_log}// ${countMessage}. ${topic}:\n${payload},\n\n`;
        fs.appendFile(variable.LOG_FILE, content, (err) => {
            if (err) {
                console.error(err);
            }
            countMessage += 1;
        });
    });
}

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

function saveDataIntoFile(eui_gw, id_gw) {
    const jsonObject = {
        eui_gateway: '',
        ip_gateway: ''
    };

    jsonObject.eui_gateway = eui_gw;
    jsonObject.ip_gateway = config.Config.GW_ADDRESS;

    const json_data = JSON.stringify(jsonObject, null, 2);
    try {
        fs.writeFileSync(variable.file_data, json_data);
        console.log(">> Save data into file");
    }
    catch (error) {
        console.log("Error: ", error);
    }
}

function subTopicAfterUnsubAll(GW_EUI) {
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

    var countMessage = 0; // index the message
    fs.appendFile(variable.LOG_FILE, "[", (err) => { });
    if (get_eui_flag == true) {
        client.on("message", (topic, payload) => {
            var time_log = getTimeLog();
            var content = `${time_log}// ${countMessage}. ${topic}:\n${payload},\n\n`;
            fs.appendFile(variable.LOG_FILE, content, (err) => {
                if (err) {
                    console.error(err);
                }
                countMessage += 1;
            });
        });

    }
}

function isIpDifferent(ip_gateway_in_file_data) {
    var ip_gateway_imported = variable.HOST;
    // while (ip_gateway_in_file_data != undefined) {
    if (ip_gateway_in_file_data != ip_gateway_imported) {
        // console.log("========================= Error =========================");
        // console.log("= 1. Wrong IP Gateway, please check your ip again!      =");
        // console.log("= 2. Run node clean                                     =");
        // console.log("= 3. Run node main.js ip_gw                             =");
        // console.log("=========================================================");
        console.log("IP get in file: ", ip_gateway_in_file_data);
        console.log("IP you import: ", ip_gateway_imported);
        // process.exit(0);
        saveDataIntoFile("", "");
        variable.flag_check_ip_different_or_empty = 'isNone';
    }

    // }
}

var handleFunc = {
    subTopicWithoutListenAll: subTopicWithoutListenAll,
    subTopicAfterUnsubAll: subTopicAfterUnsubAll,
    saveDataIntoFile: saveDataIntoFile,
    getTimeLog: getTimeLog,
    isIpDifferent: isIpDifferent,
    clear_data: clear_data,
};

// var handleFucVariable = {
//     clear_data: clear_data,
// }

module.exports = handleFunc;
// module.exports = handleFucVariable;