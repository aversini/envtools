const utilities = require('fedtools-utilities');
const log = require('fedtools-logs');
const common = require('../../common');
const DEFAULT_PORT = 8080;

module.exports = function (self, program) {
  utilities.simpleserver.listen({
    port: program.port ? program.port : DEFAULT_PORT,
    root: process.cwd(),
    headers: {
      'X-Powered-By': `${common.ENVTOOLS.NAME} ${common.ENVTOOLS.VERSION}`
    }
  });
  process.on('SIGINT', function () {
    log.echo();
    log.success('simple web server stopped.');
    process.exit();
  });

  process.on('SIGTERM', function () {
    log.echo();
    log.success('simple web server stopped.');
    process.exit();
  });
};
