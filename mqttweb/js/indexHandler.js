function subscribeALL() {
  subscribe("ESP_1/#", 0);
}

function ledClicked() {
  var node = document.getElementById("Led");
  var state = node.checked;
  var data = "0";
  if(state === true) { 
    data = "1"; 
  }

  publish("ESP_1/Led", data, 0, false);
}

function colorClicked(hexcol, rgbcol) {
  setRingColor("#" + hexcol);
  animateLedRing();
  publish("ESP_1/RGB", ""+rgbcol.r+","+rgbcol.g+","+rgbcol.b, 0, false); 
}

function ModeChange() {
  var node = document.getElementById("mode");
  var data = node.value;
  publish("ESP_1/Mode", data, 0, false);
}

function DataIncoming(topic, data) {
  if (topic == "ESP_1/Led") {
    var node = document.getElementById("Led");
      if (data == "0") {
        node.checked = false;
      } else {
        node.checked = true;
      }
  }

  if (topic == "ESP_1/RGB") {
    var rgb = data.split(',');
    var hexcol = "#";
    for (var i = 0; i < 3; i++) {
      var temp = (Number(rgb[i]).toString(16));
      console.log("rgb["+i+"] = " + rgb[i]);
      if (temp.length < 2) temp = "0"+temp;
      hexcol += temp;
    }

    $('#colorpickerHolder').ColorPickerSetColor(hexcol);
    setRingColor(hexcol);
    animateLedRing();
  }

  if (topic == "ESP_1/Mode") {
    document.getElementById("mode").selectedIndex = Number(data);
    switch (data) {
      case "0":
        setRingMode("off");
        break;
      case "1":
        setRingMode("all");
        break;
      case "2":
        setRingMode("half");
        break;
      case "3":
        setRingMode("thrid");
        break;
      case "4":
        setRingMode("rainbow");
        break;
    }

    animateLedRing();
  }

  if (topic == "ESP_1/But") {
    var node = document.getElementById("but");
    if (data == "0") {
      node.className = "butStateOFF";
      node.innerHTML = "OFF";
    } else {
      node.className = "butStateON";
      node.innerHTML = "ON";
    }
  }
}