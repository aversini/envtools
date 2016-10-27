var
  inquirer = require('inquirer'),

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
      common.installNpmPackages('fedtools', function (err) {
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
