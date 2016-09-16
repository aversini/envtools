var
  ON = 'ON',
  OFF = 'OFF',

  isMac = (process.platform === 'darwin'),
  isWindows = (process.platform === 'win32');

function _isMac() {
  return isMac;
}
function _isWindows() {
  return isWindows;
}

exports.ON = ON;
exports.OFF = OFF;
exports.isWindows = _isWindows;
exports.isMac = _isMac;
