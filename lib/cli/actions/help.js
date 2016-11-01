var
  _ = require('lodash'),
  fs = require('fs-extra'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  common = require('../../common'),
  DEFAULT_PORT = 9999,

  TAB_MAPPING = [{
    'tab': 'introduction',
    'keywords': ['intro', 'introduction', 'help']
  }, {
    'tab': 'commands',
    'keywords': [
      'auto', 'manual', 'extra',
      'lite', 'envlite',
      'commands',
      'timer',
      'notification', 'notifier', 'alert',
      'crypto', 'encrypt', 'decrypt', 'cipher', 'decipher', 'password'
    ]
  }, {
    'tab': 'aliases',
    'keywords': ['alias', 'aliases', 'web', 'ls', 'll', 'proxy', 'proxies']
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
    url,
    tab = '',
    msg = [];

  // need to check if the help server is already running...
  if (fs.existsSync(common.ENVTOOLS.HELP_STATUS)) {
    url = fs.readFileSync(common.ENVTOOLS.HELP_STATUS, 'utf8');
    if (url) {
      if (type) {
        tab = _.filter(TAB_MAPPING, function (o) {
          if (_.indexOf(o.keywords, type) >= 0) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (tab && tab.length && tab[0].tab) {
        url = url + '?' + tab[0].tab;
      }
      utilities.openInBrowser({
        confirm: true,
        url: url
      });
    } else {
      // something fishy happened, let's wipe out the filter
      fs.removeSync(common.ENVTOOLS.HELP_STATUS);
      log.error('Unable to start the Envtools Help Server...');
      log.info('Please try again later (port busy maybe?)');
    }
  } else {
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
        // saving url before appending the type
        fs.writeFileSync(common.ENVTOOLS.HELP_STATUS, data.url);
        if (tab && tab.length && tab[0].tab) {
          data.url = data.url + '?' + tab[0].tab;
        }
        utilities.openInBrowser({
          confirm: true,
          url: data.url
        });
      }
    });
    process.on('SIGINT', function () {
      log.echo('\nEnvtools Help Server is being terminated...');
      fs.removeSync(common.ENVTOOLS.HELP_STATUS);
      process.exit();
    });

    process.on('SIGTERM', function () {
      log.echo('\nEnvtools Help Server is being terminated...');
      fs.removeSync(common.ENVTOOLS.HELP_STATUS);
      process.exit();
    });
  }
};
