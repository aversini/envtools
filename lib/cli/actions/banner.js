var
  fs = require('fs-extra'),
  _ = require('underscore'),
  path = require('path'),
  log = require('fedtools-logs'),

  bannerProxyMsg = _.template('Proxies are <%=proxy%><%=sinopia%>'),
  bannerSinopiaMsg = 'Npm is using Sinopia',
  rcInfo,
  versionMsg,
  msg = [];

module.exports = function (self, config) {
  if (fs.existsSync(path.join(process.env.RUNTIME_DIR, 'envtools-banner'))) {
    if (process.platform === 'darwin') {
      msg.push('             ★ Welcome to Envtools ★');
      msg.push('Environment loaded, type ' +
        log.strToColor('red', 'h') +
        ' for available shortcuts');
    } else {
      msg.push('Welcome to Envtools  ');
      msg.push('Environment loaded');
    }

    switch (process.env.PROXY_STATUS) {
    case 'ON':
      msg.push(log.strToColor('yellow', bannerProxyMsg({
        proxy: 'ON',
        sinopia: (process.env.SINOPIA_STATUS === 'ON') ? ' - ' + bannerSinopiaMsg : ''
      })));
      break;
    case 'OFF':
      msg.push(log.strToColor('yellow', bannerProxyMsg({
        proxy: 'OFF',
        sinopia: (process.env.SINOPIA_STATUS === 'ON') ? ' - ' + bannerSinopiaMsg : ''
      })));
      break;
    default:
      // no proxy but is sinopia enabled?
      if (process.env.SINOPIA_STATUS === 'ON') {
        msg.push(bannerSinopiaMsg);
      }
    }
    msg.push('\n');

    // current version to be displayed in the lower right corner banner
    versionMsg = log.strToColor('yellow', 'v' + self.version.currentVersion);

    // checking if there is a newer version
    rcInfo = config.getKey('envtoolsversion');
    if (rcInfo && rcInfo.latest) {
      if (require('semver').gt(rcInfo.latest, self.version.currentVersion)) {
        versionMsg = log.strToColor('green', 'New Version Available!');
      }
    }

    log.printMessagesInBox(msg, null, versionMsg);
  }
};
