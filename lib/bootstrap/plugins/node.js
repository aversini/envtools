var
  _ = require('lodash'),
  path = require('path'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../common'),

  NPM_CONFIG = path.join(process.env.HOME, '.npmrc'),
  NPM_PACKAGES = [{
    value: 'eslint',
    short: 'eslint',
    name: '[eslint]     A pattern checker/linter for JavaScript.'
  }, {
    value: 'grunt-cli',
    short: 'grunt-cli',
    name: '[grunt-cli]  The grunt command line interface.'
  }, {
    value: 'gulp-cli',
    short: 'gulp-cli',
    name: '[gulp-cli]   The gulp command line interface.'
  }, {
    value: 'phantomjs@1.9.8',
    short: 'phantomjs@1.9.8',
    name: '[phantomjs]  Headless WebKit with JavaScript API.'
  }, {
    value: 'selleck',
    short: 'selleck',
    name: '[selleck]    YUI documentation generator.'
  }, {
    value: 'shifter',
    short: 'shifter',
    name: '[shifter]    YUI code builder'
  }, {
    value: 'sinopia',
    short: 'sinopia',
    name: '[sinopia]    Private npm repository server.'
  }, {
    value: 'svgo',
    short: 'svgo',
    name: '[svgo]       Tool for optimizing SVG files.'
  }, {
    value: 'unicorn-tool',
    short: 'unicorn',
    name: '[unicorn]    Framework code builder.'
  }, {
    value: 'yogi',
    short: 'yogi',
    name: '[yogi]       YUI gallery code builder.'
  }, {
    value: 'yuidocjs',
    short: 'yuidocjs',
    name: '[yuidocjs]   YUI JavaScript Documentation engine.'
  }];

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
      if (!options.auto) {
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
            message: 'Select one or more node packages you want to install',
            name: 'npms',
            choices: NPM_PACKAGES,
            pageSize: NPM_PACKAGES.length + 1,
            validate: function (val) {
              if (!val.length) {
                return 'Press <space> to select one or more packages, or <ctrl-c> to quit...';
              }
              return true;
            }
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
            var
              res,
              name = (pkg.value) ? pkg.value : pkg;

            res = cmd.run(sudoCmd + 'npm install -g ' + name, {
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
    if (!err && !options.auto) {
      err = common.USER_IGNORE;
    }
    callback(err, options);
  });
};
