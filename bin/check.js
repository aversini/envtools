/*jshint unused:true*/

var
  res,
  latest,
  moment = require('moment'),
  config = require('fedtools-config'),
  download = require('download'),
  url = 'https://github.com/aversini/versions/raw/master/versions.json';

function _terminate () {
  // Call process exit explicitly to terminate the child process
  // Otherwise the child process will run forever.
  process.exit();
}

download(url, {
  timeout: 30000,
  retries: 0
}).then(function (body) {
  if (body) {
    res = JSON.parse(body, 'utf8');
    if (res && res.envtools && res.envtools.version) {
      latest = res.envtools.version;
      // need to mark version as checked and push
      // the expiration date to 1 day
      config.setKey('envtoolsVersion', {
        expiration: moment().add(1, 'd'),
        latest: latest
      }, true, true);
    }
  }
  _terminate();
}).catch(function () {
  _terminate();
});
