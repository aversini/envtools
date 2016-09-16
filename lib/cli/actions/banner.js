var
  fs = require('fs-extra'),
  _ = require('lodash'),
  path = require('path'),
  log = require('fedtools-logs'),

  common = require('../../common'),

  bannerProxyMsg = _.template('Proxies are <%=proxy%><%=sinopia%>'),
  bannerSinopiaMsg = 'Npm is using Sinopia',
  rcInfo,
  versionMsg,
  boxColor = 'yellow',
  msg = [];

module.exports = function (self, config) {
  if (fs.existsSync(path.join(process.env.RUNTIME_DIR, 'envtools-banner'))) {
    if (!common.isWindows()) {
      msg.push('             ★ Welcome to Envtools ★');
      msg.push('Environment loaded, type ' +
        log.strToColor('red', 'h') + ' for available shortcuts');
    } else {
      msg.push('Welcome to Envtools  ');
      msg.push('Environment loaded, type ' +
        log.strToColor('red', 'h') + ' for available shortcuts');
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
        boxColor = 'red';
        msg.push(log.strToColor('red',
          (common.isWindows() ? '' : ' ') +
          'NEW VERSION AVAILABLE  (npm install -g envtools)'));
        versionMsg = null;
      }
    }
    log.resetConsole();
    log.printMessagesInBox(msg, boxColor, versionMsg);
  }
};
