let _ = require('lodash'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities');

module.exports = function (self, program) {
  let DEFAULT_SMTP_PORT = 1024,
    port = program.port || DEFAULT_SMTP_PORT,
    verbose = _.isBoolean(program.verbose) ? program.verbose : false;

  utilities.smtpserver(
    {
      port,
      verbose
    },
    function (err, res) {
      if (err) {
        log.error('Unable to start server');
        log.echo(err);
      } else if (port !== res.port) {
        log.error(`Port ${port} is not available...`);
        log.warning('Using next available instead...');
        log.info(`SMTP server is up, listening on port ${res.port}`);
        log.echo();
      } else {
        log.info(`SMTP server is up, listening on port ${res.port}`);
        log.echo();
      }
    }
  );
};
