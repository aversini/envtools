// var
//   path = require('path'),
//   utilities = require('fedtools-utilities');
//
// module.exports = function () {
//   utilities.openInBrowser({
//     confirm: false,
//     url: path.join(__dirname, '..', '..', '..', 'envtools-help.html')
//   });
// };

var
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  common = require('../../common'),
  DEFAULT_PORT = 9999;

module.exports = function () {
  log.info('Starting helper server... CTRL+C to stop it');
  utilities.simpleserver.listen({
    quiet: true,
    port: DEFAULT_PORT,
    root: common.ENVTOOLS.ROOTDIR
  }, function (err, data) {
    if (err) {
      throw (err);
    }
    if (data && data.url) {
      utilities.openInBrowser({
        confirm: false,
        url: data.url
      });
    }
  });
  process.on('SIGINT', function () {
    log.echo('\nEnvtools help server is being terminated...');
    process.exit();
  });

  process.on('SIGTERM', function () {
    log.echo('\nEnvtools help server is being terminated...');
    process.exit();
  });
};
