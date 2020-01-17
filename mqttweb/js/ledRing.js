let ledsCount = 24;
let $LEDS = [];
for (var i = 0; i < ledsCount; i++) {
  $LEDS[i] = document.getElementById('led' + i);
}
let 
  color = "#FFDB00",
  mode = "off";
clearLeds();

function setRingColor(newColor) {
  color = newColor;
}
function setRingMode(newMode) {
  mode = newMode;
}

function animateLedRing() {
  clearLeds();
  switch (mode) {
    case "off":
      
      break;
    case "all":
      for (var i = 0; i < ledsCount; i++) {
        setLed(i, color);
      }
      break;
    case "half":
      for (var i = 0; i < ledsCount/2; i++) {
        setLed(i*2, color);
      }
      break;
    case "thrid":
      for (var i = 0; i < ledsCount/3; i++) {
        setLed(i*3, color);
      }
      break;
    case "rainbow":
      clearLeds(); // @ временное
      break;
  }
}


function clearLeds() {
  for (var i = 0; i < ledsCount; i++) {
    setLed(i, "#000");}
}
function setLed(id, color) {
  $LEDS[id].setAttribute("fill", color);
}
function setJustOneLed(id, color) {
  clearLeds();
  setLed(id, color);
}

