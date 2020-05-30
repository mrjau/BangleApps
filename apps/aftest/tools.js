//Tools.js

function deleteFiles(regex) {
  let filelist = require("Storage").list(regex);
  console.log(filelist.length);
  for (i = 0; i < filelist.length; i++) {
    console.log(filelist[i]);
    require("Storage").erase(filelist[i]);
  }
}

function createFile(name) {
  f = require("Storage").open(name, "w");
  f.write("Hell");
}

function freeSpace() {
  require("Storage").getFree()
}

function newScreen(title) {
  console.log("newScreen(" + title + ")");
  g.clearRect(3, 29, 237, 215);
  g.setColor(whiteColor);
  g.setFont("6x8", fontSize);
  g.setFontAlign(-1, -1);
  g.drawString(title, 15, 30);
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

