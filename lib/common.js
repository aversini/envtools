/*eslint no-octal-escape:0*/
var
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),

  isMac = (process.platform === 'darwin'),
  isWindows = (process.platform === 'win32'),

  USER_INTERRUPT = -1,
  USER_WARNING = -2,
  USER_FATAL = -3,
  USER_IGNORE = -4,

  TYPE_SUDO = 100,
  TYPE_CHOWN = 200,
  ON = 'ON',
  OFF = 'OFF',
  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  DOT_PROFILE = path.join(process.env.HOME, '.profile'),
  DOT_BASH_PROFILE = path.join(process.env.HOME, '.bash_profile'),
  ENVTOOLS = {
    ROOTDIR: path.join(__dirname, '..'),
    THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
    SHELLDIR: path.join(__dirname, '..', 'shell'),
    PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
    PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
    SINOPIA_STATUS: path.join(RUNTIME_DIR, 'sinopia_status'),
    RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto')
  };

function _isMac() {
  return isMac;
}

function _isWindows() {
  return isWindows;
}

function _createRuntimeDir(callback) {
  fs.ensureDir(RUNTIME_DIR, function (err) {
    callback(err);
  });
}

function _chownFolder(folder, options, callback) {
  // resetting some folder permission to current owner
  var
    verbose = true,
    whoami = process.env.LOGNAME;

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }

  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: (options.debug) ? true : false
    }).output;
  }

  if (_.isString(whoami) && fs.existsSync(folder)) {
    whoami = whoami.replace('\n', '');
    cmd.sudo('chown -R ' + whoami + ' ' + folder, {
      status: verbose
    }, function (err, stderr) {
      if (err && stderr) {
        err = stderr;
      }
      callback(err, options);
    });
  } else {
    return callback(null, options);
  }
}

function _installNpmPackages(p, callback) {
  var
    packages = _.isString(p) ? [p] : p;

  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'list',
          name: 'action',
          message: 'Please choose one of the following options',
          choices: [{
            value: TYPE_CHOWN,
            short: 'chown',
            name: 'Change ownership of the destination folder to YOUR user (preferable)'
          }, {
            value: TYPE_SUDO,
            short: 'sudo',
            name: 'Install package(s) with sudo to overcome permission issue (not advised)'
          }]
        },
        rootNodeModules,
        destNodeModules = [];

      rootNodeModules = utilities.getGlobalNodeModulesPath();
      destNodeModules.push(rootNodeModules);
      _.each(packages, function (p) {
        destNodeModules.push(path.join(rootNodeModules, p));
      });
      utilities.isFolderWritable(destNodeModules, function (err) {
        if (err) {
          log.warning('Uhoh, destination folder is not writable...');
          inquirer.prompt(questions).then(function (answers) {
            return done(null, rootNodeModules, packages, answers.action);
          });
        } else {
          return done(null, null, packages, false);
        }
      });
    },
    function (destination, packages, action, done) {
      var
        actions = _.map(packages, function (pkg) {
          return function (iamdone) {
            var
              res,
              name = (pkg.value) ? pkg.value : pkg;

            res = cmd.run('npm install -g ' + name, {
              status: true
            });
            if (res.code !== 0 && res.stderr) {
              log.rainbow(res.stderr);
            }
            iamdone();
          };
        });

      if (action === false) {
        async.waterfall(actions, done);
      } else if (action === TYPE_SUDO) {
        cmd.sudo('npm install -g ' + packages.join(' '), {}, function (err, stderr) {
          log.debug(stderr);
          if (err) {
            log.error('Something went wrong or you did not grant admin access...');
          }
          return done(err);
        });
      } else if (action === TYPE_CHOWN) {
        _chownFolder(destination, {
          debug: false
        }, function (err) {
          log.debug(err);
          if (err) {
            log.error('Something went wrong or you did not grant admin access...');
          } else {
            async.waterfall(actions, done);
          }
        });
      } else {
        return done(USER_INTERRUPT);
      }
    }
  ], function (err) {
    callback(err);
  });
}

//-- E X P O R T S
exports.DOT_PROFILE = DOT_PROFILE;
exports.DOT_BASH_PROFILE = DOT_BASH_PROFILE;
exports.TYPE_AUTO = 't_auto';
exports.TYPE_MANUAL = 't_manual';
exports.TYPE_EXTRA = 't_extra';
exports.RUNTIME_DIR = RUNTIME_DIR;
exports.ENVTOOLS = ENVTOOLS;
exports.USER_INTERRUPT = USER_INTERRUPT;
exports.USER_WARNING = USER_WARNING;
exports.USER_FATAL = USER_FATAL;
exports.USER_IGNORE = USER_IGNORE;
exports.CUSTOM_PROMPT_DEFAULT = 1;
exports.CUSTOM_PROMPT_WITH_SINOPIA = 2;
exports.CUSTOM_PROMPT_WITH_SINOPIA_AND_NODE = 3;
exports.LOG_COLORS = {
  SUCCESS: 'green',
  FAILURE: 'red',
  DEFAULT: 'yellow',
  FOCUS_BG: _isWindows() ? '\033[30;47m' : '\033[30;43m',
  RESET_BG: '\033[0;90m',
  GREY: '\033[90m',
  BLUE: _isWindows() ? '\033[96m' : '\033[34m',
  RESET: '\033[0m'
};

exports.ON = ON;
exports.OFF = OFF;

exports.isWindows = _isWindows;
exports.isMac = _isMac;
exports.createRuntimeDir = _createRuntimeDir;
exports.chownFolder = _chownFolder;
exports.installNpmPackages = _installNpmPackages;
