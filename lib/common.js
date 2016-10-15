/*eslint no-octal-escape:0*/
var
  path = require('path'),
  fs = require('fs-extra'),

  isMac = (process.platform === 'darwin'),
  isWindows = (process.platform === 'win32'),

  ON = 'ON',
  OFF = 'OFF',
  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  DOT_PROFILE = path.join(process.env.HOME, '.profile'),
  DOT_BASH_PROFILE = path.join(process.env.HOME, '.bash_profile'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
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

//-- E X P O R T S
exports.DOT_PROFILE = DOT_PROFILE;
exports.DOT_BASH_PROFILE = DOT_BASH_PROFILE;
exports.TYPE_AUTO = 't_auto';
exports.TYPE_MANUAL = 't_manual';
exports.TYPE_EXTRA = 't_extra';
exports.RUNTIME_DIR = RUNTIME_DIR;
exports.ENVTOOLS = ENVTOOLS;
exports.USER_INTERRUPT = -1;
exports.USER_WARNING = -2;
exports.USER_FATAL = -3;
exports.USER_IGNORE = -4;
exports.CUSTOM_PROMPT_DEFAULT = 1;
exports.CUSTOM_PROMPT_WITH_SINOPIA = 2;
exports.LOG_COLORS = {
  SUCCESS: 'green',
  FAILURE: 'red',
  DEFAULT: 'yellow',
  FOCUS_BG: _isWindows() ? '\033[30;47m' : '\033[30;43m',
  RESET_BG: '\033[0;90m',
  GREY: '\033[90m',
  BLUE: _isWindows() ? '\033[96m': '\033[34m',
  RESET: '\033[0m'
};

exports.ON = ON;
exports.OFF = OFF;

exports.isWindows = _isWindows;
exports.isMac = _isMac;
exports.createRuntimeDir = _createRuntimeDir;
