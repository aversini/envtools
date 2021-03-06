const _ = require("lodash");
const path = require("path");
const inquirer = require("inquirer");
const log = require("fedtools-logs");
const common = require("../common");
const plugins = require("./plugins/index");

// -- P R I V A T E  M E T H O D S
function _buildOptions(options, callback) {
  const choices = {};

  let requestIndex = 0;

  choices[common.TYPE_MANUAL] = [];
  choices[common.TYPE_AUTO] = [];
  choices[common.TYPE_EXTRA] = [];

  function _addChoice(choice) {
    const platform = choice.restrictOs || [process.platform];
    _.each(choice.type, function(type) {
      if (platform.indexOf(process.platform) >= 0) {
        choices[type].push(choice);
      }
    });
  }

  _addChoice({
    name: options.i18n.t("bootstrap.configureEnvtools"),
    short: "Configure Envtools",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.configureEnvtools
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setProxy"),
    short: "Proxy setup",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapProxy
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setUsrLocal"),
    short: "Enable sudo-less",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.fixUsrLocal,
    restrictOs: ["darwin", "linux"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setGitCfg"),
    short: "Configure git",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapGitConfiguration
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setNPM"),
    short: "Configure node and npm",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapNodeAndNpm
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setMaven"),
    short: "Install Maven",
    value: requestIndex++,
    type: [common.TYPE_AUTO, common.TYPE_MANUAL],
    fct: plugins.bootstrapMaven
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setAutoCheck"),
    short: "Automatically check version",
    value: requestIndex++,
    type: [common.TYPE_AUTO],
    fct: plugins.setAutoCheck
  });
  _addChoice({
    name: options.i18n.t("bootstrap.installYarn"),
    short: "Install Yarn",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.installYarn,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setBrew"),
    short: "Install Homebrew",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapHomebrew,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setRuby"),
    short: "Install Ruby",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapRuby,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.terminalProfile"),
    short: "Install Terminal Profile",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.terminalProfile,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.installNVM"),
    short: "Install nvm",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.installNVM,
    restrictOs: ["darwin", "linux"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setQuicklook"),
    short: "Install Quicklook",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.installQuickLookPlugins,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.fixScreensaver"),
    short: "Fix screensaver",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.fixScreensaver,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.installScreensaver"),
    short: "Install Apple Watch screensaver",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.installScreensaver,
    restrictOs: ["darwin"]
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setAtom"),
    short: "Configure Atom",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapAtom
  });
  _addChoice({
    name: options.i18n.t("bootstrap.setVSCode"),
    short: "Configure VS Code",
    value: requestIndex++,
    type: [common.TYPE_EXTRA],
    fct: plugins.bootstrapVSCode
  });

  callback(null, choices);
}

function _displayOptions(type, choices, options, callback) {
  const introMsg = {};
  let questions;

  introMsg[common.TYPE_AUTO] = [
    options.i18n.t("bootstrap.intro.auto"),
    options.i18n.t("bootstrap.intro.getOutAdvice1")
  ];
  introMsg[common.TYPE_MANUAL] = [
    options.i18n.t("bootstrap.intro.manual"),
    options.i18n.t("bootstrap.intro.getOutAdvice2")
  ];
  introMsg[common.TYPE_EXTRA] = [
    options.i18n.t("bootstrap.intro.extra"),
    options.i18n.t("bootstrap.intro.getOutAdvice3")
  ];

  log.resetConsole();
  log.echo();
  log.printMessagesInBox(introMsg[type], common.LOG_COLORS.DEFAULT_BOX);
  log.echo();

  if (type === common.TYPE_AUTO) {
    require("./routing-auto")(options, choices, callback);
  } else {
    // we are either in manual or extra...
    choices[type].unshift(new inquirer.Separator(""));
    questions = [
      {
        pageSize: choices[type].length + 1,
        type: "list",
        name: "command",
        message: options.i18n.t("bootstrap.intro.msg1"),
        choices: choices[type]
      }
    ];
    inquirer.prompt(questions).then(function(answers) {
      const res = _.find(choices[type], function(item) {
        return item.value === answers.command;
      });
      if (res && _.isFunction(res.fct)) {
        res.fct(options, function(err, opt, msg) {
          if ((!err || err === common.USER_IGNORE) && msg) {
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
exports.routeCLIRequest = function(type, options, done) {
  const msg = [];
  options.i18n.loadPhrases(
    path.resolve(__dirname, "..", "..", "data", "i18n", "bootstrap")
  );
  _buildOptions(options, function(err, choices) {
    if (err) {
      throw new Error(err);
    }
    // by default, we should be able to restart the session with shortcut "r"
    options.restartShortcutHint = true;
    _displayOptions(type, choices, options, function(err) {
      if (
        (err && err === common.USER_INTERRUPT) ||
        (!err && options.auto && options.actionsDone === 0)
      ) {
        log.echo();
        log.echo("Bye then...");
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
      if ((!err && options.auto && options.actionsDone) || !options.auto) {
        log.echo();
        msg.push(
          "To take changes into account, you may have to restart your session."
        );
        if (process.env.ENVTOOLS_VERSION && options.restartShortcutHint) {
          msg.push(
            `${log.strToColor(
              "cyan",
              "Hint:"
            )} type r + ENTER or just restart your terminal...`
          );
        }
        log.printMessagesInBox(msg, {
          color: common.LOG_COLORS.WARNING,
          align: {
            2: log.ALIGN.CENTER
          }
        });
      }
      log.echo();
      done(err);
    });
  });
};
