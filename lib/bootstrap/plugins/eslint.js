var
  fs = require('fs-extra'),
  async = require('async'),
  path = require('path'),
  inquirer = require('inquirer'),

  backup = require('../../backup'),
  common = require('../../common'),

  DOT_ESLINT_CFG = path.join(process.env.HOME, '.eslintrc.json');

module.exports = function (options, callback) {
  if (fs.existsSync(DOT_ESLINT_CFG)) {
    backup(DOT_ESLINT_CFG);
  }
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install ESLint configuration, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        options.actionsPending++;
        if (answers.goForIt) {
          options.actionsDone++;
          return done();
        } else {
          return done(common.USER_INTERRUPT);
        }
      });
    },
    function (done) {
      var
        srcFile = path.join(common.ENVTOOLS.THIRDDIR, 'eslint', 'dot.eslintrc.json');
      fs.copy(srcFile, DOT_ESLINT_CFG, done);
    }
  ], function (err) {
    if (err && (err === common.USER_INTERRUPT || err === common.USER_IGNORE)) {
      if (options.auto) {
        err = null;
      }
    }
    callback(err, options);
  });
};
