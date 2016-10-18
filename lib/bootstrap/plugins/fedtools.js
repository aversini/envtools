var
  inquirer = require('inquirer'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  common = require('../../common');

module.exports = function (options, callback) {
  var
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'About to install fedtools... Continue?',
      default: true
    }];

  inquirer.prompt(questions).then(function (answers) {
    options.actionsPending++;
    if (answers.change) {
      options.actionsDone++;
      cmd.run('npm install -g fedtools', {
        status: (options.auto) ? false : true
      }, function (err, stderr) {
        if (err && stderr) {
          log.echo(stderr);
        }
        callback(err, options);
      });
    } else {
      if (options.auto) {
        return callback(null, options);
      }
      return callback(common.USER_INTERRUPT, options);
    }
  });
};
