var
  path = require('path'),
  fs = require('fs-extra'),

  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', '..', 'data', 'third'),
    PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
    PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
    SINOPIA_STATUS: path.join(RUNTIME_DIR, 'sinopia_status'),
    RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto')
  };

//-- E X P O R T S
exports.TYPE_AUTO = 't_auto';
exports.TYPE_MANUAL = 't_manual';
exports.TYPE_EXTRA = 't_extra';
exports.RUNTIME_DIR = RUNTIME_DIR;
exports.ENVTOOLS = ENVTOOLS;
exports.USER_INTERRUPT = -1;
exports.USER_WARNING = -2;
exports.USER_FATAL = -3;
exports.USER_IGNORE = -4;
exports.ON = 'ON';
exports.OFF = 'OFF';
exports.CUSTOM_PROMPT_DEFAULT = 1;
exports.CUSTOM_PROMPT_WITH_SINOPIA = 2;
exports.LOG_COLORS = {
  SUCCESS: 'green',
  FAILURE: 'red',
  DEFAULT: 'yellow'
};

exports.createRuntimeDir = function (callback) {
  if (!fs.exists(RUNTIME_DIR)) {
    fs.mkdirs(RUNTIME_DIR, function (err) {
      callback(err);
    });
  }
};
