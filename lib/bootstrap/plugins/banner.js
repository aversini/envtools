let fs = require('fs-extra'),
  path = require('path'),
  common = require('../../common');

function setBanner(options, callback) {
  const envtoolsBanner = path.join(common.RUNTIME_DIR, 'envtools-banner');

  if (options.toggleOptions[common.ENVTOOLS.CFG_BANNER] === common.ON) {
    fs.writeFile(envtoolsBanner, 'true', callback);
  } else {
    fs.remove(envtoolsBanner, callback);
  }
}

function getBanner() {
  let data,
    envtoolsBanner = path.join(common.RUNTIME_DIR, 'envtools-banner');

  try {
    data = fs.readFileSync(envtoolsBanner, 'utf8');
  } catch (e) {
    // nothing to declare
  }

  if (data && data === 'true') {
    return true;
  } else {
    return false;
  }
}

// -- E X P O R T S
exports.setBanner = setBanner;
exports.getBanner = getBanner;
