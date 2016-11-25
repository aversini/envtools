var
  log = require('fedtools-logs'),
  notifier = require('fedtools-notifier'),
  _ = require('lodash'),
  common = require('../../common'),
  bootstrap = require('../../bootstrap/index');

module.exports = function (self, type, program, callback) {
  var
    notification = _.isBoolean(program.notification) ? program.notification : true;

  bootstrap[type]({
    debug: self.debug,
    i18n: self.i18n,
    version: self.version
  }, function (err) {
    if (err &&
      (err !== common.USER_INTERRUPT && err !== common.USER_WARNING)) {
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
    if (_.isFunction(callback)) {
      return callback(err);
    }
  });
};
