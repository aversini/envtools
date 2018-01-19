/* eslint indent: 0 */
const fs = require('fs-extra');
const waterfall = require('async/waterfall');
const inquirer = require('inquirer');
const path = require('path');
const download = require('download');
const log = require('fedtools-logs');
const common = require('../../common');
const MAVEN_VERSION = '3.3.9';
const MAVEN_DEST_DIR = path.join(
  common.RUNTIME_DIR,
  `apache-maven-${MAVEN_VERSION}`
);
const MAVEN_BIN_URL = `http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.zip`;
const MAVEN_USER_SETTINGS_DST = path.join(process.env.HOME, '.m2');

module.exports = function (options, callback) {
  let resultingFolder;

  function _displayMavenRestartInfo(lines, boxColor) {
    let msg = [];
    if (lines) {
      msg = lines;
    } else {
      msg.push('Before using Maven, you need to restart your session.');
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
    log.printMessagesInBox(
      msg,
      boxColor ? boxColor : common.LOG_COLORS.SUCCESS
    );
  }

  waterfall(
    [
      function (done) {
        if (!process.env.RUNTIME_DIR) {
          process.env.RUNTIME_DIR = path.join(process.env.HOME, '.envtools');
        }
        common.createRuntimeDir(done);
      },
      function (done) {
        fs.ensureDir(MAVEN_USER_SETTINGS_DST, function () {
          done();
        });
      },
      function (done) {
        resultingFolder = MAVEN_DEST_DIR;
        if (!fs.existsSync(resultingFolder)) {
          // need to download maven
          return done();
        } else {
          if (!options.auto) {
            _displayMavenRestartInfo(
              [
                'Maven is already installed...',
                'Before using it, you may need to restart your session.'
              ],
              common.LOG_COLORS.WARNING
            );
          }
          return done(common.USER_IGNORE);
        }
      },
      function (done) {
        const questions = {
          type: 'confirm',
          message: `About to install Maven ${MAVEN_VERSION}, continue?`,
          name: 'goForIt',
          default: true
        };
        inquirer.prompt(questions).then(function (answers) {
          options.actionsPending++;
          if (answers.goForIt) {
            options.actionsDone++;
            return done(null, true);
          } else {
            return done(null, false);
          }
        });
      },
      function (goForIt, done) {
        if (goForIt) {
          download(MAVEN_BIN_URL, common.RUNTIME_DIR, {
            mode: '755',
            extract: true
          }).then(
            function () {
              done();
            },
            function (err) {
              log.error('Unable to download Maven...');
              log.echo(err);
              done(common.USER_IGNORE);
            }
          );
        } else {
          return done(common.USER_INTERRUPT);
        }
      },
      function (done) {
        options.needToCheckForMaven = false;
        if (!options.auto) {
          _displayMavenRestartInfo();
        }
        done(common.USER_IGNORE);
      }
    ],
    function (err) {
      if (
        err &&
        (err === common.USER_INTERRUPT || err === common.USER_IGNORE)
      ) {
        if (options.auto) {
          err = null;
        }
      }
      callback(err, options);
    }
  );
};
