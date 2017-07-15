var _ = require('lodash'),
  profile = require('./profile'),
  prompt = require('./prompt'),
  banner = require('./banner'),
  version = require('./version'),
  log = require('fedtools-logs'),
  inquirer = require('inquirer'),
  common = require('../../common'),
  envtoolsCfg = common.ENVTOOLS;

module.exports = function (options, callback) {
  var defaults = {
      choices: [
        envtoolsCfg.CFG_AUTOLOAD,
        envtoolsCfg.CFG_BANNER,
        envtoolsCfg.CFG_CUSTOM_PROMPT
      ],
      custom: common.CUSTOM_PROMPT_DEFAULT
    },
    questions,
    currentPrompt = prompt.getPrompt(),
    currentBanner = banner.getBanner(),
    currentAutoCheck = options.version.getAutoCheck(),
    mainQuestions = [];

  // we always ask if user wants to load Envtools
  mainQuestions.push({
    name: envtoolsCfg.CFG_AUTOLOAD_LABEL,
    short: envtoolsCfg.CFG_AUTOLOAD,
    checked: true,
    value: envtoolsCfg.CFG_AUTOLOAD
  });

  // we only offer a custom prompt if not Zsh
  if (!common.isZsh()) {
    mainQuestions.push({
      name: envtoolsCfg.CFG_CUSTOM_PROMPT_LABEL,
      short: envtoolsCfg.CFG_CUSTOM_PROMPT,
      checked: _.isBoolean(currentPrompt) ? currentPrompt : true,
      value: envtoolsCfg.CFG_CUSTOM_PROMPT
    });
  }

  // and we ask about Envtools banner and autocheck all the time
  mainQuestions.push(
    {
      name: envtoolsCfg.CFG_BANNER_LABEL,
      short: envtoolsCfg.CFG_BANNER,
      checked: currentBanner,
      value: envtoolsCfg.CFG_BANNER
    },
    {
      name: envtoolsCfg.CFG_AUTOCHECK_LABEL,
      short: envtoolsCfg.CFG_AUTOCHECK,
      checked: currentAutoCheck === common.ON,
      value: envtoolsCfg.CFG_AUTOCHECK
    }
  );

  questions = [
    {
      type: 'checkbox',
      name: 'choices',
      message: 'Please choose one of more options',
      when: function () {
        return !options.auto;
      },
      choices: mainQuestions
    },
    {
      type: 'list',
      name: 'custom',
      message: 'Please choose one of the following custom prompts',
      when: function (res) {
        if (
          !common.isZsh() &&
          _.indexOf(res.choices, envtoolsCfg.CFG_CUSTOM_PROMPT) >= 0
        ) {
          return true;
        }
      },
      default: currentPrompt - 1,
      choices: [
        {
          name: 'Prompt with Proxy and Git information',
          short: 'Proxy and Git',
          value: common.CUSTOM_PROMPT_DEFAULT
        },
        {
          name: 'Prompt with Proxy, Git and Sinopia information',
          short: 'Proxy, Git and Sinopia',
          value: common.CUSTOM_PROMPT_WITH_SINOPIA
        },
        {
          name: 'Prompt with Proxy, Git, Node and Sinopia information',
          short: 'Proxy, Git, Node and Sinopia',
          value: common.CUSTOM_PROMPT_WITH_SINOPIA_AND_NODE
        },
        {
          name: 'Prompt with Proxy, Git and Node information',
          short: 'Proxy, Git and Node',
          value: common.CUSTOM_PROMPT_WITH_NODE
        }
      ]
    }
  ];

  inquirer.prompt(questions).then(function (answers) {
    var choices,
      toggleOptions = {
        msg: []
      };

    function applyConfiguration(opts, done) {
      profile.setAutoLoad(opts, function () {
        prompt.setPrompt(opts, function () {
          banner.setBanner(opts, function () {
            version(opts, function () {
              done(null, opts);
            });
          });
        });
      });
    }

    function parseChoices(choices, val, label) {
      if (_.indexOf(choices, val) >= 0) {
        toggleOptions.msg.push(
          label + ': ' + log.strToColor('green', common.ON)
        );
        toggleOptions[val] = common.ON;
      } else {
        toggleOptions.msg.push(
          label + ': ' + log.strToColor('yellow', common.OFF)
        );
        toggleOptions[val] = common.OFF;
      }
    }

    choices = options.auto ? defaults : answers;

    parseChoices(
      choices.choices,
      envtoolsCfg.CFG_AUTOLOAD,
      envtoolsCfg.CFG_AUTOLOAD_LABEL
    );
    parseChoices(
      choices.choices,
      envtoolsCfg.CFG_CUSTOM_PROMPT,
      envtoolsCfg.CFG_CUSTOM_PROMPT_LABEL
    );
    parseChoices(
      choices.choices,
      envtoolsCfg.CFG_BANNER,
      envtoolsCfg.CFG_BANNER_LABEL
    );
    parseChoices(
      choices.choices,
      envtoolsCfg.CFG_AUTOCHECK,
      envtoolsCfg.CFG_AUTOCHECK_LABEL
    );

    options.toggleOptions = toggleOptions;
    options.toggleOptions.custom = options.auto
      ? defaults.custom
      : answers.custom;

    if (options.auto) {
      applyConfiguration(options, callback);
    } else {
      questions = {
        type: 'confirm',
        name: 'goodToGo',
        message: 'Do you want to continue?',
        default: true
      };
      log.printMessagesInBox(
        options.toggleOptions.msg,
        common.LOG_COLORS.DEFAULT_BOX
      );
      inquirer.prompt(questions).then(function (a) {
        if (a.goodToGo) {
          applyConfiguration(options, callback);
        } else {
          return callback(common.USER_INTERRUPT, options);
        }
      });
    }
  });
};
