var fs = require('fs');

var versionString = fs.readFileSync('./version.txt').toString();
console.log('Version: ' + versionString);
