/*jshint unused:true*/

var
  res,
  latest,
  moment = require('moment'),
  config = require('fedtools-config'),
  request = require('request'),
  url = 'https://github.com/aversini/versions/raw/master/versions.json';

request({
  url: url,
  timeout: 30000
}, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    if (body) {
      res = JSON.parse(body, 'utf8');
      if (res && res.envtools && res.envtools.version) {
        latest = res.envtools.version;

        // need to mark version as checked
        config.setKey('envtoolsVersion', {
          expiration: moment().add(1, 'd'),
          latest: latest
        }, true, true);

      }
    }
  } else {
    process.exit(1);
  }

  // Call process exit explicitly to terminate the child process
  // Otherwise the child process will run forever.
  process.exit();
});
