var
  path = require('path'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands');

module.exports = function (self) {
  var
    cfgFile = path.join(process.env.RUNTIME_DIR, 'config.yaml');

  require('../../bootstrap/plugins/sinopia').installConfiguration({}, function () {
    log.echo();
    log.info('Starting Sinopia wrapper provided by Envtools...');
    log.notice('To start the original Sinopia, type \\sinopia');
    log.echo();
    cmd.run('sinopia -c ' + cfgFile, {
      foreground: cmd.TYPE_STDOUT,
      verbose: self.debug || false,
      status: self.debug || false,
      trigger: [{
        onlyOnce: true,
        regex: new RegExp(/http address - http:\/\/localhost:4873/),
        callback: function () {
          log.echo();
          log.success('Sinopia is up and running... CTRL+C to stop it.');
        }
      }]
    }, function (err) {
      if (err) {
        log.echo();
        log.fatal('Unable to start sinopia... Is it already running?');
        log.echo();
      }
    });

    process.on('SIGINT', function () {
      log.echo();
      log.success('Sinopia server stopped.');
      process.exit();
    });

    process.on('SIGTERM', function () {
      log.echo();
      log.success('Sinopia server stopped.');
      process.exit();
    });
  });
};
