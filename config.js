var Config = {
  GW_PORT: "1883", // MQTT Local port
  // GW_ADDRESS: "192.168.88.165", // MQTT Local Address
  GW_ADDRESS: "",
  // GW_EUI: "540F57FFFEFA3293", // EUI Gateway
  GW_EUI: "", // EUI Gateway
  USERNAME: "homegateway",
  PASSWORD: "vnpttechnology",
  DATA_FILE: "./data.json",
};

var Topics = {
  /*Topic communicate with Agent Process*/
  // MQTT_TOPIC_REICEVIE_MESSAGE_OUT_SIDE_AGENT_PROCESS:
  //   "MessageOutSideAgentProcessToConnAssistant", //MQTT Topic to receivce message from AgentProcess
  // MQTT_TOPIC_SEND_MESSAGE_OUT_SIDE_AGENT_PROCESS:
  //   "MessageOutSideConnAssistantToAgentProcess", //MQTT Topic to send message AgentProcess
  /*Topic communicate with zigbee-handle*/

  /*Topic communicate with Device Management*/
  // MQTT_TOPIC_REICEVIE_MESSAGE_OUT_SIDE_DEVICE_MANAGEMENT	: "MessageOutSideDeviceManagementToConnAssistant",		//MQTT Topic to receivce message from DeviceManagement
  // MQTT_TOPIC_SEND_MESSAGE_OUT_SIDE_DEVICE_MANAGEMENT		: "MessageOutSideConnAssistantToDeviceManagement",		//MQTT Topic to send message DeviceManagement
  /*Topic communicate with zigbee-handle*/
  MQTT_TOPIC_REICEVIE_MESSAGE_IN_SIDE_ZIGBEE:
    "ConnectivityAssistantInSideZigbeeHandleToCommunicate", //MQTT Topic to receivce message from zigbee-handle
  MQTT_TOPIC_SEND_MESSAGE_IN_SIDE_ZIGBEE:
    "ConnectivityAssistantInsideCommunicateToZigbeeHandle", //MQTT Topic to send message to zigbee-handle

  /*Topic communicate with BLE*/
  // MQTT_TOPIC_REICEVIE_MESSAGE_IN_SIDE_BLUETOOTH			: "ConnectivityAssistantInSideBluetoothHandleToCommunicate", //MQTT Topic to receivce message from BLE
  // MQTT_TOPIC_SEND_MESSAGE_IN_SIDE_BLUETOOTH				: "ConnectivityAssistantInsideCommunicateToBluetoothHandle",	 //MQTT Topic to send message to BLE

  /*Topic communicate with zigbee-handle*/
  // MQTT_TOPIC_REICEVIE_MESSAGE_IN_SIDE_WIFI				: "ConnectivityAssistantReceiveMessageInSideWifi", //MQTT Topic to receivce message from zigbee-handle
  // MQTT_TOPIC_SEND_MESSAGE_IN_SIDE_WIFI					: "ConnectivityAssistantSendMessageInsideWifi",	 //MQTT Topic to send message to zigbee-handle

  /*Topic Keepalive*/
  // MQTT_TOPIC_REICEVIE_MESSAGE_OUT_SIDE_KEEPALIVE:
  //   "keepAlive_connectivityAssistant",
  // MQTT_TOPIC_SEND_MESSAGE_OUT_SIDE_KEEPALIVE: "keepAlive_response_connectivityAssistant",
  // ID_KEEPALIVE 											: "connectivityAssistant",



  /* Topic in Zigbee network */
  GW_COMMANDS: "/commands",
  // GW_APS_RESPONSE: "gw/" + takeGW_EUI() + "/apsresponse",
  // GW_DEVICE_JOINED: "/devicejoined",
  // GW_DEVICE_LEFT: "/deviceleft",
  // GW_EXECUTED: "/executed",
  GW_ZCL_RESPONSE: "/zclresponse",
};

function assignTopics() {
  key_Topics = Object.keys(Topics);
  const gwTopics = key_Topics.filter((str) => /GW_/.test(str));
  for (const gwTopic of gwTopics) {
    Topics[gwTopic] = "gw/" + Config.GW_EUI + Topics[gwTopic];
  }
}

module.exports = { Config: Config, Topics: Topics, assignTopics: assignTopics };
