var cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  config = require('fedtools-config'),
  waterfall = require('async/waterfall'),
  parallel = require('async/parallel'),
  _ = require('lodash'),
  inquirer = require('inquirer'),
  common = require('../../common'),
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
    envProxies,
    currentNpmProfile,
    availableNpmProfiles;

  parallel(
    [
      function (done) {
        var data = common.getExistingNpmrcProfiles();
        if (!_.isEmpty(data)) {
          if (data.enabled) {
            currentNpmProfile = data.enabled;
          }
          if (!_.isEmpty(data.available)) {
            availableNpmProfiles = data.available.sort();
          }
          return done();
        } else {
          return done();
        }
      },
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
      msg.push(log.strToColor('yellow', 'Environment'));
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

      if (currentNpmProfile || availableNpmProfiles) {
        msg.push('');
        msg.push(log.strToColor('yellow', 'Envtools Registry Profile'));
        if (!currentNpmProfile) {
          currentNpmProfile = common.NA;
        }

        msg.push('Current profile    : ' + currentNpmProfile);
        msg.push('Available profiles : ' + availableNpmProfiles.join(', '));
      }

      log.printMessagesInBox(msg);
      return callback(null, {
        npmRegistry: npmRegistry,
        npmHttpProxy: npmHttpProxy,
        npmHttpsProxy: npmHttpsProxy,
        yarnRegistry: yarnRegistry,
        yarnHttpProxy: yarnHttpProxy,
        yarnHttpsProxy: yarnHttpsProxy,
        envProxies: envProxies,
        currentNpmProfile: currentNpmProfile,
        availableNpmProfiles: availableNpmProfiles
      });
    }
  );
}

function updateRegistry(registry, callback) {
  waterfall(
    [
      function (done) {
        cmd.run(
          'npm config set registry ' + registry,
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'yarn config set registry ' + registry,
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      }
    ],
    function () {
      log.echo();
      log.success('Registry set to ' + registry);
      callback();
    }
  );
}

function setRegistryProxies(http, https, callback) {
  waterfall(
    [
      function (done) {
        cmd.run(
          'npm config set proxy ' + http,
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'npm config set https-proxy ' + https,
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      }
    ],
    function () {
      log.echo();
      log.success('Registry proxies have been set');
      callback();
    }
  );
}

function unsetRegistryProxies(callback) {
  waterfall(
    [
      function (done) {
        cmd.run(
          'npm config delete proxy',
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'npm config delete https-proxy',
          {
            status: false
          },
          function () {
            done(null);
          }
        );
      }
    ],
    function () {
      log.echo();
      log.success('Registry proxies have been unset');
      callback();
    }
  );
}

module.exports = function () {
  var registries,
    currentSetting,
    newProfileActivation = 666;
  waterfall(
    [
      function (done) {
        displayStatus(function (err, data) {
          currentSetting = data;
          done(err);
        });
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
        if (currentSetting && !_.isEmpty(currentSetting.availableNpmProfiles)) {
          common.displayConfirmation(
            'Do you want to activate an existing Profile?',
            function (err) {
              if (err) {
                return done();
              } else {
                common.displayListOfOptions(
                  'Please choose one of the following options:',
                  currentSetting.availableNpmProfiles,
                  function (err, profileName) {
                    if (!err) {
                      common.switchToNpmrcProfile(profileName, function (err) {
                        if (!err) {
                          log.success(
                            '\nProfile "' + profileName + '" activated!'
                          );
                          return done(newProfileActivation);
                        } else {
                          return done();
                        }
                      });
                    } else {
                      return done(1);
                    }
                  }
                );
              }
            }
          );
        } else {
          return done();
        }
      },
      function (done) {
        common.displayConfirmation(
          'Do you want to update the current registry?',
          done
        );
      },
      function (done) {
        var questions = {
          type: 'list',
          name: 'registry',
          message: 'Please choose one of the following options:'
        };
        questions.choices = registries.slice();
        questions.choices.push({
          name: 'Enter a custom registry',
          value: 'custom'
        });
        inquirer.prompt(questions).then(function (answers) {
          var reg,
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
        common.unsetActiveNpmrcProfile();
        updateRegistry(registry, done);
      },
      function (done) {
        var httpProxy =
            currentSetting.envProxies.http || currentSetting.npmHttpProxy,
          httpsProxy =
            currentSetting.envProxies.https || currentSetting.npmHttpsProxy;
        if (
          httpProxy &&
          httpsProxy &&
          httpProxy !== common.NA &&
          httpsProxy !== common.NA
        ) {
          common.displayConfirmation(
            'Do you need to enable proxies for this registry?',
            function (err) {
              if (err) {
                return unsetRegistryProxies(done);
              } else {
                return setRegistryProxies(httpProxy, httpsProxy, done);
              }
            }
          );
        } else {
          return done();
        }
      },
      function (done) {
        common.displayConfirmation(
          'Do you want to save this configuration in a profile?',
          done
        );
      },
      function (done) {
        common.displayPromptWithInput('Please type a profile name:', function (
          err,
          profileName
        ) {
          if (!err) {
            common.createNpmrcProfile(profileName, function (err) {
              done(err);
            });
          }
        });
      },
      function (done) {
        log.success('\nProfile created and active');
        done();
      }
    ],
    function (abort) {
      if (abort && abort !== newProfileActivation) {
        log.echo('\nBye then!');
      }
    }
  );
};
