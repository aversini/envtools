/* eslint no-magic-numbers:0, no-useless-escape: 0 */

const _ = require('lodash');
const moment = require('moment');
const notifier = require('./notifier');
const log = require('fedtools-logs');
const common = require('../../common');

function _timer(options) {
  const startTime = Date.now();
  const config = {
    title: 'Envtools Notification',
    type: 'TIMER',
    message: 'Time is up!',
    sound: 'Purr'
  };
  let msg1 = log.strToColor('cyan', 'Timer: '),
    msg2 = `${log.strToColor('yellow', 'Remaining time: ')}***`,
    timerDurationSeconds,
    totalMicroseconds = 0,
    groups,
    timer;

  function _updateRemainingTime(time) {
    let elapsed = 0,
      duration;

    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    log.clearPreviousLine();
    if (time) {
      msg2 = `${log.strToColor('yellow', 'Remaining time: ')}expired`;
    } else {
      elapsed = parseInt((Date.now() - startTime) / 1000, 10);
      duration = moment.duration((timerDurationSeconds - elapsed) * 1000);
      msg2 = `${log.strToColor('yellow', 'Remaining time: ') +
        duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
    }
    log.printMessagesInBox([msg1, msg2], common.LOG_COLORS.DEFAULT_BOX);
  }

  function _parse(strings) {
    const units = {
      ms: 1000,
      s: 1000 * 1000,
      m: 1000 * 1000 * 60,
      h: 1000 * 1000 * 60 * 60,
      d: 1000 * 1000 * 60 * 60 * 24,
      w: 1000 * 1000 * 60 * 60 * 24 * 7
    };

    function _getMicroseconds(value, unit) {
      const result = units[unit];
      if (result) {
        return value * result;
      } else {
        return 0;
      }
    }
    if (_.isString(strings)) {
      groups = strings.toLowerCase().match(/[-+]?[0-9\.]+[a-z]+/g);

      if (groups !== null) {
        groups.forEach(function (g) {
          const value = g.match(/[0-9\.]+/g)[0];
          const unit = g.match(/[a-z]+/g)[0];
          totalMicroseconds += _getMicroseconds(value, unit);
        });
      }
    }
    return moment.duration(totalMicroseconds / units.ms);
  }

  const res = _parse(options.strings);
  const timerDurationMilliSeconds = res.asMilliseconds();

  if (timerDurationMilliSeconds > 0) {
    timerDurationSeconds = res.asSeconds();

    msg1 += `${res.hours()}h ${res.minutes()}m ${res.seconds()}s`;

    log.echo();
    log.printMessagesInBox([msg1, msg2], common.LOG_COLORS.DEFAULT_BOX);
    timer = setInterval(_updateRemainingTime, 1000);
    setTimeout(function () {
      clearInterval(timer);
      _updateRemainingTime(timerDurationSeconds);
      log.echo();
      if (options.notification) {
        notifier(null, config);
      }
    }, timerDurationMilliSeconds);

    return timerDurationMilliSeconds;
  }
  return -1;
}

module.exports = function (self, program) {
  const msg = [];
  const notification = _.isBoolean(program.quiet) ? !program.quiet : true;

  const result = _timer({
    strings: program._[1],
    notification
  });

  if (result === -1) {
    log.echo();
    msg.push('');
    msg.push(log.strToColor('yellow', 'Description:'));
    msg.push('Envtools timer is a simple command line timer');
    msg.push('with notification superpowers.');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Parameter:'));
    msg.push('Envtools timer only takes one parameter with the');
    msg.push('following format: XhYmZs, e.g. 4h2m15s or 1m42s');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Usage:'));
    msg.push('$ envtools timer 1m3s');
    msg.push('');
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
    log.echo();
  }
};
