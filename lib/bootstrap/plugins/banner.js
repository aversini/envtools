var
  fs = require('fs-extra'),
  path = require('path'),

  common = require('../../common');

module.exports = function (options, callback) {
  var
    envtoolsBanner = path.join(common.RUNTIME_DIR, 'envtools-banner');

  if (options.answers.banner === common.ON) {
    fs.writeFile(envtoolsBanner, 'true', callback);
  } else {
    fs.remove(envtoolsBanner, callback);
  }
};
