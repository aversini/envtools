var cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  config = require('fedtools-config'),
  async = require('async'),
  _ = require('lodash'),
  inquirer = require('inquirer'),
  // common = require('../../common'),

  NA = 'N/A',
  DEFAULT_NPM_REGISTRY = 'http://registry.npmjs.org/',
  DEFAULT_YARN_REGISTRY = 'http://registry.yarnpkg.com';

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

function displayStatus(callback) {
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
      return callback();
    }
  );
}

function displayConfirmation(msg, done) {
  var questions = {
    type: 'confirm',
    name: 'goodToGo',
    message: msg,
    default: true
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(!answers.goodToGo);
  });
}

function updateRegistry(registry, callback) {
  async.parallel([
    function (done) {
      cmd.run('npm config set registry ' + registry, {
        status: false
      }, function () {
        done(null);
      });
    },
    function (done) {
      cmd.run('yarn config set registry ' + registry, {
        status: false
      }, function () {
        done(null);
      });
    }
  ], function () {
    log.echo();
    log.success('Registry set to ' + registry);
    log.echo();
    callback();
  });
}

module.exports = function () {
  var registries;
  async.waterfall(
    [
      function (done) {
        displayStatus(done);
      },
      function (done) {
        registries = config.getKey('envtoolsnpmregistries');
        if (!registries || !registries.length) {
          // there is no cache yet, let's create one
          registries = [DEFAULT_NPM_REGISTRY, DEFAULT_YARN_REGISTRY];
          config.setKey('envtoolsnpmregistries', registries);
        }
        done();
      },
      function (done) {
        displayConfirmation(
          'Do you want to update the current registry?',
          done
        );
      },
      function (done) {
        var questions = {
          type: 'list',
          name: 'registry',
          message: 'Please choose one of the following options'
        };
        questions.choices = registries.slice();
        questions.choices.push({
          name: 'Enter a custom registry',
          value: 'custom'
        });
        inquirer.prompt(questions).then(function (answers) {
          var
            reg,
            reUrl = new RegExp(
            /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(localhost)|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
          ),
            questions = {
              type: 'input',
              name: 'custom',
              message: 'Type a custom registry (including protocol):',
              validate: function (val) {
                if (!val) {
                  return 'Registry URL cannot be empty...';
                }
                if (!reUrl.test(val)) {
                  return 'Please enter a valid URL...';
                }
                return true;
              }
            };

          if (answers.registry === 'custom') {
            inquirer.prompt(questions).then(function (answers) {
              reg = answers.custom.toLowerCase().trim();
              registries.push(reg);
              config.setKey(
                'envtoolsnpmregistries',
                _.uniqWith(registries, _.isEqual)
              );
              return done(null, reg);
            });
          } else {
            // One of the existing options was selected, no need to update the cache.
            // We only need to update .npmrc and .yarnrc
            reg = answers.registry.toLowerCase().trim();
            return done(null, reg);
          }
        });
      },
      function (registry, done) {
        updateRegistry(registry, done);
      }
    ],
    function (abort) {
      if (abort) {
        log.echo('Bye then!');
      }
    }
  );
};
