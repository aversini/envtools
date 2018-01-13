let _ = require('lodash'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  waterfall = require('async/waterfall'),
  inquirer = require('inquirer'),
  bootstrapHomebrew = require('./homebrew'),
  common = require('../../common');

module.exports = function (options, callback) {
  let ruby, brew, compass, gem;

  function _installRuby(done) {
    if (process.platform === 'darwin') {
      if (brew) {
        cmd.run(
          'brew install ruby',
          {
            status: !options.auto
          },
          done
        );
      } else {
        bootstrapHomebrew(options, function (err) {
          if (!err) {
            cmd.run(
              'brew install ruby',
              {
                status: !options.auto
              },
              done
            );
          }
        });
      }
    } else {
      log.notice('Cannot find Ruby (ruby), please install it manually.');
      return done(common.USER_INTERRUPT);
    }
  }

  function _installCompass(done) {
    let cmdline;

    if (gem) {
      if (process.platform === 'darwin') {
        cmdline =
          'gem install --no-ri --no-rdoc compass --install-dir /usr/local/gems';
      } else {
        cmdline = 'sudo -E gem install --no-ri --no-rdoc compass';
      }
      cmd.run(
        cmdline,
        {
          status: !options.auto
        },
        done
      );
    } else {
      log.notice('Cannot find Rubygems (gem), please install it manually.');
      return done(common.USER_INTERRUPT);
    }
  }

  function _isRubyVersionOk(done) {
    let RUBY_MAJOR_VERSION_LOCATION = 5,
      RUBY_MINOR_VERSION_MAX_FOR_0 = 8,
      res = cmd.run('ruby -v', {
        status: false
      }).output,
      version = res
        .split(' ')[1]
        .slice(0, RUBY_MAJOR_VERSION_LOCATION)
        .split('.'),
      major = Number(version[0]),
      minor = Number(version[1]);

    if (major > 1 || (major <= 1 && minor > RUBY_MINOR_VERSION_MAX_FOR_0)) {
      return done();
    } else {
      return done(1);
    }
  }

  function _isCompassVersionOk(done) {
    let res = cmd.run('compass -v', {
        status: false
      }).output,
      major = Number(res.split(' ')[1].charAt(0));

    if (major >= 1) {
      return done();
    } else {
      return done(1);
    }
  }

  waterfall(
    [
      function (done) {
        const questions = {
          message: 'About to install/update Ruby and Compass, continue?',
          type: 'confirm',
          name: 'goForIt',
          default: true
        };

        inquirer.prompt(questions).then(function (answers) {
          options.actionsPending++;
          if (answers.goForIt) {
            options.actionsDone++;
            return done();
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      },
      function (done) {
        ruby = cmd.run('which ruby', {
          status: false
        }).output;
        brew = cmd.run('which brew', {
          status: false
        }).output;
        compass = cmd.run('which compass', {
          status: false
        }).output;
        gem = cmd.run('which gem', {
          status: false
        }).output;

        done();
      },
      function (done) {
        if (_.isString(ruby)) {
          _isRubyVersionOk(function (err) {
            if (err) {
              _installRuby(done);
            } else {
              return done();
            }
          });
        } else {
          _installRuby(done);
        }
      },
      function (done) {
        if (_.isString(compass)) {
          _isCompassVersionOk(function (err) {
            if (err) {
              _installCompass(done);
            } else {
              return done();
            }
          });
        } else {
          _installCompass(done);
        }
      }
    ],
    function (err) {
      if (options.auto && err === common.USER_INTERRUPT) {
        err = null;
      }
      callback(err, options);
    }
  );
};
