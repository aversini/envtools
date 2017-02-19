var
  path = require('path'),
  common = require('../../common'),
  notifier = require('node-notifier');

module.exports = function (self, program) {
  var
    type,
    config = {},

    TYPES = {
      'INFO': {
        'sound': program.sound || 'Purr',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'info.png')
      },
      'SUCCESS': {
        'sound': program.sound || 'Glass',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'success.png')
      },
      'QUESTION': {
        'sound': program.sound || 'Funk',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'question.png')
      },
      'TIMER': {
        'sound': program.sound || 'Purr',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'timer.png')
      },
      'WARNING': {
        'sound': program.sound || 'Blow',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'warning.png')
      },
      'ERROR': {
        'sound': program.sound || 'Blow',
        'icon': path.join(common.ENVTOOLS.THIRDDIR, 'notifier', 'error.png')
      }
    };

  type = (program.type) ? program.type.toUpperCase() : 'INFO';

  config.title = program.title || 'Envtools Notification';
  config.message = program.message || 'Notification Example';

  if (TYPES[type]) {
    config.sound = TYPES[type].sound;
    config.contentImage = TYPES[type].icon;
  }

  notifier.notify(config);
};
