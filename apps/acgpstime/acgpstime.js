var fix;
var img = require("heatshrink").decompress(atob("mEwghC/AH8A1QWVhWq0AuVAAIuVAAIwT1WinQwTFwMzmQwTCYMjlUqGCIuBlWi0UzC6JdBIoMjC4UDmAuOkYXBPAWgmczLp2ilUiVAUDC4IwLFwIUBLoJ2BFwQwM1WjCgJ1DFwQwLFwJ1B0SQCkQWDGBQXBCgK9BDgKQBAAgwJOwUzRgIDBC54wCkZdGPBwACRgguDBIIwLFxEJBQIwLFxGaBYQwKFxQwLgAWGmQuBcAQwJC48ifYYwJgUidgsyC4L7DGBIXBdohnBCgL7BcYIXIGAqMCIoL7DL5IwERgIUBLoL7BO5QXBGAK7DkWiOxQXGFwOjFoUyFxZhDgBdCCgJ1CCxYxCgBABkcqOwIuNGAQXC0S9BLpgAFXoIwBmYuPAAYwCLp4wHFyYwDFyYwDFygwCCyoA/AFQA="));
var myInterval;

g.clear();
Bangle.setGPSPower(1);

// Define Function for GPS Events
Bangle.on('GPS', function (f) {
  //console.log("GPSevent");
  fix = f;
  g.reset(1);
  g.setFont("6x8", 2);
  g.setFontAlign(0, 0);
  g.clearRect(90, 30, 239, 90);
  if (fix.fix) {
    g.drawString("GPS", 170, 40);
    g.drawString("Acquired", 170, 60);
  } else {
    g.drawString("Waiting for", 170, 40);
    g.drawString("GPS Fix", 170, 60);
  }
  g.setFont("6x8");
  g.drawString(fix.satellites + " satellites", 170, 80);

  g.clearRect(0, 100, 239, 239);
  var t = ["", "", "", "---", ""];
  if (fix.time !== undefined)
    t = fix.time.toString().split(" ");
  g.setFont("6x8", 3);
  g.drawString(t[1] + " " + t[2], 120, 135); // date
  g.setFont("6x8", 2);
  g.drawString(t[3], 120, 160); // year
  g.setFont("6x8", 3);
  g.drawString(t[4], 120, 185); // time
  if (fix.time) {
    // timezone
    var tz = (new Date()).getTimezoneOffset() / 60;
    if (tz == 0) tz = "UTC";
    else if (tz > 0) tz = "UTC+" + tz;
    else tz = "UTC" + tz;
    g.setFont("6x8", 2);
    g.drawString(tz, 120, 210); // gmt
    g.setFontAlign(0, 0, 3);
    g.drawString("Set", 230, 120);
    g.setFontAlign(0, 0);
  }
});

// Draw the little sattelitte
myInterval = setInterval(function () {
  g.drawImage(img, 48, 48, { scale: 1.5, rotate: Math.sin(getTime() * 2) / 2 });
}, 100);

//stop GPS Time search by press BTN2
setWatch(function () {
  //console.log("Stop GPS time");
  if (fix.time !== undefined) {
    console.log("Catched GPS time");
    setTime(fix.time.getTime() / 1000);
  } else {console.log("Can not catch GPS time");}
  clearInterval(myInterval);
  Bangle.setGPSPower(0);
  Bangle.showLauncher();
}, BTN2, { repeat: false });
