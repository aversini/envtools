/* eslint indent: 0 */
var
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),
  download = require('download'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),

  common = require('../common'),

  MAVEN_VERSION = '3.3.9',
  MAVEN_DEST_DIR = path.join(common.RUNTIME_DIR,
    'apache-maven-' + MAVEN_VERSION),
  MAVEN_BIN_URL = 'http://archive.apache.org/dist/maven/maven-3/' +
  MAVEN_VERSION + '/binaries/apache-maven-' + MAVEN_VERSION + '-bin.zip',

  MAVEN_SETTINGS_SRC = path.join(common.ENVTOOLS.THIRDDIR, 'maven', 'settings-encrypted.xml'),
  MAVEN_SETTINGS_DST = path.join(process.env.HOME, '.m2', 'settings.xml');

module.exports = function (options, callback) {
  var
    resultingFolder;

  function _displayMavenRestartInfo(lines) {
    var msg = [];
    if (lines) {
      msg = lines;
    } else {
      msg.push('Before using Maven, you need to restart your session.');
    }
    if (process.env.ENVTOOLS_VERSION) {
      msg.push('');
      msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
    }
    log.printMessagesInBox(msg);
  }

  function _installM2Settings(done) {
    var questions = [{
      type: 'confirm',
      name: 'know',
      message: 'Maven settings.xml is encrypted... Do you know the password?',
      default: true
    }];
    inquirer.prompt(questions).then(function (answers) {
      if (answers.know) {
        questions = [{
          type: 'password',
          name: 'password',
          message: 'Please type the password:',
          validate: function (val) {
            if (!val) {
              return 'Password cannot be empty...';
            }
            return true;
          }
        }];
        inquirer.prompt(questions).then(function (answers) {
          utilities.cryptographer({
            file: MAVEN_SETTINGS_SRC,
            output: MAVEN_SETTINGS_DST,
            status: false,
            encrypt: false,
            password: answers.password
          }, function (err) {
            return done(err);
          });
        });
      } else {
        return done();
      }
    });
  }

  async.waterfall([
    function (done) {
      if (!process.env.RUNTIME_DIR) {
        process.env.RUNTIME_DIR = path.join(process.env.HOME, '.envtools');
      }
      common.createRuntimeDir(done);
    },
    function (done) {
      var questions;
      if (fs.existsSync(MAVEN_SETTINGS_DST)) {
        questions = [{
          type: 'confirm',
          name: 'change',
          message: 'Maven settings.xml file exists... Do you want to replace it?',
          default: false
        }];
        inquirer.prompt(questions).then(function (answers) {
          if (answers.change) {
            _installM2Settings(done);
          } else {
            return done();
          }
        });
      } else {
        utilities.mkdirp.sync(path.join(process.env.HOME, '.m2'));
        _installM2Settings(done);
      }
    },
    function (done) {
      resultingFolder = MAVEN_DEST_DIR;
      if (!fs.existsSync(resultingFolder)) {
        // need to download maven
        return done();
      } else {
        if (!options.auto) {
          _displayMavenRestartInfo([
            'Maven is already installed...',
            'Before using it, you need to restart your session.'
          ]);
        }
        return done(common.USER_IGNORE);
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          message: 'About to install Maven ' + MAVEN_VERSION + ', continue?',
          name: 'goForIt',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        if (answers.goForIt) {
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
        }).then(function () {
          done();
        }, function (err) {
          log.error('Unable to download Maven...');
          log.echo(err);
          done();
        });
      } else {
        return done(common.USER_INTERRUPT);
      }
    },
    function (done) {
      options.needToCheckForMaven = false;
      if (!options.auto) {
        _displayMavenRestartInfo();
      }
      done();
    }
  ], function (err) {
    if (err && (err === common.USER_INTERRUPT || err === common.USER_IGNORE)) {
      if (options.auto) {
        err = null;
      }
    }
    callback(err, options);
  });
};
