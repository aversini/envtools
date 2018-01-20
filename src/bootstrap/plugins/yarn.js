const fs = require('fs-extra');
const path = require('path');
const waterfall = require('async/waterfall');
const parallel = require('async/parallel');
const inquirer = require('inquirer');
const cmd = require('fedtools-commands');
const log = require('fedtools-logs');
const backup = require('../../utilities/backup');
const common = require('../../common');
const NPM_CONFIG = path.join(process.env.HOME, '.npmrc');
const YARN_CONFIG = path.join(process.env.HOME, '.yarnrc');
const YARN_DEST = path.join(process.env.HOME, '.yarn');
const YARN_TAR_GZ = path.join(
  common.ENVTOOLS.THIRDDIR,
  'yarn',
  'latest.tar.gz'
);
const NA = 'N/A';
const NPM_REGISTRY =
  process.env.CUSTOM_NPM_REGISTRY || 'http://registry.npmjs.org/';
const YARN_REGISTRY =
  process.env.CUSTOM_NPM_REGISTRY || 'http://registry.yarnpkg.com';

let YARN_BIN = 'yarn',
  promptForRestart = false;

module.exports = function (options, callback) {
  let npmRegistry, yarnRegistry;
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
        `${log.strToColor(
          'cyan',
          'Hint:'
        )} type r ENTER or just restart your terminal...`
      );
    }
    log.echo();
    log.printMessagesInBox(msg, boxColor ? boxColor : common.LOG_COLORS.NOTICE);
  }

  function runCommand(command, callback) {
    let data = NA;

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

  waterfall(
    [
      function (done) {
        fs.emptyDir(YARN_DEST, function () {
          return done(null);
        });
      },
      function (done) {
        fs.mkdirp(YARN_DEST, function (err) {
          return done(null, err);
        });
      },
      function (cannotInstallYarn, done) {
        if (!cannotInstallYarn && !common.isWindows()) {
          // installing yarn ourselves on Mac and Linux...
          cmd.run(
            `tar zxf ${YARN_TAR_GZ} -C ${YARN_DEST} --strip 1`,
            {
              status: false
            },
            function (err) {
              if (!err) {
                YARN_BIN = path.join(process.env.HOME, '.yarn', 'bin', 'yarn');
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
          message: 'About to update npm and yarn configuration, continue?',
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
          runCommand('yarn config get registry', function (err, data) {
            yarnRegistry = data;
            done(err, goForIt);
          });
        } else {
          return done(null, goForIt);
        }
      },
      function (goForIt, done) {
        if (goForIt) {
          runCommand('npm config get registry', function (err, data) {
            npmRegistry = data;
            done(err, goForIt);
          });
        } else {
          return done(null, goForIt);
        }
      },
      function (goForIt, done) {
        if (goForIt) {
          parallel(
            [
              function (fini) {
                let cmdline;
                if (npmRegistry === NA) {
                  cmdline = `npm config set registry=${NPM_REGISTRY}`;
                } else {
                  cmdline = null;
                }
                if (cmdline) {
                  cmd.run(
                    cmdline,
                    {
                      status: !options.auto
                    },
                    fini
                  );
                } else {
                  fini();
                }
              },
              function (fini) {
                let cmdline;
                if (yarnRegistry === NA) {
                  cmdline = `${YARN_BIN} config set registry ${YARN_REGISTRY}`;
                } else {
                  cmdline = null;
                }
                if (cmdline) {
                  cmd.run(
                    cmdline,
                    {
                      status: !options.auto
                    },
                    fini
                  );
                } else {
                  fini();
                }
              },
              function (fini) {
                cmd.run(
                  'npm config set strict-ssl false',
                  {
                    status: !options.auto
                  },
                  function () {
                    fini();
                  }
                );
              },
              function (fini) {
                const cmdline = `${YARN_BIN} config set strict-ssl false`;
                cmd.run(
                  cmdline,
                  {
                    status: !options.auto
                  },
                  function () {
                    fini();
                  }
                );
              }
            ],
            function (err) {
              done(err);
            }
          );
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
