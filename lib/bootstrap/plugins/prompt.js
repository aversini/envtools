var
  fs = require('fs-extra'),
  path = require('path'),
  common = require('../../common');

function setPrompt(options, callback) {
  var
    envtoolsPrompt = path.join(common.RUNTIME_DIR, 'envtools-prompt');

  if (options.toggleOptions[common.ENVTOOLS.CFG_CUSTOM_PROMPT] === common.ON) {
    fs.writeFile(envtoolsPrompt, options.toggleOptions.custom, callback);
  } else {
    fs.remove(envtoolsPrompt, callback);
  }
}

function getPrompt() {
  var
    data,
    envtoolsPrompt = path.join(common.RUNTIME_DIR, 'envtools-prompt');

  try {
    data = fs.readFileSync(envtoolsPrompt, 'utf8');
  } catch (e) {
    // nothing to declare
  }

  if (data) {
    return data;
  } else {
    return false;
  }
}

//-- E X P O R T S
exports.setPrompt = setPrompt;
exports.getPrompt = getPrompt;
