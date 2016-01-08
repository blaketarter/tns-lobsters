var fs = require('fs');
var xml2js = require('xml2js');

module.exports = function($logger) {
  return new Promise(function(resolve, reject) {
    var nameString = fs.readFileSync(__dirname + '/../../name.txt').toString();
    console.log('App Name: ' + nameString);

    var stringsXML = fs.readFileSync(__dirname + '/../../platforms/android/src/main/res/values/strings.xml').toString();

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
        
        fs.writeFileSync(__dirname + '/../../platforms/android/src/main/res/values/strings.xml', stringsXML);

        resolve();
      }
    });
  });
};
