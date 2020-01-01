const fs = require("fs-extra");
const path = require("path");
const common = require("../../common");

function setBanner(options, callback) {
  const envtoolsBanner = path.join(common.RUNTIME_DIR, "envtools-banner");

  if (options.toggleOptions[common.ENVTOOLS.CFG_BANNER] === common.ON) {
    fs.writeFile(envtoolsBanner, "true", callback);
  } else {
    fs.remove(envtoolsBanner, callback);
  }
}

function getBanner() {
  const envtoolsBanner = path.join(common.RUNTIME_DIR, "envtools-banner");
  let data;

  try {
    data = fs.readFileSync(envtoolsBanner, "utf8");
  } catch (e) {
    // nothing to declare
  }

  if (data && data === "true") {
    return true;
  } else {
    return false;
  }
}

// -- E X P O R T S
exports.setBanner = setBanner;
exports.getBanner = getBanner;
