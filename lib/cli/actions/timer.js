/* eslint no-magic-numbers:0*/

var
  _ = require('lodash'),
  moment = require('moment'),
  notifier = require('fedtools-notifier'),
  log = require('fedtools-logs');

function _timer(options) {
  var
    timerDurationMilliSeconds,
    timerDurationSeconds,
    totalMicroseconds = 0,
    startTime = Date.now(),
    groups,
    timer,
    res,
    config = {
      title: 'Envtools Notification',
      type: 'TIMER',
      message: 'Time is up!',
      sound: 'Purr',
      notifier: options.notifier
    },
    msg1 = 'Timer: ',
    msg2 = 'Notification: ',
    msg3 = 'Remaining time: **s';

  function _updateElapsedTime(time) {
    var
      elapsed = 0;
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    if (time) {
      msg3 = 'Remaining time: ' + (timerDurationSeconds - time) + 's';
    } else {
      elapsed = parseInt((Date.now() - startTime) / 1000, 10);
      msg3 = 'Remaining time: ' + (timerDurationSeconds - elapsed) + 's';
    }
    log.printMessagesInBox([msg1, msg2, msg3]);
  }

  function _parse(strings) {
    var
      units = {
        ms: 1000,
        s: 1000 * 1000,
        m: 1000 * 1000 * 60,
        h: 1000 * 1000 * 60 * 60,
        d: 1000 * 1000 * 60 * 60 * 24,
        w: 1000 * 1000 * 60 * 60 * 24 * 7
      };

    function _getMicroseconds(value, unit) {
      var result = units[unit];
      if (result) {
        return value * result;
      } else {
        return 0;
      }
    }
    if (_.isString(strings)) {
      groups = strings
        .toLowerCase()
        .match(/[-+]?[0-9\.]+[a-z]+/g);

      if (groups !== null) {
        groups.forEach(function (g) {
          var
            value = g.match(/[0-9\.]+/g)[0],
            unit = g.match(/[a-z]+/g)[0];
          totalMicroseconds += _getMicroseconds(value, unit);
        });
      }
    }
    return moment.duration(totalMicroseconds / units.ms);
  }

  res = _parse(options.strings);
  timerDurationMilliSeconds = res.asMilliseconds();

  if (timerDurationMilliSeconds > 0) {
    timerDurationSeconds = res.asSeconds();

    msg1 += res.hours() + 'h ' + res.minutes() + 'm ' + res.seconds() + 's';

    if (options.notification) {
      if (options.notifier && options.notifier === 'growl') {
        msg2 += 'Growl';
      } else if (options.notifier && options.notifier === 'osx') {
        msg2 += 'OS X Notification Center';
      } else {
        msg2 += 'Default';
      }
    } else {
      msg2 += 'None';
    }

    log.echo();
    log.printMessagesInBox([msg1, msg2, msg3]);
    timer = setInterval(_updateElapsedTime, 1000);
    setTimeout(function () {
      clearInterval(timer);
      _updateElapsedTime(timerDurationSeconds);
      log.echo();
      if (options.notification) {
        notifier.notify(config);
      }
    }, timerDurationMilliSeconds);

    return timerDurationMilliSeconds;
  }
  return -1;
}

module.exports = function (self, program) {
  var
    result,
    msg = [],
    notification = _.isBoolean(program.notification) ? program.notification : true;

  result = _timer({
    strings: program._[1],
    notifier: program.notifier,
    notification: notification
  });

  if (result === -1) {
    log.echo();
    msg.push('Usage: envtools timer XhXmXs');
    msg.push('envtools timer only takes h m s format');
    msg.push('Example: envtools timer 1m3s');
    log.printMessagesInBox(msg);
    log.echo();
  }
};
