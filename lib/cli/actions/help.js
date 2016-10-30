var
  _ = require('lodash'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  common = require('../../common'),
  DEFAULT_PORT = 9999,

  TAB_MAPPING = [{
    'tab': 'introduction',
    'keywords': ['intro', 'introduction', 'help']
  }, {
    'tab': 'commands',
    'keywords': ['auto', 'manual', 'extra', 'lite', 'envlite', 'commands']
  }, {
    'tab': 'aliases',
    'keywords': ['alias', 'aliases', 'web', 'ls', 'll']
  }, {
    'tab': 'customization',
    'keywords': ['custom', 'customization', 'prompt']
  }, {
    'tab': 'sinopia',
    'keywords': ['sinopia', 'npm']
  }, {
    'tab': 'history',
    'keywords': ['history']
  }];

module.exports = function (self, type) {
  var
    tab = '',
    msg = [];
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
        tab = _.filter(TAB_MAPPING, function (o) {
          if (_.indexOf(o.keywords, type) >= 0) {
            return true;
          } else {
            return false;
          }
        });
      }

      msg.push('Envtools Help Server is up and running.');
      msg.push('');
      msg.push('URL is now available here: ');
      msg.push(log.strToColor('cyan', data.url));
      msg.push('');
      msg.push('Hit CTRL-C to stop the server.');
      log.printMessagesInBox(msg);
      if (tab && tab.length && tab[0].tab) {
        data.url = data.url + '?' + tab[0].tab;
      }
      utilities.openInBrowser({
        confirm: false,
        url: data.url
      });
    }
  });
  process.on('SIGINT', function () {
    log.echo('\nEnvtools Help Server is being terminated...');
    process.exit();
  });

  process.on('SIGTERM', function () {
    log.echo('\nEnvtools Help Server is being terminated...');
    process.exit();
  });
};
