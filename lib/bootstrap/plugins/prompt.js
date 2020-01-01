const fs = require("fs-extra");
const path = require("path");
const common = require("../../common");

function setPrompt(options, callback) {
  const envtoolsPrompt = path.join(common.RUNTIME_DIR, "envtools-prompt");

  if (options.toggleOptions[common.ENVTOOLS.CFG_CUSTOM_PROMPT] === common.ON) {
    if (options.toggleOptions.custom) {
      fs.writeFile(envtoolsPrompt, options.toggleOptions.custom, callback);
    } else {
      return callback();
    }
  } else {
    fs.remove(envtoolsPrompt, callback);
  }
}

function getPrompt() {
  const envtoolsPrompt = path.join(common.RUNTIME_DIR, "envtools-prompt");
  let data;

  try {
    data = fs.readFileSync(envtoolsPrompt, "utf8");
  } catch (e) {
    // nothing to declare
  }

  if (data) {
    return data;
  } else {
    return false;
  }
}

// -- E X P O R T S
exports.setPrompt = setPrompt;
exports.getPrompt = getPrompt;
