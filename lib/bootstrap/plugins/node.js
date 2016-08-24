var
  _ = require('underscore'),
  path = require('path'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../common'),

  NPM_CONFIG = path.join(process.env.HOME, '.npmrc'),
  NPM_PACKAGES = [
    'eslint',
    'grunt-cli',
    'gulp-cli',
    'phantomjs@1.9.8',
    'selleck',
    'shifter',
    'sinopia',
    'svgo',
    'unicorn-tool',
    'yeti',
    'yogi',
    'yuidocjs'
  ];

module.exports = function (options, callback) {
  backup(NPM_CONFIG);
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to update npm configuration, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        if (answers.goForIt) {
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
          cmdline = 'npm config set registry=http://registry.npmjs.org/';
        }
        cmd.run(cmdline, {
          status: (options.auto) ? false : true
        }, function () {
          done();
        });
      } else {
        return done();
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install core node packages, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        if (answers.goForIt) {
          return done(null, 1);
        } else {
          return done(null, 0);
        }
      });
    },
    function (goForIt, done) {
      // forcing sudo on other than Mac and Windows
      if (process.platform === 'darwin' || process.platform === 'win32') {
        return done(null, goForIt, false);
      } else {
        return done(null, goForIt, true);
      }
    },
    function (goForIt, sudo, done) {
      if (goForIt) {
        // in manual mode, let's ask the user to choose
        // which package they want to install...
        if (!options.auto) {
          inquirer.prompt([{
            type: 'checkbox',
            message: 'Select all packages you want to install',
            name: 'npms',
            choices: NPM_PACKAGES,
            pageSize: NPM_PACKAGES.length + 1
          }]).then(function (answers) {
            return done(null, sudo, answers.npms);
          });
        } else {
          return done(null, sudo, NPM_PACKAGES);
        }
      } else {
        return done(common.USER_INTERRUPT);
      }
    },
    function (sudo, packages, done) {
      if (sudo && !options.auto) {
        utilities.forceAdminAccess(true, function () {
          done(null, sudo, packages);
        });
      } else {
        return done(null, sudo, packages);
      }
    },
    function (sudo, packages, done) {
      var
        sudoCmd = (sudo) ? 'sudo -E ' : '',
        actions = _.map(packages, function (pkg) {
          return function (iamdone) {
            var res = cmd.run(sudoCmd + 'npm install -g ' + pkg, {
              status: true
            });
            if (res.code !== 0 && res.stderr) {
              log.rainbow(res.stderr);
            }
            iamdone();
          };
        });
      if (packages && packages.length) {
        async.waterfall(actions, done);
      } else {
        return done(common.USER_INTERRUPT);
      }
    }
  ], function (err) {
    if (options.auto && err === common.USER_INTERRUPT) {
      err = null;
    }
    callback(err, options);
  });
};
