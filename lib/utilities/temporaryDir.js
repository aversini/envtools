/**
 * Finds and create a temporary folder based on the OS.
 * /tmp it will be used on Linux/Mac unless rootDir is provided.
 *
 * @method getTemporaryDir
 * @param {String} subDir Optional: an extra sub folder to append to the
 *                        provided temporary folder.
 * @param {String} rootDir Optional: force the root path (instead of /tmp or whatever the system is providing)
 * @return {String} Path to a temporary folder.
 */

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const common = require("../common");

module.exports = (subDir, rootDir) => {
  let osTmpDir, tmpDir;

  if (typeof rootDir === "string" && fs.existsSync(rootDir)) {
    osTmpDir = path.resolve(rootDir);
  } else if (common.isLinux() || common.isMac()) {
    // forcing /tmp on linux and mac
    osTmpDir = "/tmp";
  } else {
    osTmpDir = os.tmpdir();
  }

  tmpDir = path.join(osTmpDir, "envtools-tmp");
  if (subDir) {
    tmpDir = path.join(tmpDir, subDir);
  }
  fs.ensureDirSync(tmpDir);
  return tmpDir;
};
