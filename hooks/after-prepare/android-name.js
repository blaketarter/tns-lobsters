var fs = require('fs');
var xml2js = require('xml2js');

var namePath = '/../../name.txt';
var xmlPath = '/../../platforms/android/src/main/res/values/strings.xml';

module.exports = function($logger) {
  return new Promise(function(resolve, reject) {
    var nameString = fs.readFileSync(__dirname + namePath).toString();
    console.log('App Name: ' + nameString);

    var stringsXML = fs.readFileSync(__dirname + xmlPath).toString();

    var builder = new xml2js.Builder();
    var parser = new xml2js.Parser();

    parser.parseString(stringsXML, function(err, data) {
      if (err) {
        reject(err);
      } else {
        data.resources.string.forEach(function(v, i, a) {
          a[i]['_'] = nameString;
        });

        stringsXML = builder.buildObject(data);
        
        fs.writeFileSync(__dirname + xmlPath, stringsXML);

        resolve();
      }
    });
  });
};
