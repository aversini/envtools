var
  fs = require('fs-extra'),
  async = require('async'),
  path = require('path'),
  inquirer = require('inquirer'),

  backup = require('../../backup'),
  common = require('../../common'),

  DOT_JSBEAUTIFY_CFG = path.join(process.env.HOME, '.jsbeautifyrc');

module.exports = function (options, callback) {
  if (fs.existsSync(DOT_JSBEAUTIFY_CFG)) {
    backup(DOT_JSBEAUTIFY_CFG);
  }
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install jsBeautify configuration, continue?',
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
        srcFile = path.join(common.ENVTOOLS.THIRDDIR,
          'beautify', 'dot.jsbeautifyrc');
      fs.copy(srcFile, DOT_JSBEAUTIFY_CFG, done);
    }
  ], function (err) {
    if (err && (err === common.USER_INTERRUPT || err === common.USER_IGNORE)) {
      err = null;
    }
    callback(err, options);
  });
};
