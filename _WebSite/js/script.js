// Create a client instance
var client = null;
var connected = false;

setFormEnabledState(false);

logMessage("INFO", "Запуск скрипта для подключения клиента.");

// Things to do as soon as the page loads
///document.getElementById("clientIdInput").value = "js-utility-" + makeid();

// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  var connectionString = context.invocationContext.host + ":" + context.invocationContext.port + context.invocationContext.path;
  logMessage("INFO", "Connection Success ", "[URI: ", connectionString, ", ID: ", context.invocationContext.clientId, "]");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connected to: " + connectionString + " as " + context.invocationContext.clientId;
  connected = true;
  setFormEnabledState(true);
}


function onConnected(reconnect, uri) {
  // Once a connection has been made, make a subscription and send a message.
  logMessage("INFO", "Client Has now connected: [Reconnected: ", reconnect, ", URI: ", uri, "]");
  connected = true;
}

function onFail(context) {
  logMessage("ERROR", "Failed to connect. [Error Message: ", context.errorMessage, "]");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
  connected = false;
  setFormEnabledState(false);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    logMessage("INFO", "Connection Lost. [Error Message: ", responseObject.errorMessage, "]");
  }
  connected = false;
}

// called when a message arrives
function onMessageArrived(message) {
  logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");
  var topic = message.destinationName;
  var data = message.payloadString;

  if (topic == "ESP_1/Led"){
    var node = document.getElementById('Led');
      if (data == "0"){
        node.checked = false;
      }
      else {
        node.checked = true;
      }
  }
  // временно
  if (topic == "ESP_1/R"){
    var node = document.getElementById('R');
        node.innerHTML = "R: " + data;
  }
    if (topic == "ESP_1/G"){
    var node = document.getElementById('G');
        node.innerHTML = "G: " + data;
  }
    if (topic == "ESP_1/B"){
    var node = document.getElementById('B');
        node.innerHTML = "B: " + data;
  }



  if (topic == "ESP_1/Mode"){
    var node = document.getElementById('Mode');
        node.selectedIndex = Number(data);

  }
  if (topic == "ESP_1/But"){
    var node = document.getElementById('But');
      if (data == "0"){
        node.className = "butStateOFF";
        node.innerHTML = "OFF";
      }
      else {
        node.className = "butStateON";
        node.innerHTML = "ON";
      }
  }


  // @ убрал на время
  // var messageTime = new Date().toISOString();
  // // Insert into History Table
  // var table = document.getElementById("incomingMessageTable").getElementsByTagName("tbody")[0];
  // var row = table.insertRow(0);
  // row.insertCell(0).innerHTML = message.destinationName;
  // row.insertCell(1).innerHTML = safeTagsRegex(message.payloadString);
  // row.insertCell(2).innerHTML = messageTime;
  // row.insertCell(3).innerHTML = message.qos;


  // if (!document.getElementById(message.destinationName)) {
  //   var lastMessageTable = document.getElementById("lastMessageTable").getElementsByTagName("tbody")[0];
  //   var newlastMessageRow = lastMessageTable.insertRow(0);
  //   newlastMessageRow.id = message.destinationName;
  //   newlastMessageRow.insertCell(0).innerHTML = message.destinationName;
  //   newlastMessageRow.insertCell(1).innerHTML = safeTagsRegex(message.payloadString);
  //   newlastMessageRow.insertCell(2).innerHTML = messageTime;
  //   newlastMessageRow.insertCell(3).innerHTML = message.qos;

  // } else {
  //   // Update Last Message Table
  //   var lastMessageRow = document.getElementById(message.destinationName);
  //   lastMessageRow.id = message.destinationName;
  //   lastMessageRow.cells[0].innerHTML = message.destinationName;
  //   lastMessageRow.cells[1].innerHTML = safeTagsRegex(message.payloadString);
  //   lastMessageRow.cells[2].innerHTML = messageTime;
  //   lastMessageRow.cells[3].innerHTML = message.qos;
  // }

}

function connectionToggle() {
  if (connected) {
    disconnect();
  } else {
    connect();
  }
}


function connect() {
  var hostname = "m20.cloudmqtt.com";
  var port = "34234";                     // Порт Websockets Port (TLS only) (!) 
  var clientId = makeid();


  var user = "snuowwbb";
  var pass = "mUnp9e7gT3yn";
  var keepAlive = 60;
  var timeout = 3;
  var tls = true;
  var automaticReconnect = true;
  var cleanSession = false; // @



  client = new Paho.Client(hostname, Number(port), clientId);
  
  logMessage("INFO", "Connecting to Server: [Host: ", hostname, ", Port: ", port, ", ID: ", clientId, "]");

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.onConnected = onConnected;


  var options = {
    invocationContext: { host: hostname, port: port, clientId: clientId },
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



  // connect the client
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

// Sets various form controls to either enabled or disabled
function setFormEnabledState(enabled) {

  // Connection Panel Elements
  if (enabled) {
    document.getElementById("connectButton").innerHTML = "Disconnect";
  } else {
    document.getElementById("connectButton").innerHTML = "Connect";
  }
  document.getElementById('publishButton').disabled = !enabled;
  
  // document.getElementById("hostInput").disabled = enabled;
  // document.getElementById("portInput").disabled = enabled;
  // document.getElementById("clientIdInput").disabled = enabled;
  // document.getElementById("pathInput").disabled = enabled;
  // document.getElementById("userInput").disabled = enabled;
  // document.getElementById("passInput").disabled = enabled;
  // document.getElementById("keepAliveInput").disabled = enabled;
  // document.getElementById("timeoutInput").disabled = enabled;
  // document.getElementById("tlsInput").disabled = enabled;
  // document.getElementById("automaticReconnectInput").disabled = enabled;
  // document.getElementById("cleanSessionInput").disabled = enabled;
  // document.getElementById("lwtInput").disabled = enabled;
  // document.getElementById("lwQosInput").disabled = enabled;
  // document.getElementById("lwRetainInput").disabled = enabled;
  // document.getElementById("lwMInput").disabled = enabled;

  // // Publish Panel Elements
  // document.getElementById("publishTopicInput").disabled = !enabled;
  // document.getElementById("publishQosInput").disabled = !enabled;
  // document.getElementById("publishMessageInput").disabled = !enabled;
  // document.getElementById("publishButton").disabled = !enabled;
  // document.getElementById("publishRetainInput").disabled = !enabled;

  // // Subscription Panel Elements
  // document.getElementById("subscribeTopicInput").disabled = !enabled;
  // document.getElementById("subscribeQosInput").disabled = !enabled;
  // document.getElementById("subscribeButton").disabled = !enabled;
  // document.getElementById("unsubscribeButton").disabled = !enabled;

}

function publish(Topic, Message, QoS, Retain) {
  var topic = Topic;
  var qos = Number(QoS);
  var message = Message;
  var retain = Retain;
  logMessage("INFO", "Publishing Message: [Topic: ", topic, ", Payload: ", message, ", QoS: ", qos, ", Retain: ", retain, "]");
  message = new Paho.Message(message);
  message.destinationName = topic;
  message.qos = Number(qos);
  message.retained = retain;
  client.send(message);
}


function subscribe(Topic, QoS) {
  var topic = Topic;
  var qos = QoS;
  logMessage("INFO", "Subscribing to: [Topic: ", topic, ", QoS: ", qos, "]");
  client.subscribe(topic, { qos: Number(qos) });
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


function unsubscribeSuccess(context) {
  logMessage("INFO", "Unsubscribed. [Topic: ", context.invocationContext.topic, "]");
}

function unsubscribeFailure(context) {
  logMessage("ERROR", "Failed to unsubscribe. [Topic: ", context.invocationContext.topic, ", Error: ", context.errorMessage, "]");
}

function clearHistory() {
  var table = document.getElementById("incomingMessageTable");
  //or use :  var table = document.all.tableid;
  for (var i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

}


// Just in case someone sends html
function safeTagsRegex(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").
    replace(/>/g, "&gt;");
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function logMessage(type, ...content) {
  ///var consolePre = document.getElementById("consolePre");
  var date = new Date();
  var timeString = date.toUTCString();
  var logMessage = timeString + " - " + type + " - " + content.join("");
  ///consolePre.innerHTML += logMessage + "\n";
  
  if (type === "INFO") {
    console.info(logMessage);
  } else if (type === "ERROR") {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
}





/**/

function subscribeALL() {
  subscribe("ESP_1/#", 0);
}



function _ledClicked(){
  var node = document.getElementById('Led');
  var state = node.checked;

  var data = "0";
  if(state === true) {
    data = "1";
  }

  publish("ESP_1/Led", data, 0, false);
}


function _modeChange() {
  var node = document.getElementById('Mode');
  var value = node.value;

  var data = value;

  publish("ESP_1/Mode", data, 0, false);
}

