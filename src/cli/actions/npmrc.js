/* eslint no-console: 0 */
const _ = require('lodash');
const log = require('fedtools-logs');
const common = require('../../common');

function listProfiles(cfg) {
  const msgs = [];
  const options = cfg || {};
  const data = common.getExistingNpmrcProfiles();

  let enabled;

  if (!_.isEmpty(data)) {
    if (data.enabled) {
      enabled = data.enabled;
      msgs.push(`* ${enabled}`);
    }
    if (!_.isEmpty(data.available)) {
      _.each(_.without(data.available.sort(), enabled), function (item) {
        msgs.push(`  ${item}`);
      });
    }
    if (!_.isEmpty(msgs)) {
      msgs.unshift('\nAvailable npm/yarn profiles:\n');
      _.each(msgs, function (msg) {
        log.echo(msg);
      });
    } else if (!options.silent) {
      log.echo('There are no existing profiles.');
    }
  } else if (!options.silent) {
    log.echo('There are no existing profiles.');
  }
}

module.exports = function (self, program) {
  const list = _.isBoolean(program.l) ? program.l : false;
  const create = _.isString(program.c) ? program.c : null;
  const profile = _.isString(program._[1]) ? program._[1] : null;

  function usage() {
    const msg = [];
    log.echo();
    msg.push('');
    msg.push(log.strToColor('yellow', 'Description:'));
    msg.push('Envtools npmrc is a simple command line tool that allows you to');
    msg.push(
      'switch between different npm/yarn configuration files with ease.'
    );
    msg.push('');
    msg.push(log.strToColor('yellow', 'Usage:'));
    msg.push('envtools npmrc -l .......... List all profiles');
    msg.push('envtools npmrc -c [name] ... Create a profile');
    msg.push('envtools npmrc [name] ...... Switch to an existing profile');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Examples:'));
    msg.push('$ envtools npmrc -c public');
    msg.push('$ envtools npmrc -c local');
    msg.push('$ envtools npmrc public');
    msg.push('');
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
    log.echo();
    process.exit(1);
  }

  if (list) {
    return listProfiles();
  } else if (create) {
    return common.createNpmrcProfile(create, function () {
      log.success('\nProfile created and active');
    });
  } else if (profile) {
    return common.switchToNpmrcProfile(profile, function (err, name) {
      if (!err) {
        log.success(`\nProfile "${name}" activated!`);
      }
    });
  } else {
    return usage();
  }
};
