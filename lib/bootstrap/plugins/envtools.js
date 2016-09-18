var
  profile = require('./profile'),
  prompt = require('./prompt'),
  banner = require('./banner'),

  inquirer = require('inquirer'),
  common = require('../../common');

module.exports = function (options, callback) {
  var
    defaults = {
      load: common.ON,
      prompt: common.ON,
      custom: common.CUSTOM_PROMPT_DEFAULT,
      banner: common.ON
    },
    questions;


  questions = [{
    type: 'list',
    name: 'load',
    message: 'Please choose one of the following options',
    when: function () {
      return !options.auto;
    },
    choices: [{
      name: 'Automatically load Envtools at each session',
      short: 'Load Envtools',
      value: common.ON
    }, {
      name: 'Do not load Envtools automatically',
      short: 'Do not load Envtools',
      value: common.OFF
    }]
  }, {
    type: 'list',
    name: 'prompt',
    message: 'Please choose one of the following options',
    when: function (res) {
      return !options.auto && res.load === common.ON;
    },
    choices: [{
      name: 'Enable Envtools Custom Command Line Prompt',
      short: 'Enable Envtools Prompt',
      value: common.ON
    }, {
      name: 'Disable Envtools Custom Command Line Prompt',
      short: 'Disable Envtools Prompt',
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
      short: 'Proxy only',
      value: common.CUSTOM_PROMPT_DEFAULT
    }, {
      name: 'Prompt with Proxy, Sinopia and Git information',
      short: 'Proxy and Sinopia',
      value: common.CUSTOM_PROMPT_WITH_SINOPIA
    }]
  }, {
    type: 'list',
    name: 'banner',
    message: 'Please choose one of the following options',
    when: function (res) {
      return !options.auto && res.load === common.ON;
    },
    choices: [{
      name: 'Enable Envtools Welcome Banner',
      value: common.ON
    }, {
      name: 'Disable Envtools Welcome Banner',
      value: common.OFF
    }]
  }];


  inquirer.prompt(questions).then(function (answers) {
    if (options.auto) {
      answers = defaults;
    }
    options.answers = answers;
    profile(options, function () {
      prompt(options, function () {
        banner(options, function () {
          callback(null, options);
        });
      });
    });
  });
};
