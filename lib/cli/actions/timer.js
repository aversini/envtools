/* eslint no-magic-numbers:0*/

var
  _ = require('lodash'),
  moment = require('moment'),
  notifier = require('fedtools-notifier'),
  log = require('fedtools-logs'),
  common = require('../../common');

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
    msg1 = log.strToColor('cyan', 'Timer: '),
    msg2 = log.strToColor('cyan', 'Notification: '),
    msg3 = log.strToColor('cyan', 'Remaining time: ') + '***';

  function _updateRemainingTime(time) {
    var
      elapsed = 0,
      duration;

    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    if (time) {
      msg3 = log.strToColor('cyan', 'Remaining time: ') + 'expired';
    } else {
      elapsed = parseInt((Date.now() - startTime) / 1000, 10);
      duration = moment.duration((timerDurationSeconds - elapsed) * 1000);
      msg3 = log.strToColor('cyan', 'Remaining time: ') +
        duration.hours() + 'h ' +
        duration.minutes() + 'm ' +
        duration.seconds() + 's';
    }
    log.printMessagesInBox([msg1, msg2, msg3], common.LOG_COLORS.DEFAULT_BOX);
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
        msg2 += 'macOS';
      } else {
        msg2 += 'Default';
      }
    } else {
      msg2 += 'None';
    }

    log.echo();
    log.printMessagesInBox([msg1, msg2, msg3], common.LOG_COLORS.DEFAULT_BOX);
    timer = setInterval(_updateRemainingTime, 1000);
    setTimeout(function () {
      clearInterval(timer);
      _updateRemainingTime(timerDurationSeconds);
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
    notification = _.isBoolean(program.quiet) ? !program.quiet : true;

  result = _timer({
    strings: program._[1],
    notifier: _.isString(program.notifier) ? program.notifier.toLowerCase() : null,
    notification: notification
  });

  if (result === -1) {
    log.echo();
    msg.push('');
    msg.push('Envtools timer is a simple command line timer');
    msg.push('with notification superpowers.');
    msg.push('');
    msg.push(log.strToColor('cyan', 'Parameter:'));
    msg.push('Envtools timer only takes one parameter with the');
    msg.push('following format: XhYmZs, e.g. 4h2m15s or 1m42s');
    msg.push('');
    msg.push(log.strToColor('cyan', 'Options:'));
    msg.push('--quiet    Cancel all notifications');
    msg.push('--notifier Specify a notifer [growl|osx]');
    msg.push('');
    msg.push(log.strToColor('cyan', 'Usage:'));
    msg.push('$ envtools timer 1m3s');
    msg.push('$ envtools timer 1m3s --quiet');
    msg.push('$ envtools timer 1m3s --notifier growl');
    msg.push('');
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
    log.echo();
  }
};
