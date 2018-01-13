const _ = require('lodash');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const log = require('fedtools-logs');
const cmd = require('fedtools-commands');
const common = require('../../common');

module.exports = function (options, callback) {
  // resetting /usr/local permission to current owner
  const questions = [
    {
      type: 'confirm',
      name: 'goForIt',
      message: 'About to reset ownership for /usr/local... Continue?',
      default: true
    }
  ];

  let verbose = true,
    whoami = process.env.LOGNAME;

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }
  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: options.debug
    }).output;
  }

  if (_.isString(whoami) && fs.existsSync('/usr/local')) {
    inquirer.prompt(questions).then(function (answers) {
      options.actionsPending++;
      if (answers.goForIt) {
        options.actionsDone++;
        cmd.sudo(
          `chown -R ${whoami} /usr/local`,
          {
            name: 'Envtools',
            status: verbose
          },
          function (err) {
            if (err) {
              err = common.USER_IGNORE;
              log.error(
                'Something went wrong or you did not grant admin access...'
              );
            }
            return callback(err, options);
          }
        );
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
