var fs = require('fs');
var xml2js = require('xml2js');

var versionNamePath = '/../../versionName.txt';
var versionCodePath = '/../../versionCode.txt';
var xmlPath = '/../../platforms/android/src/main/AndroidManifest.xml';

module.exports = function($logger) {
  return new Promise(function(resolve, reject) {
    var versionNameString = fs.readFileSync(__dirname + versionNamePath).toString();
    var versionCodeString = fs.readFileSync(__dirname + versionCodePath).toString();
    console.log('App Version: ' + versionNameString);

    var manifestXML = fs.readFileSync(__dirname + xmlPath).toString();

    var builder = new xml2js.Builder();
    var parser = new xml2js.Parser();

    parser.parseString(manifestXML, function(err, data) {
      if (err) {
        reject(err);
      } else {
        data.manifest.$['android:versionName'] = versionNameString;
        data.manifest.$['android:versionCode'] = versionCodeString;

        manifestXML = builder.buildObject(data);
        
        fs.writeFileSync(__dirname + xmlPath, manifestXML);

        resolve();
      }
    });
  });
};
