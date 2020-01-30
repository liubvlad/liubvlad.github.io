let ledsCount = 24;
let color = "#000000";
let mode = "off";
let $LEDS = [];
for (var i = 0; i < ledsCount; i++) {
  $LEDS[i] = document.getElementById('led' + i);
}
  
clearLeds();

function setRingColor(newColor) 
{
  color = newColor;
}

function setRingMode(newMode) 
{
  mode = newMode;
}

function animateLedRing() 
{
  switch (mode) 
  {
    case "off":
      clearLeds();
      break;
    case "all":
      clearLeds();
      for (var i = 0; i < ledsCount; i++) 
      {
        setLed(i, color);
      }
      break;
    case "half":
      clearLeds();
      for (var i = 0; i < ledsCount/2; i++) 
      {
        setLed(i*2, color);
      }
      break;
    case "thrid":
      clearLeds();
      for (var i = 0; i < ledsCount/3; i++) 
      {
        setLed(i*3, color);
      }
      break;
    case "rainbow":
      break;
  }
}

function clearLeds() 
{
  for (var i = 0; i < ledsCount; i++) 
  {
    setLed(i, "#000");
  }
}

function setLed(id, color) 
{
  $LEDS[id].setAttribute("fill", color);
}

function setJustOneLed(id, color) 
{
  clearLeds();
  setLed(id, color);
}