const version = "0.01";
var appsettings = require("Storage").readJSON('actimer.json', true);

var Type = appsettings.Type; // Timer or StopWatch
var timerRunning = false;
var timerCounter = appsettings.Timer;
var counterInterval;
var counter;

var myBTN1;
var myBTN2;
var myBTN3;
clearWatch();
myBTN1 = setWatch(function (e) { startTimer(); }, BTN1, { repeat: true, edge: "falling" });
myBTN2 = setWatch(function (e) { E.showMenu(mainmenu); }, BTN2, { repeat: true, edge: "falling" });
myBTN3 = setWatch(function (e) { stopTimer(); }, BTN3, { repeat: true, edge: "falling" });

function newScreen(title) {
  console.log("newScreen(" + title + ")");
  g.clearRect(3, 29, 237, 215);
  g.setColor(whiteColor);
  g.setFont("6x8", fontSize);
  g.setFontAlign(-1, -1);
  g.drawString(title, 15, 30);
}

function outOfTime() {
  E.showMessage("Out of Time", "My Timer");
  Bangle.buzz();
}
function countDown() {
  counter--;
  // Out of time
  if (counter <= 0) {
    clearInterval(counterInterval);
    counterInterval = undefined;
    outOfTime();
    return;
  }
  if ((timerRunning) && !(menueMode)) {
    g.clearRect(53, 58, 181, 186);
    g.setFontAlign(0, 0); // center font
    g.setFont("Vector", 40); // vector font, 80px  
    // draw the current counter value
    g.drawString(counter, 120, 120);
    // optional - this keeps the watch LCD lit up
    g.flip();
  }
  drawDigitalTime();
}
function startTimer() {
  timerCounter = appsettings.Timer;
  newScreen();
  // 240 x 240 x 16 bits
  // 48 Pixel for Widgets
  // 192 Pixel for the Rest
  // 96 Pixel seems to be the center
  g.drawRect(3, 29, 237, 215); // Outer Rect
  g.drawCircle(117, 122, 93);  // Inner Circle
  g.drawRect(52, 57, 182, 187); // Inner Rect
  counter = timerCounter;
  timerRunning = true;
  countDown();
  if (!counterInterval)
    counterInterval = setInterval(countDown, 1000);
}
function stopTimer() {
  if (counterInterval != undefined) {
    clearInterval(counterInterval);
    counterInterval = undefined;
  }
}
function countUp() {
  counter++;
  // Out of time
  if (counter <= 0) {
    clearInterval(counterInterval);
    counterInterval = undefined;
    outOfTime();
    return;
  }
  if ((timerRunning) && !(menueMode)) {
    g.clearRect(53, 58, 181, 186);
    g.setFontAlign(0, 0); // center font
    g.setFont("Vector", 40); // vector font, 80px  
    // draw the current counter value
    g.drawString(counter, 120, 120);
    // optional - this keeps the watch LCD lit up
    g.flip();
  }
  drawDigitalTime();
}
function startSTopWatch() {
  timerCounter = 0;
  newScreen();
  // 240 x 240 x 16 bits
  // 48 Pixel for Widgets
  // 192 Pixel for the Rest
  // 96 Pixel seems to be the center
  g.drawRect(3, 29, 237, 215); // Outer Rect
  g.drawCircle(117, 122, 93);  // Inner Circle
  g.drawRect(52, 57, 182, 187); // Inner Rect
  counter = timerCounter;
  timerRunning = true;
  countDown();
  if (!counterInterval)
    counterInterval = setInterval(countUp, 1000);
}

function startTimerApp() {
  newScreen("Timer App");
}
function drawDigitalTime() {
  var t = new Date();
  var h = t.getHours();
  var m = t.getMinutes();
  var time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
  g.setColor(whiteColor);
  g.clearRect(0, 215, 240, 240);
  g.drawString(time, 120, 215);
}

var mainmenu = {
  "": { "title": "-- Timer Menu --" },
  "Start Stop Watch": () => startStopWatch(),
  "Start Timer": () => startTimer(),
  "Timer": {
    value: number,
    min: 0, step: 15,
    onchange: v => { number = v; }
    },
  'Turn Off': () => Bangle.off(),
  '< Back': () => load()
};

function startApp() {
  console.log("startApp - actimer.js");
  g.clear();
  Bangle.loadWidgets();
  Bangle.drawWidgets();
  E.showMenu(mainmenu);
}

/* Main Section */
startApp();
