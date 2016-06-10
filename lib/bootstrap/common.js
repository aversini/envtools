var
  path = require('path'),
  fs = require('fs-extra'),

  TYPE_AUTO = 't_auto',
  TYPE_MANUAL = 't_manual',
  TYPE_EXTRA = 't_extra',

  USER_INTERRUPT = -1,
  USER_WARNING = -2,
  USER_FATAL = -3,
  USER_IGNORE = -4,

  ON = 'ON',
  OFF = 'OFF',

  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', '..', 'data', 'third'),
    PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
    PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
    SINOPIA_STATUS: path.join(RUNTIME_DIR, 'sinopia_status'),
    RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto')
  };

//-- E X P O R T S
exports.TYPE_AUTO = TYPE_AUTO;
exports.TYPE_MANUAL = TYPE_MANUAL;
exports.TYPE_EXTRA = TYPE_EXTRA;
exports.RUNTIME_DIR = RUNTIME_DIR;
exports.ENVTOOLS = ENVTOOLS;
exports.USER_INTERRUPT = USER_INTERRUPT;
exports.USER_WARNING = USER_WARNING;
exports.USER_FATAL = USER_FATAL;
exports.USER_IGNORE = USER_IGNORE;
exports.ON = ON;
exports.OFF = OFF;

exports.createRuntimeDir = function (callback) {
  if (!fs.exists(RUNTIME_DIR)) {
    fs.mkdirs(RUNTIME_DIR, function (err) {
      callback(err);
    });
  }
};
