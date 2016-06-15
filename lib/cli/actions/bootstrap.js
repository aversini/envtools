var
  log = require('fedtools-logs'),
  notifier = require('fedtools-notifier'),
  _ = require('underscore'),
  bootstrap = require('../../bootstrap/index');

module.exports = function (self, type, program) {
  var
    notification = _.isBoolean(program.notification) ? program.notification : true;
  self.help.printManPage(bootstrap, type);
  bootstrap[type]({
    debug: self.debug,
    i18n: self.i18n
  }, function (err) {
    if (err &&
      (err !== bootstrap.USER_INTERRUPT && err !== bootstrap.USER_WARNING)) {
      log.error(self.i18n.t('bootstrap.errors.general'));
      log.info(self.i18n.t('bootstrap.errors.info'));
      log.echo();
      if (notification) {
        notifier.notify({
          title: 'Envtools Notification',
          message: self.i18n.t('bootstrap.errors.general'),
          sound: 'Blow',
          type: 'ERROR',
          notifier: program.notifier
        });
      }
    }
  });
};