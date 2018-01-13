const common = require('../../common');

module.exports = function (options, callback) {
  options.version.setAutoCheck(
    options.toggleOptions[common.ENVTOOLS.CFG_AUTOCHECK]
  );
  callback();
};
