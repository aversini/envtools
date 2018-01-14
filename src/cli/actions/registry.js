const execa = require('execa');
const log = require('fedtools-logs');
const config = require('fedtools-config');
const waterfall = require('async/waterfall');
const parallel = require('async/parallel');
const _ = require('lodash');
const inquirer = require('inquirer');
const common = require('../../common');
const NA = 'N/A';
const DEFAULT_NPM_REGISTRY = 'http://registry.npmjs.org/';
const DEFAULT_YARN_REGISTRY = 'http://registry.yarnpkg.com';

// -- P R I V A T E  M E T H O D S
function getEnvProxyStatus() {
  return {
    http: process.env.HTTP_PROXY || NA,
    https: process.env.HTTPS_PROXY || NA,
    noProxy: process.env.no_proxy || NA
  };
}

function runCommand(command, callback) {
  let data = NA;

  const args = command.trim().split(' ');
  const bin = args[0];
  args.shift();

  execa(bin, args)
    .then((results) => {
      data = results.stdout;
      if (!data || data === 'undefined' || data === 'null') {
        data = NA;
      }
      return callback(null, data);
    })
    .catch(err => callback(err, data));
}

function displayStatus(callback) {
  const msg = [];
  let npmRegistry,
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
        const data = common.getExistingNpmrcProfiles();
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
      msg.push(`http proxy  : ${envProxies.http}`);
      msg.push(`https proxy : ${envProxies.https}`);
      envProxies.noProxy.split(',').forEach(function (data, idx) {
        if (idx === 0) {
          msg.push(`no_proxy    : ${data}`);
        } else {
          msg.push(`              ${data}`);
        }
      });
      msg.push('');

      msg.push(log.strToColor('yellow', 'NPM Configuration'));
      msg.push(`registry    : ${npmRegistry}`);
      msg.push(`http proxy  : ${npmHttpProxy}`);
      msg.push(`https proxy : ${npmHttpsProxy}`);
      msg.push('');

      msg.push(log.strToColor('yellow', 'Yarn Configuration'));
      msg.push(`registry    : ${yarnRegistry}`);
      msg.push(`http proxy  : ${yarnHttpProxy}`);
      msg.push(`https proxy : ${yarnHttpsProxy}`);

      if (currentNpmProfile || availableNpmProfiles) {
        msg.push('');
        msg.push(log.strToColor('yellow', 'Envtools Registry Profile(s)'));
        if (!currentNpmProfile) {
          currentNpmProfile = common.NA;
        }

        msg.push(`Current profile    : ${currentNpmProfile}`);
        msg.push(`Available profiles : ${availableNpmProfiles.join(', ')}`);
      }

      log.printMessagesInBox(msg);
      return callback(null, {
        npmRegistry,
        npmHttpProxy,
        npmHttpsProxy,
        yarnRegistry,
        yarnHttpProxy,
        yarnHttpsProxy,
        envProxies,
        currentNpmProfile,
        availableNpmProfiles
      });
    }
  );
}

function updateRegistry(registry, callback) {
  waterfall(
    [
      function (done) {
        runCommand(`npm config set registry ${registry}`,
          function () {
            done(null);
          }
        );
      },
      function (done) {
        runCommand(`yarn config set registry ${registry}`,
          function () {
            done(null);
          }
        );
      }
    ],
    function () {
      log.echo();
      log.success(`Registry set to ${registry}`);
      callback();
    }
  );
}

function setRegistryProxies(flag, http, https, callback) {
  const SET = flag ? 'set' : 'unset';
  const NPM_CMDS = flag
    ? [`npm config set proxy ${http}`, `npm config set https-proxy ${https}`]
    : ['npm config delete proxy', 'npm config delete https-proxy'];

  const fcts = _.map(NPM_CMDS, function (command) {
    return function (cb) {
      runCommand(command, function () {
        cb(null);
      });
    };
  });

  waterfall(fcts, function () {
    log.echo();
    log.success(`Registry proxies have been ${SET}`);
    callback();
  });
}

module.exports = function () {
  const newProfileActivation = 666;

  let registries, currentSetting;

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
                      common.switchToNpmrcProfile(profileName, function (
                        err,
                        name
                      ) {
                        if (!err) {
                          log.success(`\nProfile "${name}" activated!`);
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
          function (err) {
            if (err) {
              waterfall(
                [
                  function (done) {
                    common.displayConfirmation(
                      'Do you want to save this configuration in a profile?',
                      done
                    );
                  },
                  function (done) {
                    common.displayPromptWithInput(
                      'Please type a profile name:',
                      function (err, profileName) {
                        if (!err) {
                          common.createNpmrcProfile(profileName, function (err) {
                            done(err);
                          });
                        }
                      }
                    );
                  },
                  function (done) {
                    log.success('\nProfile created and active');
                    done();
                  }
                ],
                function () {
                  done(err);
                }
              );
            } else {
              return done(err);
            }
          }
        );
      },
      function (done) {
        const questions = {
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
          let reg;
          const reUrl = new RegExp(
            /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(localhost)|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
          );
          const questions = {
            type: 'input',
            name: 'custom',
            message: 'Type a custom registry (including protocol):',
            validate(val) {
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
        const httpProxy =
          currentSetting.envProxies.http || currentSetting.npmHttpProxy;
        const httpsProxy =
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
                return setRegistryProxies(false, null, null, done);
              } else {
                return setRegistryProxies(true, httpProxy, httpsProxy, done);
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
