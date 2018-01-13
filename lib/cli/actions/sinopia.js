let path = require('path'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),
  utilities = require('fedtools-utilities');

module.exports = function (self) {
  let proxy = Boolean(process.env.http_proxy),
    isSinopiaInstalled,
    SPINNER_TTL = 2000,
    cfgFile = path.join(process.env.RUNTIME_DIR, 'config.yaml');

  isSinopiaInstalled = utilities.isAppInstalled({
    name: 'sinopia',
    error: 'Sinopia is not installed. Install it with npm...'
  });
  if (isSinopiaInstalled === true) {
    require('../../bootstrap/plugins/sinopia').installConfiguration(
      {},
      function () {
        log.echo();
        log.info('Starting Sinopia wrapper provided by Envtools...');
        log.info('To start the original Sinopia, type \\sinopia');

        cmd.run(
          `sinopia -c ${cfgFile}`,
          {
            foreground: true,
            verbose: self.debug || false,
            status: self.debug || false,
            trigger: [
              {
                onlyOnce: true,
                regex: new RegExp(/http address - http:\/\/localhost:/),
                callback() {
                  log.echo();
                  if (proxy) {
                    log.success(
                      'Sinopia is up and running, using proxy for fallback...'
                    );
                  } else {
                    log.success(
                      'Sinopia is up and running, using NO proxy for fallback...'
                    );
                  }
                  log.echo('Type CTRL+C to stop it.');
                  log.echo();
                }
              },
              {
                regex: new RegExp(/http {2}-->|http {2}<--/),
                callback() {
                  // Let's start a little spinner with a ttl of 2s...
                  log.displaySpinner({
                    msg: 'Sinopia is crunching data...',
                    ttl: SPINNER_TTL
                  });
                }
              }
            ]
          },
          function (err) {
            if (err) {
              log.echo();
              log.fatal('Unable to start sinopia... Is it already running?');
              log.echo();
            }
          }
        );

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
      }
    );
  }
};
