var
  path = require('path'),
  notifier = require('fedtools-notifier');

module.exports = function (self, program) {
  var
    title = program.title || 'Envtools Notification',
    type = program.type || 'INFO',
    message = program.message || 'Notification Example',
    sound = program.sound || 'Purr',
    notifierType = program.notifier || 'osx';

  type = type.toUpperCase();
  notifierType = notifierType.toLowerCase();
  notifier.notify({
    title: title,
    type: type,
    message: message,
    sound: sound,
    notifier: notifierType
  });
};
