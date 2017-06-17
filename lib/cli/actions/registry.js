var cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  async = require('async'),
  // common = require('../../common'),

  NA = 'N/A';

//-- P R I V A T E  M E T H O D S
function getEnvProxyStatus() {
  return {
    http: process.env.HTTP_PROXY || NA,
    https: process.env.HTTPS_PROXY || NA,
    noProxy: process.env.no_proxy || NA
  };
}

function runCommand(command, callback) {
  var data = NA;

  cmd.run(command, {status: false}, function (err, stderr, stdout) {
    if (!err && stdout) {
      data = stdout.replace(/\n$/, '');
    }
    if (!data || data === 'undefined' || data === 'null') {
      data = NA;
    }
    return callback(null, data);
  });
}

module.exports = function () {
  var msg = [],
    npmRegistry,
    yarnRegistry,
    npmHttpProxy,
    npmHttpsProxy,
    yarnHttpProxy,
    yarnHttpsProxy,
    envProxies;

  async.parallel(
    [
      function (done) {
        envProxies = getEnvProxyStatus();
        done();
      },
      function (done) {
        runCommand('npm config get registry', function (err, data) {
          npmRegistry = data;
          done(err);
        });
      },
      function (done) {
        runCommand('npm config get proxy', function (err, data) {
          npmHttpProxy = data;
          done(err);
        });
      },
      function (done) {
        runCommand('npm config get https-proxy', function (err, data) {
          npmHttpsProxy = data;
          done(err);
        });
      },
      function (done) {
        runCommand('yarn config get registry', function (err, data) {
          yarnRegistry = data;
          done(err);
        });
      },
      function (done) {
        runCommand('yarn config get proxy', function (err, data) {
          yarnHttpProxy = data;
          done(err);
        });
      },
      function (done) {
        runCommand('yarn config get https-proxy', function (err, data) {
          yarnHttpsProxy = data;
          done(err);
        });
      }
    ],
    function () {
      msg.push(log.strToColor('yellow', 'Environemnt'));
      msg.push('http proxy  : ' + envProxies.http);
      msg.push('https proxy : ' + envProxies.https);
      envProxies.noProxy.split(',').forEach(function (data, idx) {
        if (idx === 0) {
          msg.push('no_proxy    : ' + data);
        } else {
          msg.push('              ' + data);
        }
      });
      msg.push('');

      msg.push(log.strToColor('yellow', 'NPM Configuration'));
      msg.push('registry    : ' + npmRegistry);
      msg.push('http proxy  : ' + npmHttpProxy);
      msg.push('https proxy : ' + npmHttpsProxy);
      msg.push('');

      msg.push(log.strToColor('yellow', 'Yarn Configuration'));
      msg.push('registry    : ' + yarnRegistry);
      msg.push('http proxy  : ' + yarnHttpProxy);
      msg.push('https proxy : ' + yarnHttpsProxy);
      msg.push('');

      log.printMessagesInBox(msg);
    }
  );
};
