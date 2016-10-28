var
  _ = require('lodash'),
  fs = require('fs-extra'),
  inquirer = require('inquirer'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  common = require('../../common');

module.exports = function (options, callback) {
  // resetting /usr/local permission to current owner
  var
    verbose = true,
    whoami = process.env.LOGNAME,
    questions = [{
      type: 'confirm',
      name: 'goForIt',
      message: 'About to reset ownership for /usr/local... Continue?',
      default: true
    }];

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }
  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: (options.debug) ? true : false
    }).output;
  }

  if (_.isString(whoami) && fs.existsSync('/usr/local')) {
    inquirer.prompt(questions).then(function (answers) {
      options.actionsPending++;
      if (answers.goForIt) {
        options.actionsDone++;
        cmd.sudo('chown -R ' + whoami + ' /usr/local', {
          status: verbose
        }, function (err) {
          if (err) {
            err = common.USER_IGNORE;
            log.error('Something went wrong or you did not grant admin access...');
          }
          return callback(err, options);
        });
      } else {
        if (options.auto) {
          return callback(null, options);
        }
        return callback(common.USER_INTERRUPT, options);
      }
    });
  } else {
    return callback(null, options);
  }
};
