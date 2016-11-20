/*jshint unused:true*/

var
  res,
  latest,
  _ = require('lodash'),
  moment = require('moment'),
  config = require('fedtools-config'),
  download = require('download'),
  url = 'https://raw.githubusercontent.com/aversini/versions/master/versions.json',
  DOWNLOAD_URL_TIMEOUT = 10000;

function _terminate() {
  // Call process exit explicitly to terminate the child process
  // Otherwise the child process will run forever.
  process.exit();
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
download(url, {
  timeout: (process.env.https_proxy) ? null : DOWNLOAD_URL_TIMEOUT,
  retries: 0
}).then(function (body) {
  if (body) {
    res = JSON.parse(body, 'utf8');
    if (res && res.envtools && res.envtools.version) {
      latest = res.envtools.version;
      // need to mark version as checked and push
      // the expiration date to 1 day
      config.setKey('envtoolsversion', _.extend(config.getKey('envtoolsversion'), {
        expiration: moment().add(1, 'd'),
        latest: latest
      }), true, true);
    }
  }
  _terminate();
}).catch(function () {
  _terminate();
});
