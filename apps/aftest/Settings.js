// menue playground

var changed = false; // false
changed = !changed; // true

var file = require("Storage").list('AppSettings.json');
if (file.length > 1) {
  console.log('Too much files');
  require("Storage").erase("AppSettings.json");
}

if ((file.length == 0) || (changed)) {
  console.log('Init Settings');
  var appsettings = {
    "GPS": false,
    "GPSrecord": false,
    "GPSFileIndex": 0,
    "GPSFile": ''
  };
  require("Storage").writeJSON('AppSettings.json', appsettings);
}
else {
  console.log('Load Settings');
  var appsettings = require("Storage").readJSON('AppSettings.json', true);
}
console.log('GPS       ' + appsettings.GPS);
console.log('GPSrecord ' + appsettings.GPSrecord);
console.log('GPSfiles  ' + appsettings.GPSfiles);
var boolean = false;
var number = 50;

// First menu
var mainmenu = {
  "": { "title": "-- Test Menu --" },
  "GPS": {
    value: appsettings.GPS,
    format: v => v ? "On" : "Off",
    onchange: v => {
      console.log("Start GPS");
      appsettings.GPS = !appsettings.GPS;
      Bangle.setGPSPower(appsettings.GPS);
      require("Storage").writeJSON('AppSettings.json', appsettings);
    }
  },
  "GPSrecord": {
    value: boolean,
    format: v => v ? "On" : "Off",
    onchange: v => {
      console.log("Start Recording");
      appsettings.GPSrecord = !appsettings.GPSrecord;
      appsettings.GPSFileIndex = appsettings.GPSFileIndex + 1;
      appsettings.GPSfile = 'GPSrecord' + appsettings.GPSFileIndex + '.csv';
      Bangle.setGPSPower(appsettings.GPS);
      Bangle.on('GPS', onGPS);
      require("Storage").writeJSON('AppSettings.json', appsettings);
    }
  },
  "Reset": function () {
    appsettings = {
      "GPS": false,
      "GPSrecord": false
    };
    require("Storage").writeJSON('AppSettings.json', appsettings);
  },
  "Submenu": function () { E.showMenu(submenu); },
  "A Number": {
    value: number,
    min: 0, max: 100, step: 10,
    onchange: v => { number = v; }
  },
  "Exit": function () { E.showMenu(); },
};
// Submenu

var submenu = {
  "": { "title": "-- SubMenu --" },
  "One": undefined, // do nothing
  "Two": undefined, // do nothing
  "< Back": function () { E.showMenu(mainmenu); },
};
// Actually display the menu

E.showMenu(mainmenu);