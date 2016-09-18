var
  fs = require('fs-extra'),
  path = require('path'),
  common = require('../../common');

module.exports = function (options, callback) {
  var
    envtoolsPrompt = path.join(common.RUNTIME_DIR, 'envtools-prompt');

  if (options.answers.prompt === common.ON) {
    fs.writeFile(envtoolsPrompt, options.answers.custom, callback);
  } else {
    fs.remove(envtoolsPrompt, callback);
  }
};
