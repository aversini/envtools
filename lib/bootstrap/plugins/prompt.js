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
    }, {
      type: 'list',
      name: 'custom',
      message: 'Please choose one of the following custom prompts',
      when: function (res) {
        return res.prompt === common.ON;
      },
      choices: [{
        name: 'Prompt with Proxy and Git information',
        short: 'proxy only',
        value: common.CUSTOM_PROMPT_DEFAULT
      }, {
        name: 'Prompt with Proxy, Sinopia and Git information',
        short: 'proxy and sinopia',
        value: common.CUSTOM_PROMPT_WITH_SINOPIA
      }]
    }];

  function _enableEnvtoolsPrompt(flag, prompt, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag === common.ON) {
          fs.writeFile(envtoolsPrompt, prompt, goodToGo);
        } else {
          fs.remove(envtoolsPrompt, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsPrompt(common.ON, common.CUSTOM_PROMPT_DEFAULT, callback);
  } else {
    inquirer.prompt(questions).then(function (answers) {
      _enableEnvtoolsPrompt(answers.prompt, answers.custom, callback);
    });
  }
};
