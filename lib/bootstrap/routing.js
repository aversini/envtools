var
  _ = require('lodash'),
  path = require('path'),
  async = require('async'),
  inquirer = require('inquirer'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  rimraf = require('rimraf'),
  common = require('./common'),
  plugins = require('./plugins/index'),

  REQUEST_ATOM = 'r_atom',
  REQUEST_SINOPIA = 'r_sinopia',
  REQUEST_SCREENSAVER = 'r_screensaver',
  REQUEST_QUICKLOOK = 'r_quicklook',
  REQUEST_POWER_CHIME = 'r_powerchime',

  REQUEST_JSBEAUTIFY_CFG = 'r_jsbeautifyrc',
  REQUEST_ESLINT_CFG = 'r_eslintrc',
  REQUEST_FEDTOOLS = 'r_fedtools',
  REQUEST_USR_LOCAL = 'r_usr_local',
  REQUEST_MAVEN = 'r_maven',
  REQUEST_RUBY = 'r_ruby',
  REQUEST_HOMEBREW = 'r_brew',
  REQUEST_PROXY = 'r_proxy',
  REQUEST_CHECK_APPS = 'r_check_apps',
  REQUEST_GIT_CFG = 'r_git',
  REQUEST_NODE_NPM = 'r_node_npm',
  REQUEST_ENVTOOLS = 'r_envtools';

// -- P R I V A T E  M E T H O D S
function _buildOptions(options, callback) {
  var
    choices = {};

  choices[common.TYPE_MANUAL] = [];
  choices[common.TYPE_AUTO] = [];
  choices[common.TYPE_EXTRA] = [];

  function _addChoice(choice) {
    var
      platform = choice.restrictOs || [process.platform];
    _.each(choice.type, function (type) {
      if (platform.indexOf(process.platform) >= 0) {
        choices[type].push(choice);
      }
    });
  }

  _addChoice({
    name: options.i18n.t('bootstrap.configureEnvtools'),
    short: 'Configure Envtools',
    value: REQUEST_ENVTOOLS,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.configureEnvtools
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setUsrLocal'),
    short: 'Enable sudo-less',
    value: REQUEST_USR_LOCAL,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.fixUsrLocal,
    restrictOs: ['darwin', 'linux']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setProxy'),
    short: 'Proxy setup',
    value: REQUEST_PROXY,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapProxy
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setEslintConfig'),
    short: 'Install ESLint config',
    value: REQUEST_ESLINT_CFG,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapEslintConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setJsBeautifyConfig'),
    short: 'Install jsBeautify configuration',
    value: REQUEST_JSBEAUTIFY_CFG,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapJsBeautifyConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setGitCfg'),
    short: 'Configure git',
    value: REQUEST_GIT_CFG,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapGitConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setNPM'),
    short: 'Configure node and npm',
    value: REQUEST_NODE_NPM,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapNodeAndNpm
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setMaven'),
    short: 'Install Maven',
    value: REQUEST_MAVEN,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapMaven
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setBrew'),
    short: 'Install Homebrew',
    value: REQUEST_HOMEBREW,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapHomebrew,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setRuby'),
    short: 'Install Ruby',
    value: REQUEST_RUBY,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapRuby,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.installFedtools'),
    short: 'Install Fedtools',
    value: REQUEST_FEDTOOLS,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.installFedtools
  });
  _addChoice({
    name: options.i18n.t('bootstrap.checkApps'),
    short: 'Check Apps',
    value: REQUEST_CHECK_APPS,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.checkForApps
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setQuicklook'),
    short: 'Install Quicklook',
    value: REQUEST_QUICKLOOK,
    type: [common.TYPE_EXTRA],
    fct: plugins.installQuickLookPlugins,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.fixScreensaver'),
    short: 'Fix screensaver',
    value: REQUEST_SCREENSAVER,
    type: [common.TYPE_EXTRA],
    fct: plugins.fixScreensaver,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setAtom'),
    short: 'Configure Atom',
    value: REQUEST_ATOM,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapAtom
  });
  _addChoice({
    name: options.i18n.t('bootstrap.enablePowerChime'),
    short: 'Enable Power Chime',
    value: REQUEST_POWER_CHIME,
    type: [common.TYPE_EXTRA],
    fct: plugins.togglePowerChimeSound,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setSinopia'),
    short: 'Enable/disable sinopia',
    value: REQUEST_SINOPIA,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapSinopia
  });

  callback(null, choices);
}

function _displayOptions(type, choices, options, callback) {
  var
    res,
    introMsg = {},
    questions;

  introMsg[common.TYPE_AUTO] = [
    options.i18n.t('bootstrap.intro.auto'),
    options.i18n.t('bootstrap.intro.getOutAdvice1')
  ];
  introMsg[common.TYPE_MANUAL] = [
    options.i18n.t('bootstrap.intro.manual'),
    options.i18n.t('bootstrap.intro.getOutAdvice2')
  ];
  introMsg[common.TYPE_EXTRA] = [
    options.i18n.t('bootstrap.intro.extra'),
    options.i18n.t('bootstrap.intro.getOutAdvice3')
  ];

  log.resetConsole();
  log.echo();
  log.printMessagesInBox(introMsg[type]);
  log.echo();

  // Creating the first function for waterfall
  function _entryPoint(done) {
    utilities.forceAdminAccess(true, function (err) {
      return done(err, options);
    });
  }

  if (type === common.TYPE_AUTO) {
    // we are in auto mode, we need less confirmations
    options.auto = true;
    // we also need to cleanup the resume_auto file if any
    rimraf.sync(common.ENVTOOLS.RESUME_AUTO);
    // need to run each commands in waterfall,
    // so extracting all fct and putting them into
    // an array (for async.waterfall)
    res = _.map(choices[common.TYPE_AUTO], function (item) {
      return item.fct;
    });
    // adding the first function for waterfall on top of the list
    res.unshift(_entryPoint);
    // and finally running the show
    async.waterfall(res, function (err) {
      callback(err);
    });
  } else {
    choices[type].unshift(new inquirer.Separator(''));
    questions = [{
      pageSize: choices[type].length + 1,
      type: 'list',
      name: 'command',
      message: options.i18n.t('bootstrap.intro.msg1'),
      choices: choices[type]
    }];
    inquirer.prompt(questions).then(function (answers) {
      var res = _.find(choices[type], function (item) {
        return (item.value === answers.command);
      });
      if (res && _.isFunction(res.fct)) {
        res.fct(options, function (err, opt, msg) {
          if (!err && msg) {
            log.echo();
            log.success(msg);
            log.echo();
          }
          callback(err);
        });
      } else {
        return callback(1);
      }
    });
  }
}

// -- R O U T I N G  P R O C E D U R E
exports.routeCLIRequest = function (type, options, done) {
  var msg = [];
  options.i18n.loadPhrases(path.resolve(__dirname, '..', '..', 'data', 'i18n', 'bootstrap'));
  _buildOptions(options, function (err, choices) {
    if (err) {
      throw new Error(err);
    }
    common.createRuntimeDir(function () {
      _displayOptions(type, choices, options, function (err) {
        if ((err && err === common.USER_INTERRUPT) ||
          (!err && options.auto && options.actionsDone === 0)) {
          log.echo();
          log.echo('Bye then...');
          return done();
        }
        if (err && err === common.USER_IGNORE) {
          log.echo();
          return done();
        }
        if (err && err === common.USER_WARNING) {
          log.echo();
          return done();
        }
        if (!err &&
          (options.auto && options.actionsDone) || (!options.auto)) {
          log.echo();
          msg.push('To take changes into account, you have to restart your session.');
          if (process.env.ENVTOOLS_VERSION) {
            msg.push(log.strToColor('cyan', 'Hint:') + ' type r + ENTER or just restart your terminal...');
          }
          log.printMessagesInBox(msg);
        }
        log.echo();
        done(err);
      });
    });
  });
};
