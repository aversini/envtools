const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const waterfall = require('async/waterfall');
const inquirer = require('inquirer');
const cmd = require('fedtools-commands');
const semver = require('semver');
const log = require('fedtools-logs');
const utilities = require('fedtools-utilities');
const backup = require('../../backup');
const common = require('../../common');
const NPM_CONFIG = path.join(process.env.HOME, '.npmrc');
const YARN_CONFIG = path.join(process.env.HOME, '.yarnrc');
const YARN_DEST = path.join(process.env.HOME, '.yarn');
const YARN_TAR_GZ = path.join(common.ENVTOOLS.THIRDDIR, 'yarn', 'latest.tar.gz');
const NPM_PACKAGES = [
  {
    value: ['eslint', 'eslint-plugin-react'],
    short: 'eslint',
    name: '[eslint] ...... Pattern checker/linter for JavaScript.'
  },
  {
    value: 'fastlint',
    short: 'fastlint',
    name: '[fastlint] .... Linter helper.'
  },
  {
    value: 'fedtools',
    short: 'fedtools',
    name: '[fedtools] .... Framework code builder.'
  },
  {
    value: 'grunt-cli',
    short: 'grunt-cli',
    name: '[grunt-cli] ... The grunt command line interface.'
  },
  {
    value: 'gulp-cli',
    short: 'gulp-cli',
    name: '[gulp-cli] .... The gulp command line interface.'
  },
  {
    value: 'npm-check',
    short: 'npm-check',
    name:
      '[npm-check] ... Check for outdated, incorrect, and unused dependencies.'
  },
  {
    value: 'selleck',
    short: 'selleck',
    name: '[selleck] ..... YUI documentation generator.'
  },
  {
    value: 'serve',
    short: 'serve',
    name: '[serve]  ...... Static server.'
  },
  {
    value: 'sinopia',
    short: 'sinopia',
    name: '[sinopia] ..... Private npm repository server.'
  },
  {
    value: 'surge',
    short: 'surge',
    name: '[surge] ....... Static web publishing.'
  },
  {
    value: 'svgo',
    short: 'svgo',
    name: '[svgo] ........ Tool for optimizing SVG files.'
  },
  {
    value: 'unicorn-tool',
    short: 'unicorn',
    name: '[unicorn] ..... Framework code builder.'
  },
  {
    value: 'yogi',
    short: 'yogi',
    name: '[yogi] ........ YUI gallery code builder.'
  },
  {
    value: 'yuidocjs',
    short: 'yuidocjs',
    name: '[yuidocjs] .... YUI JavaScript Documentation engine.'
  }
];

let
  promptForRestart = false,
  YARN_BIN = 'yarn',
  isYarn = utilities.isAppInstalled({
    name: 'yarn'
  });

function _displayNodeWarningWithProxy(done) {
  const isProxy = fs.existsSync(common.ENVTOOLS.PROXY_FILE);
  const isNode = semver.gte(process.version, '6.0.0');
  const isSinopia =
    process.env.SINOPIA_STATUS === common.ON ||
    process.env.SINOPIA_STATUS === common.OFF;
  const msg = [];

  if (isProxy && isNode && !isSinopia && !isYarn) {
    msg.push(log.strToColor('red', '                         W A R N I N G\n'));
    msg.push(
      'It seems that you have a proxy and are using Node v5 or higher...'
    );
    msg.push(
      `There is a known issue that may render your ${
        log.strToColor('cyan', 'npm install')
      } commands`
    );
    msg.push(
      `extremelly slow... It is recommended that you ${
        log.strToColor('red', 'do not install')
      } any`
    );
    msg.push(
      `node packages before installing ${
        log.strToColor('cyan', 'yarn')
      } (a replacement for npm).`
    );
    msg.push('');
    msg.push('Please see installation guides for your OS here: ');
    msg.push(log.strToColor('cyan', 'https://yarnpkg.com/en/docs/install'));
    msg.push('');
    msg.push('Thanks!');
    log.printMessagesInBox(msg);
    return done(1);
  }
  return done();
}

module.exports = function (options, callback) {
  backup([NPM_CONFIG, YARN_CONFIG]);

  function _displayRestartInfo(lines, boxColor) {
    let msg = [];
    if (lines) {
      msg = lines;
    } else {
      msg.push('Yarn has been automatically installed for you.');
      msg.push('You need to restart your session to use it.');
    }
    if (process.env.ENVTOOLS_VERSION) {
      msg.push('');
      msg.push(
        `${log.strToColor('cyan', 'Hint:')
        } type r ENTER or just restart your terminal...`
      );
    }
    log.echo();
    log.printMessagesInBox(msg, boxColor ? boxColor : common.LOG_COLORS.NOTICE);
  }

  waterfall(
    [
      function (done) {
        if (!isYarn) {
          fs.mkdirp(YARN_DEST, function (err) {
            return done(null, err);
          });
        } else {
          return done(null, false);
        }
      },
      function (cannotInstallYarn, done) {
        if (!isYarn && !cannotInstallYarn && !common.isWindows()) {
          // installing yarn ourselves on Mac and Linux...
          cmd.run(
            `tar zxf ${YARN_TAR_GZ} -C ${YARN_DEST} --strip 1`,
            {
              status: false
            },
            function (err) {
              if (!err) {
                YARN_BIN = path.join(process.env.HOME, '.yarn', 'bin', 'yarn');
                isYarn = true;
                promptForRestart = true;
              }
              done(null);
            }
          );
        } else {
          return done(null);
        }
      },
      function (done) {
        const questions = {
          type: 'confirm',
          name: 'goForIt',
          message: isYarn
            ? 'About to update npm and yarn configuration, continue?'
            : 'About to update npm configuration, continue?',
          default: true
        };
        inquirer.prompt(questions).then(function (answers) {
          options.actionsPending++;
          if (answers.goForIt) {
            options.actionsDone++;
            return done(null, 1);
          } else {
            return done(null, 0);
          }
        });
      },
      function (goForIt, done) {
        if (goForIt) {
          cmd.run(
            'npm config set strict-ssl false',
            {
              status: !options.auto
            },
            function () {
              done(null, goForIt);
            }
          );
        } else {
          return done(null, goForIt);
        }
      },
      function (goForIt, done) {
        let cmdline;
        if (goForIt && isYarn) {
          cmdline = `${YARN_BIN} config set strict-ssl false`;
          cmd.run(
            cmdline,
            {
              status: !options.auto
            },
            function () {
              done();
            }
          );
        } else {
          return done();
        }
      },
      function (done) {
        const questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'Continue?',
          default: false
        };
        _displayNodeWarningWithProxy(function (err) {
          if (!options.auto && err) {
            // need to ask a simple 'continue?' in manual mode
            inquirer.prompt(questions).then(function (answers) {
              if (answers.goForIt) {
                return done();
              } else {
                return done(common.USER_INTERRUPT);
              }
            });
          } else {
            return done();
          }
        });
      },
      function (done) {
        const questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install core node packages, continue?',
          default: true
        };
        if (!options.auto) {
          // no need to ask the question in manual mode
          return done(null, 1);
        } else {
          inquirer.prompt(questions).then(function (answers) {
            options.actionsPending++;
            if (answers.goForIt) {
              options.actionsDone++;
              return done(null, 1);
            } else {
              return done(null, 0);
            }
          });
        }
      },
      function (goForIt, done) {
        if (goForIt) {
          // in manual mode, let's ask the user to choose
          // which package they want to install...
          if (!options.auto) {
            inquirer
              .prompt([
                {
                  type: 'checkbox',
                  message:
                    'Select one or more node packages you want to install',
                  name: 'npms',
                  choices: NPM_PACKAGES,
                  pageSize: NPM_PACKAGES.length + 1,
                  validate(val) {
                    if (!val.length) {
                      return 'Press <space> to select one or more packages, or <ctrl-c> to quit...';
                    }
                    return true;
                  }
                }
              ])
              .then(function (answers) {
                return done(null, answers.npms);
              });
          } else {
            // in auto mode, install all packages
            return done(
              null,
              _.map(NPM_PACKAGES, function (p) {
                return p.value;
              })
            );
          }
        } else {
          return done(common.USER_INTERRUPT);
        }
      },
      function (packages, done) {
        if (packages && packages.length) {
          // flatten the packages in case there is an array within the array, that is
          // multiple entries for one package (for example eslint)
          return common.installNpmPackages(
            _.flatten(packages),
            isYarn,
            YARN_BIN,
            done
          );
        } else {
          return done(common.USER_INTERRUPT);
        }
      }
    ],
    function (err) {
      if (promptForRestart) {
        _displayRestartInfo();
      }
      if (options.auto && err === common.USER_INTERRUPT) {
        err = null;
      }
      if (!err && !options.auto) {
        err = common.USER_IGNORE;
      }
      callback(err, options);
    }
  );
};
