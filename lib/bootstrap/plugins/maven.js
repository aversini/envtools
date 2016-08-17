/* eslint indent: 0 */
var
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),
  Download = require('download'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),

  common = require('../common'),

  MAVEN_VERSION = '3.3.9',
  MAVEN_DEST_DIR = path.join(common.RUNTIME_DIR,
    'apache-maven-' + MAVEN_VERSION),
  MAVEN_BIN_URL = 'http://archive.apache.org/dist/maven/maven-3/' +
  MAVEN_VERSION + '/binaries/apache-maven-' + MAVEN_VERSION + '-bin.zip';

module.exports = function (options, callback) {
  var
    m2SettingsDest = path.join(process.env.HOME, '.m2', 'settings.xml'),
    resultingFolder,
    url = MAVEN_BIN_URL;

  function _displayMavenRestartInfo(line) {
    var msg = [];
    if (line) {
      msg.push(line);
    }
    msg.push('Before using Maven, you need to restart your session.');
    if (process.env.ENVTOOLS_VERSION) {
      msg.push('');
      msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
    }
    log.printMessagesInBox(msg);
  }

  function _installM2Settings(done) {
    var
      srcFile = path.join(common.ENVTOOLS.THIRDDIR, 'wfria2', 'settings.xml');
    fs.copy(srcFile, m2SettingsDest, done);
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
      if (fs.existsSync(m2SettingsDest)) {
        questions = [{
          type: 'confirm',
          name: 'change',
          message: 'Maven settings.xml exists... Do you want to replace it?',
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
          _displayMavenRestartInfo('Maven is already installed...');
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
        new Download({
            mode: '755',
            extract: true
          })
          .get(url)
          .dest(common.RUNTIME_DIR)
          .run(function (err) {
            if (err) {
              log.error('Unable to download Maven...');
              log.echo(err);
            }
            done(err);
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
      err = null;
    }
    callback(err, options);
  });
};
