/*eslint no-octal-escape:0*/
var
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  config = require('fedtools-config'),
  utilities = require('fedtools-utilities'),

  isMac = (process.platform === 'darwin'),
  isWindows = (process.platform === 'win32'),
  isLinux = (process.platform === 'linux' ||
    process.platform === 'freebsd' ||
    process.platform === 'openbsd'),

  USER_INTERRUPT = -1,
  USER_WARNING = -2,
  USER_FATAL = -3,
  USER_IGNORE = -4,

  NB_SPACES_FOR_TAB = 2,
  TYPE_SUDO = 100,
  TYPE_CHOWN = 200,
  TYPE_PREFIX = 300,
  ON = 'ON',
  OFF = 'OFF',
  NA = 'N/A',
  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  RUNTIME_BIN_DIR = path.join(process.env.HOME, '.envtools', 'bin'),
  DOT_PROFILE = path.join(process.env.HOME, '.profile'),
  DOT_BASH_PROFILE = path.join(process.env.HOME, '.bash_profile'),
  ENVTOOLS = {
    NAME: 'Envtools',
    VERSION: (process.env.ENVTOOLS_VERSION) ? 'v' + process.env.ENVTOOLS_VERSION : '',
    ROOTDIR: path.join(__dirname, '..'),
    THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
    SHELLDIR: path.join(__dirname, '..', 'shell'),
    PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
    PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
    SINOPIA_STATUS: path.join(RUNTIME_DIR, 'sinopia_status'),
    HELP_STATUS: path.join(RUNTIME_DIR, 'help_status.json'),
    RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto'),
    SYSTEM_INFO: path.join(RUNTIME_DIR, 'info.json'),
    AUTO_DONE: path.join(RUNTIME_DIR, 'auto'),
    CFG_AUTOLOAD: 'autoload',
    CFG_AUTOLOAD_LABEL: 'Automatically load Envtools at each session',
    CFG_BANNER: 'banner',
    CFG_BANNER_LABEL: 'Enable Envtools Welcome Banner',
    CFG_AUTOCHECK: 'autocheck',
    CFG_AUTOCHECK_LABEL: 'Automatically check for new version',
    CFG_CUSTOM_PROMPT: 'prompt',
    CFG_CUSTOM_PROMPT_LABEL: 'Enable Envtools Custom Command Line Prompt'
  };

function _isMac() {
  return isMac;
}

function _isWindows() {
  return isWindows;
}

function _isLinux() {
  return isLinux;
}

function _createRuntimeDir(callback) {
  var
    bin1Src = path.join(ENVTOOLS.THIRDDIR, 'growlnotify', 'growlnotify.exe'),
    bin2Src = path.join(ENVTOOLS.THIRDDIR, 'growlnotify', 'growlnotify.com'),
    bin1Dest = path.join(RUNTIME_BIN_DIR, 'growlnotify.exe'),
    bin2Dest = path.join(RUNTIME_BIN_DIR, 'growlnotify.com');

  fs.ensureDir(RUNTIME_BIN_DIR, function (err) {
    if (_isWindows()) {
      // need to drop growlnotify if not there...
      if (!fs.existsSync(bin1Dest) || !fs.existsSync(bin2Dest)) {
        fs.copy(bin1Src, bin1Dest, function () {
          fs.copy(bin2Src, bin2Dest, function () {
            callback();
          });
        });
      } else {
        return callback();
      }
    } else {
      return callback(err);
    }
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
      status: Boolean(options.debug)
    }).output;
  }

  if (_.isString(whoami) && fs.existsSync(folder)) {
    whoami = whoami.replace('\n', '');
    cmd.sudo('chown -R ' + whoami + ' ' + folder, {
      name: 'Envtools',
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

function _installNpmPackages(p, isYarnAvailable, callback) {
  var
    cmdline,
    packages = _.isString(p) ? [p] : p,
    yarnConfig = config.getKey(config.FEDTOOLSRCKEYS.yarnvsnpm) || 'yarn';

  if (yarnConfig === 'yarn' && isYarnAvailable) {
    cmdline = 'yarn global add ';
  } else {
    cmdline = 'npm install -g ';
  }

  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'list',
          name: 'action',
          message: 'Please choose one of the following options',
          choices: [{
            value: TYPE_PREFIX,
            short: 'prefix',
            name: 'Change the default location for global npm installation (preferable)'
          }, {
            value: TYPE_CHOWN,
            short: 'chown',
            name: 'Change ownership of the default destination folder to YOUR user (preferable)'
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
        actions;

      actions = _.map(packages, function (pkg) {
        return function (iamdone) {
          var
            res,
            name = (pkg.value) ? pkg.value : pkg;

          res = cmd.run(cmdline + name, {
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
        cmd.sudo(cmdline + packages.join(' '), {
          name: 'Envtools'
        }, function (err, stderr) {
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
      } else if (action === TYPE_PREFIX) {
        cmd.run('npm config set prefix ~/npm', {
          status: true
        }, function (err, stderr) {
          log.debug(err);
          if (err) {
            log.error('Something went wrong...');
            if (stderr) {
              log.rainbow(stderr);
            } else {
              log.rainbow(err);
            }
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

function defaultSortFn(a, b) {
  return a.localeCompare(b);
}

function _sortObject(src, comparator) {
  var
    out;

  if (_.isArray(src)) {
    return src.map(function (item) {
      return _sortObject(item, comparator);
    });
  }

  if (_.isObject(src)) {
    out = {};

    Object.keys(src).sort(comparator || defaultSortFn).forEach(function (key) {
      out[key] = _sortObject(src[key], comparator);
    });

    return out;
  }

  return src;
}

//-- E X P O R T S
exports.NB_SPACES_FOR_TAB = NB_SPACES_FOR_TAB;
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
exports.CUSTOM_PROMPT_WITH_NODE = 4;
exports.LOG_COLORS = {
  SUCCESS: 'green',
  FAILURE: 'red',
  WARNING: 'yellow',
  DEFAULT_BOX: 'cyan',
  FOCUS_BG: _isWindows() ? '\033[30;47m' : '\033[30;43m',
  RESET_BG: '\033[0;90m',
  GREY: '\033[90m',
  BLUE: _isWindows() ? '\033[96m' : '\033[34m',
  RESET: '\033[0m'
};

exports.ON = ON;
exports.OFF = OFF;
exports.NA = NA;

exports.isWindows = _isWindows;
exports.isMac = _isMac;
exports.isLinux = _isLinux;
exports.createRuntimeDir = _createRuntimeDir;
exports.chownFolder = _chownFolder;
exports.installNpmPackages = _installNpmPackages;
exports.sortObject = _sortObject;
