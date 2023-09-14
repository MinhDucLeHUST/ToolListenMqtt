const fs = require("fs");
const FILE_DATA = "./data.json";

const ipppp = fs.readFileSync(FILE_DATA, 'utf8', (err, data) => {
    // console.log("123");
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }
    var data_exist = "";
    // Parse the JSON data into a JavaScript object
    jsonData = JSON.parse(data);
    console.log("eui gw: ", jsonData.eui_gateway);
    // Check if the value of the "email" key is an empty string
    if (jsonData.ip_gateway === '') {
        console.log('IP GW is empty => PLease insert IP GW, run again with command: node main.js ip_gw');

    } else {
        // data_exist = jsonData.eui_gateway;
        console.log('IP GW is not empty.');

        // console.log("value: ", jsonData.eui_gateway);
    }
});

console.log(JSON.parse(ipppp).ip_gateway);