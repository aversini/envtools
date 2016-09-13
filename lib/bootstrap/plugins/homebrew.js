/* eslint indent: 0 */
var
  _ = require('lodash'),
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),
  download = require('download'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),
  fixUsrLocal = require('./usrlocal'),

  common = require('../common');

module.exports = function (options, callback) {
  var
    brewAlreadyInstalled = false;

  if (process.platform !== 'darwin') {
    log.warning('Homebrew can only be installed on Mac.');
    if (options.auto) {
      return callback(null, options);
    }
    return callback(common.USER_FATAL, options);
  } else {
    async.waterfall([
        function (done) {
          var
            brew = cmd.run('which brew', {
              status: false
            }).output;
          if (_.isString(brew)) {
            brewAlreadyInstalled = true;
          }
          done();
        },
        function (done) {
          var
            questions = {
              type: 'confirm',
              name: 'goForIt',
              default: true
            };
          if (brewAlreadyInstalled) {
            questions.message = 'About to update Homebrew, continue?';
          } else {
            questions.message = 'About to install Homebrew, continue?';
          }
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
            fixUsrLocal(options, function () {
              done(null, goForIt);
            });
          } else {
            return done(null, goForIt);
          }
        },
        function (goForIt, done) {
          var
            destFolder = path.join(common.RUNTIME_DIR, 'homebrew'),
            url = 'https://github.com/Homebrew/homebrew/tarball/master';

          if (goForIt) {
            if (brewAlreadyInstalled) {
              cmd.run('brew update', {
                status: (options.auto) ? false : true
              }, function (err, stderr) {
                if (err && stderr) {
                  log.echo(stderr);
                }
                done(err);
              });
            } else {
              download(url, destFolder, {
                mode: '755',
                extract: true,
                strip: true
              }).then(function () {
                // success
                fs.copy(destFolder, '/usr/local', function (err) {
                  if (err) {
                    log.error('Unable to install Homebrew...');
                    return done(err);
                  } else {
                    cmd.run('brew update', {
                      status: (options.auto) ? false : true
                    }, function (err, stderr) {
                      if (err && stderr) {
                        log.echo(stderr);
                      }
                      done(err);
                    });
                  }
                });
              }, function (err) {
                // failure
                log.error('Unable to download Homebrew...');
                log.echo(err);
                return done(err);
              });
            }
          } else {
            return done(common.USER_INTERRUPT);
          }
        },
        function (done) {
          fs.writeFile(path.join(process.env.HOME, '.gemrc'), 'gem: -n/usr/local/bin', {
            flag: 'w'
          }, done);
        },
        function (done) {
          cmd.run('brew install wget', {
            status: (options.auto) ? false : true
          }, function (err, stderr) {
            if (err && stderr) {
              log.error(stderr);
            }
            done(err);
          });
        }
      ],
      function (err) {
        if (err && (err === common.USER_INTERRUPT || err === common.USER_IGNORE)) {
          err = null;
        }
        callback(err, options);
      });
  }
};
