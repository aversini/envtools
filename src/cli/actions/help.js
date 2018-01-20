const _ = require('lodash');
const log = require('fedtools-logs');
const opn = require('opn');
const TAB_MAPPING = [
  {
    tab: 'intro',
    keywords: ['intro', 'introduction', 'help']
  },
  {
    tab: 'commands',
    keywords: [
      'auto',
      'manual',
      'extra',
      'lite',
      'envlite',
      'commands',
      'timer',
      'notification',
      'notifier',
      'alert',
      'crypto',
      'encrypt',
      'decrypt',
      'cipher',
      'decipher',
      'password',
      'smtp',
      'email',
      'config',
      'configuration',
      'envtools',
      'info',
      'information',
      'system',
      'update',
      'upgrade',
      'check',
      'up'
    ]
  },
  {
    tab: 'aliases',
    keywords: ['alias', 'aliases', 'web', 'ls', 'll', 'proxy', 'proxies']
  },
  {
    tab: 'customization',
    keywords: ['custom', 'customization', 'prompt']
  },
  {
    tab: 'history',
    keywords: ['history']
  }
];

module.exports = function (self, type) {
  const helpUrl = 'http://envtools.surge.sh';
  let url,
    tab = '';

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
    url = `${helpUrl}?${tab[0].tab}`;
  } else {
    url = helpUrl;
  }
  log.echo('Opening Envtools Help in your default browser...');
  opn(url, {
    wait: false
  });
};
