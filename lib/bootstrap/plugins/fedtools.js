var
  inquirer = require('inquirer'),

  common = require('../../common');

module.exports = function (options, callback) {
  var
    questions = [{
      type: 'confirm',
      name: 'goForIt',
      message: 'About to install fedtools... Continue?',
      default: true
    }];

  inquirer.prompt(questions).then(function (answers) {
    options.actionsPending++;
    if (answers.goForIt) {
      options.actionsDone++;
      common.installNpmPackages('fedtools', function (err) {
        if (!err && !options.auto) {
          err = common.USER_IGNORE;
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
