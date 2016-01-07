var fs = require('fs');

var nameString = fs.readFileSync('./name.txt').toString();
console.log('App Name: ' + nameString);
