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
    startServer = false,
    helpJson,
    url,
    tab = '',
    msg = [];

  // need to check if the help server is already running...
  if (fs.existsSync(common.ENVTOOLS.HELP_STATUS)) {
    helpJson = JSON.parse(fs.readFileSync(common.ENVTOOLS.HELP_STATUS, 'utf8'));
    if (helpJson.pid && utilities.sendSignal(helpJson.pid, utilities.ALIVE_SIGNAL)) {
      if (helpJson.url) {
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
          url = helpJson.url + '?' + tab[0].tab;
        }
        utilities.openInBrowser({
          confirm: true,
          url: url
        });
      } else {
        // something fishy happened, let's restart the server
        fs.removeSync(common.ENVTOOLS.HELP_STATUS);
        startServer = true;
      }
    } else {
      // pid not responding, let's restart the server
      fs.removeSync(common.ENVTOOLS.HELP_STATUS);
      startServer = true;
    }
  } else {
    startServer = true;
  }

  if (startServer) {
    utilities.simpleserver.listen({
      quiet: true,
      port: DEFAULT_PORT,
      root: common.ENVTOOLS.ROOTDIR,
      headers: {
        'X-Powered-By': common.ENVTOOLS.NAME + ' ' + common.ENVTOOLS.VERSION
      }
    }, function (err, data) {
      if (err) {
        throw (err);
      }
      process.on('SIGINT', function () {
        log.echo('\nEnvtools Help Server is being terminated...');
        fs.removeSync(common.ENVTOOLS.HELP_STATUS);
        if (data && data.server) {
          data.server.close(function () {
            process.exit();
          });
        } else {
          process.exit();
        }
      });

      process.on('SIGTERM', function () {
        log.echo('\nEnvtools Help Server is being terminated...');
        fs.removeSync(common.ENVTOOLS.HELP_STATUS);
        if (data && data.server) {
          data.server.close(function () {
            process.exit();
          });
        } else {
          process.exit();
        }
      });
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
        fs.writeFileSync(common.ENVTOOLS.HELP_STATUS, JSON.stringify({
          url: data.url,
          pid: process.pid
        }, null, common.NB_SPACES_FOR_TAB));
        if (tab && tab.length && tab[0].tab) {
          data.url = data.url + '?' + tab[0].tab;
        }
        utilities.openInBrowser({
          confirm: true,
          url: data.url
        });
      }
    });
  }
};
