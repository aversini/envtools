var
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),
  rimraf = require('rimraf'),

  common = require('../common');

module.exports = function (options, callback) {
  var
    envtoolsPrompt = path.join(common.RUNTIME_DIR, 'envtools-prompt'),
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'Do you want to enable a nicer prompt?',
      default: true
    }];

  function _enableEnvtoolsPrompt(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag) {
          fs.writeFile(envtoolsPrompt, 'true', goodToGo);
        } else {
          rimraf(envtoolsPrompt, {}, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsPrompt(true, callback);
  } else {
    inquirer.prompt(questions).then(function (answers) {
      _enableEnvtoolsPrompt(answers.change, callback);
    });
  }
};
