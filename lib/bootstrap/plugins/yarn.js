var
  fs = require('fs-extra'),
  path = require('path'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../../common'),

  promptForRestart = false,

  NPM_CONFIG = path.join(process.env.HOME, '.npmrc'),
  YARN_CONFIG = path.join(process.env.HOME, '.yarnrc'),
  YARN_DEST = path.join(process.env.HOME, '.yarn'),
  YARN_TAR_GZ = path.join(common.ENVTOOLS.THIRDDIR, 'yarn', 'latest.tar.gz'),
  YARN_BIN = 'yarn',

  NPM_REGISTRY = process.env.CUSTOM_NPM_REGISTRY || 'http://registry.npmjs.org/',
  YARN_REGISTRY = process.env.CUSTOM_NPM_REGISTRY || 'http://registry.yarnpkg.com';

module.exports = function (options, callback) {
  backup([NPM_CONFIG, YARN_CONFIG]);

  function _displayRestartInfo(lines, boxColor) {
    var msg = [];
    if (lines) {
      msg = lines;
    } else {
      msg.push('Yarn has been automatically installed for you.');
      msg.push('You need to restart your session to use it.');
    }
    if (process.env.ENVTOOLS_VERSION) {
      msg.push('');
      msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
    }
    log.echo();
    log.printMessagesInBox(msg,
      (boxColor) ? boxColor : common.LOG_COLORS.NOTICE);
  }

  async.waterfall(
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
          cmd.run('tar zxf ' + YARN_TAR_GZ + ' -C ' + YARN_DEST + ' --strip 1', {
            status: false
          }, function (err) {
            if (!err) {
              YARN_BIN = path.join(process.env.HOME, '.yarn', 'bin', 'yarn');
              promptForRestart = true;
            }
            done(null);
          });
        } else {
          return done(null);
        }
      },
      function (done) {
        var
          questions = {
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
        var cmdline;
        if (goForIt) {
          if (process.env.SINOPIA_STATUS && process.env.SINOPIA_STATUS === common.ON) {
            cmdline = 'npm config set registry http://localhost:4873/';
          } else {
            cmdline = 'npm config set registry=' + NPM_REGISTRY;
          }
          cmd.run(cmdline, {
            status: !options.auto
          }, function () {
            cmd.run('npm config set strict-ssl false', {
              status: !options.auto
            }, function () {
              done(null, goForIt);
            });
          });
        } else {
          return done(null, goForIt);
        }
      },
      function (goForIt, done) {
        var cmdline;
        if (goForIt) {
          cmdline = YARN_BIN + ' config set registry ' + YARN_REGISTRY;
          cmd.run(cmdline, {
            status: !options.auto
          }, function () {
            cmdline = YARN_BIN + ' config set strict-ssl false';
            cmd.run(cmdline, {
              status: !options.auto
            }, function () {
              done();
            });
          });
        } else {
          return done();
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
    });
};
