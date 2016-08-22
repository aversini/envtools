var
  path = require('path'),
  utilities = require('fedtools-utilities');

module.exports = function () {
  utilities.openInBrowser({
    confirm: false,
    url: path.join(__dirname, '..', '..', '..', 'envtools-help.html')
  });
};
