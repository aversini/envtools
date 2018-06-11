const fs = require('fs-extra');
const path = require('path');
const waterfall = require('async/waterfall');
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

let YARN_BIN = 'yarn',
  promptForRestart = false;

module.exports = function (options, callback) {
  backup([NPM_CONFIG, YARN_CONFIG]);

  function _displayRestartInfo(lines, boxColor) {
    let msg = [];
    if (lines) {
      msg = lines;
    } else {
      msg.push('Yarn has been automatically installed for you.');
      msg.push('You need to restart your session to use it');
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
        waterfall(
          [
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
