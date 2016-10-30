var
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  common = require('../../common'),
  DEFAULT_PORT = 9999,

  MAPPING = {
    'auto': 'commands',
    'manual': 'commands',
    'extra': 'commands',
    'lite': 'commands',

    'custom': 'customization',
    'customization': 'customization',
    'prompt': 'customization',

    'sinopia': 'sinopia',

    'history': 'history',

    'alias': 'aliases',
    'aliases': 'aliases'
  };

module.exports = function (self, type) {
  var
    tab,
    msg = [];
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
      if (type) {
        tab = MAPPING[type];
      }
      msg.push('');
      msg.push('Envtools help is now available here: ');
      msg.push(log.strToColor('cyan', data.url));
      msg.push('');
      log.printMessagesInBox(msg);
      if (tab) {
        data.url = data.url + '?' + tab;
      }
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
