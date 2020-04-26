const version = "0.09";
var menueIndex = 0;
var menueValues = ['GPX App', 'Heart Rate', 'Timer App', 'Watch', 'Stop App'];
var progIndex = 3; // Watch
var progValues = ['GPX App', 'Heart Rate', 'Timer App', 'Watch', 'Settings'];
const menueIndexMax = menueValues.length - 1;

var myBTN1;
var myBTN2;
var myBTN3;
function initBTN() {
  console.log("initBTN");
  clearWatch();
  myBTN1 = setWatch(function (e) { handleBTN('1', e); }, BTN1, { repeat: true, edge: "falling" });
  myBTN2 = setWatch(function (e) { handleBTN('2', e); }, BTN2, { repeat: true, edge: "falling" });
  myBTN3 = setWatch(function (e) { handleBTN('3', e); }, BTN3, { repeat: true, edge: "falling" });
}
function handleBTN(BTN, e) {
  console.log("handleBTN" + BTN + progIndex);
  switch (BTN.toString() + progIndex.toString()) {
    case '10': { startMyGPSApp(); break; } //GPX App
    case '11': { break; } //Heart App
    case '12': { startTimer(); break; } //Timer App
    case '13': { break; } //Watch
    case '14': { menueUp(); break; } //Settings

    case '20': { startAppMenue(); break; } //GPX App
    case '21': { startAppMenue(); break; } //Heart App
    case '22': { startAppMenue(); break; } //Timer App
    case '23': { startAppMenue(); break; } //Watch
    case '24': { startMenueItem(); break; } //Settings

    case '30': { stopMyGPSApp(); break; } //GPX App
    case '31': { break; } //Heart App
    case '32': { stopTimer(); break; } //Timer App
    case '33': { break; } //Watch
    case '34': { menueDown(); break; } //Settings
    default: { break; }
  }
}
function startApp() {
  g.clear();
  Bangle.loadWidgets();
  Bangle.drawWidgets();
  console.log("startApp (" + progIndex + ")");
  initBTN();
  switch (progIndex) {
    case 0: { startMyGPSApp(); break; } //GPX App
    case 1: { startMyHeartApp(); break; } //Heart App
    case 2: { startMyTimerApp(); break; } //Timer App
    case 3: { drawWordClock(); break; } //Watch
    case 4: { startAppMenue(); break; } //Settings
  }
}

var menueMode = false;
var gpsSearchIndex = 0;

// Helper Function
function fileWrite(file, line) {
  f = require("Storage").open(file, "a"); // filename max 7 Zeichen
  free = require("Storage").getFree();
  if (free > 30000) {
    f.write(line + "\n");
    return "yes";
  }
  else { return "no"; }
}
function newScreen(title) {
  console.log("newScreen(" + title + ")");
  g.clearRect(3, 29, 237, 215); // Outer Rect
  g.setColor(whiteColor);
  g.setFont("6x8", fontSize);
  g.setFontAlign(-1, -1);
  g.drawString(title, 15, 30);
}

// GPS
var gpsSearchIndex = 0;
function startMyGPSApp() {
  progIndex = 0;
  newScreen("GPS started..");
  gpsSearchIndex = 0;
  Bangle.setLCDTimeout(60);
  Bangle.setGPSPower(1);
  Bangle.on('GPS', onGPS);
}
function onGPS(fix) {
  console.log(fix);
  if (isNaN(fix.lat)) {
    searchIndex = gpsSearchIndex + 1;
    newScreen("Searching " + gpsSearchIndex);
  }
  else {
    newScreen("Recording");
    line = fix.lat + "," + fix.lon + "," + fix.alt + "," + fix.speed + "," + fix.course + "," + fix.satellites + "," + fix.time;
    g.drawString("Lat: " + fix.lat, 15, 60);
    g.drawString("Lon: " + fix.lon, 15, 90);
    g.drawString("Alt: " + fix.alt, 15, 120);
    g.drawString("Speed: " + fix.speed, 15, 150);
    g.drawString("Course: " + fix.course, 15, 180);
    fileWrite("GPS", line);
  }
  drawDigitalTime();
}
function stopMyGPSApp() {
  Bangle.setGPSPower(0);
  newScreen("GPS stopped..");
}

// Heart Rate
function startMyHeartApp() {
  console.log("Heart App");
  progIndex = 1;
  newScreen("Heart App");
  g.drawString('TBD', 60, 60);
}

// Timer
var counterInterval;
var timerCounter = 5;
var timerRunning = false;
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
}
function startTimer(e) {
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
function startMyTimerApp() {
  progIndex = 2;
  newScreen("Timer App");
}

/* Draw World Clock */
const allWords = [
  "ATWENTYD",
  "QUARTERY",
  "FIVEHALF",
  "DPASTORO",
  "FIVEIGHT",
  "SIXTHREE",
  "TWELEVEN",
  "FOURNINE"
];
const hours = {
  0: ["", 0, 0],
  1: ["ONE", 17, 47, 77],
  2: ["TWO", 06, 16, 17],
  3: ["THREE", 35, 45, 55, 65, 75],
  4: ["FOUR", 07, 17, 27, 37],
  5: ["FIVE", 04, 14, 24, 34],
  6: ["SIX", 05, 15, 25],
  7: ["SEVEN", 05, 46, 56, 66, 67],
  8: ["EIGHT", 34, 44, 54, 64, 74],
  9: ["NINE", 47, 57, 67, 77],
  10: ["TEN", 74, 75, 76],
  11: ["ELEVEN", 26, 36, 46, 56, 66, 76],
  12: ["TWELVE", 06, 16, 26, 36, 56, 66]
};
const mins = {
  0: ["A", 0, 0],
  1: ["FIVE", 02, 12, 22, 32],
  2: ["TEN", 10, 30, 40],
  3: ["QUARTER", 01, 11, 21, 31, 41, 51, 61],
  4: ["TWENTY", 10, 20, 30, 40, 50, 60],
  5: ["HALF", 42, 52, 62, 72],
  6: ["PAST", 13, 23, 33, 43],
  7: ["TO", 43, 53]
};
// offsets and increments
const xs = 35;
const ys = 31;
const dy = 22;
const dx = 25;
// font size and color
const fontSize = 3;  // "6x8"
const passivColor = 0x3186 /*grey*/;
const activeColor = 0xF800 /*red*/;
const whiteColor = 0xFFFF /*Wite*/;

function drawWordClock() {
  newScreen("");
  progIndex = 3;
  // get time
  var t = new Date();
  var h = t.getHours();
  var m = t.getMinutes();
  var time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);

  var hidx;
  var midx;
  var midxA = [];

  g.setFont("6x8", fontSize);
  g.setColor(passivColor);
  g.setFontAlign(0, -1, 0);

  // draw allWords
  var c;
  var y = ys;
  var x = xs;
  allWords.forEach((line) => {
    x = xs;
    for (c in line) {
      g.drawString(line[c], x, y);
      x += dx;
    }
    y += dy;
  });

  // calc indexes
  midx = Math.round(m / 5);
  hidx = h % 12;
  if (hidx == 0) { hidx = 12; }
  if (midx > 6) {
    if (midx == 12) { midx = 0; }
    hidx++;
  }
  if (midx !== 0) {
    if (midx <= 6) {
      midxA = [midx, 6];
    } else {
      midxA = [12 - midx, 7];
    }
  }

  // write hour in active color
  g.setColor(activeColor);
  // console.log("Hours:'"+hours[hidx]+"'");

  hours[hidx][0].split('').forEach((c, pos) => {
    x = xs + (hours[hidx][pos + 1] / 10 | 0) * dx;
    y = ys + (hours[hidx][pos + 1] % 10) * dy;

    g.drawString(c, x, y);
  });

  // write min words in active color
  midxA.forEach(idx => {
    mins[idx][0].split('').forEach((c, pos) => {
      x = xs + (mins[idx][pos + 1] / 10 | 0) * dx;
      y = ys + (mins[idx][pos + 1] % 10) * dy;
      g.drawString(c, x, y);
    });
  });

  // display digital time
  g.setColor(whiteColor);
  g.clearRect(0, 215, 240, 240);
  g.drawString(time, 120, 215);
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

// Mein Menue
function startMenueItem() {
  console.log("Start Menue Item (" + menueIndex + ")");
  progIndex = menueIndex;
  if (menueIndex == 4) Bangle.showLauncher();
  else startApp();
}
function menueUp() {
  console.log("menueUp");
  oldMenueIndex = menueIndex;
  if (menueIndex == 0) { menueIndex = menueIndexMax; }
  else { menueIndex = menueIndex - 1; }
  drawMenueItem(oldMenueIndex);
  drawMenueItem(menueIndex);
  clearWatch(myBTN1);
  myBTN1 = setWatch(function (e) { menueUp(); }, BTN1, { repeat: false, edge: "falling" });
}
function menueDown() {
  console.log("menueDown");
  oldMenueIndex = menueIndex;
  if (menueIndex == menueIndexMax) { menueIndex = 0; }
  else { menueIndex = menueIndex + 1; }
  drawMenueItem(oldMenueIndex);
  drawMenueItem(menueIndex);
  clearWatch(myBTN3);
  myBTN3 = setWatch(function (e) { menueDown(); }, BTN3, { repeat: false, edge: "falling" });
}
function drawMenueItem(index) {
  if (index == menueIndex) g.setColor(whiteColor);
  else g.setColor(passivColor);
  x = 15;
  y = 30 + (30 * index);
  g.clearRect(x, y, x, x + 30);
  g.setFont("6x8", fontSize);
  g.setFontAlign(-1, -1);
  g.drawString(menueValues[index], x, y);
}
function startAppMenue() {
  newScreen("");
  progIndex = 4;
  for (i = 0; i <= menueIndexMax; i++) {
    drawMenueItem(i);
  }
}

/* Main Section */
Bangle.on('lcdPower', (on) => {
  if (on) {
    startApp();
  }
});
startApp();
