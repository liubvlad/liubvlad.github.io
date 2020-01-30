var client = null;
var connected = false;
document.getElementById("connectionStatus").innerHTML = "Ready to connect";
setFormEnabledState(false);
logMessage("INFO", "Using script to connect to MQTT Server.");

function setFormEnabledState(enabled) {
  if (enabled) {
    document.getElementById("connectButton").innerHTML = "Disconnect";
    document.getElementById("app").style.display = 'inline';
    document.getElementById("mode").selectedIndex = 0;
  } else {
    document.getElementById("connectButton").innerHTML = "Connect";
    document.getElementById("app").style.display = 'none';
  }
}

function subscribe(topic, qos) {
  logMessage("INFO", "Subscribing to: [Topic: ", topic, ", QoS: ", qos, "]");
  client.subscribe(topic, { qos: Number(qos) });
}

function publish(topic, message, qos, retain) {
  logMessage("INFO", "Publishing Message: [Topic: ", topic, ", Payload: ", message, ", QoS: ", qos, ", Retain: ", retain, "]");
  message = new Paho.Message(message);
  message.destinationName = topic;
  message.qos = Number(qos);
  message.retained = retain;
  client.send(message);
}

function onMessageArrived(message) {
  logMessage("INFO", 
    "Message Recieved: [Topic: ", message.destinationName, 
    ", Payload: ", message.payloadString, 
    ", QoS: ", message.qos, 
    ", Retained: ", message.retained, 
    ", Duplicate: ", message.duplicate, "]"
  );
  var topic = message.destinationName;
  var data = message.payloadString;
  DataIncoming(topic, data);
}

function connect() {
  var hostname = "m20.cloudmqtt.com";
  var portTLS = "34234";
  var clientId = makeid();
  var user = "snuowwbb";
  var pass = "mUnp9e7gT3yn";
  var keepAlive = 60;
  var timeout = 3;
  var tls = true;
  var automaticReconnect = true;
  var cleanSession = false;
  client = new Paho.Client(hostname, Number(portTLS), clientId);
  logMessage("INFO", "Connecting to Server: [Host: ", hostname, ", Port: ", portTLS, ", ID: ", clientId, "]");
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.onConnected = onConnected;
  var options = {
    invocationContext: { host: hostname, port: portTLS, clientId: clientId },
    timeout: timeout,
    keepAliveInterval: keepAlive,
    cleanSession: cleanSession,
    useSSL: tls,
    reconnect: automaticReconnect,
    onSuccess: onConnect,
    onFailure: onFail
  };
  if (user.length > 0) { 
    options.userName = user; 
  }

  if (pass.length > 0) { 
    options.password = pass; 
  }

  client.connect(options);
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connecting...";
}

function disconnect() {
  logMessage("INFO", "Disconnecting from Server.");
  client.disconnect();
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connection - Disconnected.";
  connected = false;
  setFormEnabledState(false);
}

function connectionToggle() {
  if (connected) {
    disconnect();
  } else {
    connect();
  }
}

function unsubscribe() {
  var topic = document.getElementById("subscribeTopicInput").value;
  logMessage("INFO", "Unsubscribing: [Topic: ", topic, "]");
  client.unsubscribe(topic, {
      onSuccess: unsubscribeSuccess,
      onFailure: unsubscribeFailure,
      invocationContext: { topic: topic }
    });
}

function onConnect(context) {
  var connectionString = context.invocationContext.host + ":" + context.invocationContext.port;
  logMessage("INFO", "Connection Success ", "[URI: ", connectionString, ", ID: ", context.invocationContext.clientId, "]");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connected to: " + connectionString + " | name: " + context.invocationContext.clientId;
  connected = true;
  setFormEnabledState(connected);
}

function onConnected(reconnect, uri) {
  logMessage("INFO", "Client Has now connected: [Reconnected: ", reconnect, ", URI: ", uri, "]");
  connected = true;
  setFormEnabledState(connected);
  subscribeALL();
  publish("ESP_1/GetData", "GetDataWeb", 0, false);
}

function onFail(context) {
  logMessage("ERROR", "Failed to connect. [Error Message: ", context.errorMessage, "]");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
  connected = false;
  //setFormEnabledState(connected);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    logMessage("INFO", "Connection Lost. [Error Message: ", responseObject.errorMessage, "]");
  }
  connected = false;
  //setFormEnabledState(connected);
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connection Lost";
}

function unsubscribeSuccess(context) {
  logMessage("INFO", "Unsubscribed. [Topic: ", context.invocationContext.topic, "]");
}

function unsubscribeFailure(context) {
  logMessage("ERROR", "Failed to unsubscribe. [Topic: ", context.invocationContext.topic, ", Error: ", context.errorMessage, "]");
}

function safeHtmlTags(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function logMessage(type, ...content) {
  var date = new Date();
  var timeString = date.toUTCString();
  var logMessage = timeString + " - " + type + " - " + content.join("");
  if (type === "INFO") {
    console.info(logMessage);
  } else if (type === "ERROR") {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
}