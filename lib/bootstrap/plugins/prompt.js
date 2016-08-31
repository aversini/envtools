var
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),

  common = require('../common');

module.exports = function (options, callback) {
  var
    envtoolsPrompt = path.join(common.RUNTIME_DIR, 'envtools-prompt'),
    questions = [{
      type: 'list',
      name: 'prompt',
      message: 'Please choose one of the following options',
      choices: [{
        name: 'Enable Envtools Custom Command Line Prompt',
        value: common.ON
      }, {
        name: 'Disable Envtools Custom Command Line Prompt',
        value: common.OFF
      }]
    }];

  function _enableEnvtoolsPrompt(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag === common.ON) {
          fs.writeFile(envtoolsPrompt, 'true', goodToGo);
        } else {
          fs.remove(envtoolsPrompt, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsPrompt(common.ON, callback);
  } else {
    inquirer.prompt(questions).then(function (answers) {
      _enableEnvtoolsPrompt(answers.prompt, callback);
    });
  }
};
