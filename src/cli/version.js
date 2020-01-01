const _ = require("lodash");
const util = require("util");
const moment = require("moment");
const path = require("path");
const log = require("fedtools-logs");
const config = require("fedtools-config");
const common = require("../common");
const EnvtoolsBase = require("./base");

// -- C O N S T R U C T O R

const EnvtoolsVersion = function() {
  EnvtoolsBase.call(this);
};

// -- I N H E R I T A N C E

util.inherits(EnvtoolsVersion, EnvtoolsBase);
EnvtoolsVersion.prototype.name = "EnvtoolsVersion";

// -- E X T E N D E D  M E T H O D S

EnvtoolsVersion.prototype._initialize = function() {
  let canCheck = false,
    needToCheck = false;

  EnvtoolsBase.prototype._initialize.call(this);

  // check for current version
  this.currentVersion = this.packageJson.version;

  // checking if the version was already benn checked recently
  const rcInfo = this._getConfiguration();
  if (rcInfo && rcInfo[common.ENVTOOLS.CFG_AUTOCHECK] === common.ON) {
    canCheck = true;
  }
  if (canCheck && rcInfo && rcInfo.expiration) {
    // all the keys are here, let's check the expiration
    if (moment().isAfter(rcInfo.expiration)) {
      // time's out, need to check if there is a new version
      // Spawn a detached process that will update the key 'version'
      // from the .fedtoolsrc file with the following sub-keys:
      // version: {
      //   expiration: Now + 1d
      //   latest: x.y.z
      // }
      // It's non-blocking so the next time envtools run, just
      // checking the .fedtoolsrc file is enough.
      needToCheck = true;
    }
  } else {
    needToCheck = canCheck;
  }

  if (needToCheck) {
    require("child_process")
      .spawn(
        process.execPath,
        [path.join(__dirname, "..", "..", "bin", "check.js")],
        {
          detached: true,
          stdio: "ignore"
        }
      )
      .unref();
  }
};

// -- P R I V A T E  M E T H O D S
EnvtoolsVersion.prototype._getConfiguration = function() {
  return config.getKey("envtoolsversion");
};

// -- P U B L I C  M E T H O D S

EnvtoolsVersion.prototype.setAutoCheck = function(flag) {
  const o = {};
  o[common.ENVTOOLS.CFG_AUTOCHECK] = flag;
  config.setKey(
    "envtoolsversion",
    _.extend(this._getConfiguration(), o),
    true,
    true
  );
};

EnvtoolsVersion.prototype.getAutoCheck = function() {
  const cfg = this._getConfiguration();

  if (cfg) {
    return cfg[common.ENVTOOLS.CFG_AUTOCHECK]
      ? cfg[common.ENVTOOLS.CFG_AUTOCHECK]
      : common.OFF;
  } else {
    return common.OFF;
  }
};

/**
 * This method will read the .fedtoolrc configuration file.
 * It will then display the 'update available' box if the one of
 * the following is true:
 * 1) cfg.alreadyDisplayed is falsy and cfg.latest is truthy
 * 2) force is true and cfg.latest is truthy
 * If it does, it will also update the configuration file to mark
 * that the message has been displayed to the user. (no need to
 * display it again. This flag will be removed automatically after
 * one day).
 *
 * @method printUpgradeIfAny
 * @param  {Boolean} force If true, ignore the 'alreadyDisplayed' key
 */
EnvtoolsVersion.prototype.printUpgradeIfAny = function(force) {
  const self = this;
  const msg = [];
  const lightGrey = 245;
  const rcInfo = this._getConfiguration() || {};
  const LATEST_IS_INSTALLED = "You are up-to-date!";
  const NO_DATA_AVAILABLE =
    "There is no data available at this time.\nPlease check again later...";
  const AUTOCHECK_DISABLED = `Automatically check for update is disabled.\nYou can enable this option by typing ${log.strToColor(
    lightGrey,
    "envtools config"
  )}\nand following the instructions at the prompt.`;

  let boxColor;

  function printCustomMessage(msgs, boxColor) {
    log.echo();
    log.printMessagesInBox(
      msgs,
      boxColor ? boxColor : common.LOG_COLORS.DEFAULT_BOX
    );
    log.echo();
    return true;
  }

  if (force && !rcInfo) {
    return printCustomMessage([NO_DATA_AVAILABLE]);
  }

  if (force && rcInfo && rcInfo[common.ENVTOOLS.CFG_AUTOCHECK] !== common.ON) {
    return printCustomMessage([AUTOCHECK_DISABLED]);
  }

  if (rcInfo && rcInfo.latest) {
    if (require("semver").gt(rcInfo.latest, self.currentVersion)) {
      boxColor = "cyan";
      msg.push("");
      msg.push("A new version of Envtools has been published!");
      msg.push(
        `Envtools ${log.strToColor(
          "green",
          rcInfo.latest
        )} is now available - you have ${log.strToColor(
          lightGrey,
          self.currentVersion
        )}`
      );
      msg.push(
        `Type ${log.strToColor(
          lightGrey,
          "npm install -g envtools"
        )} to upgrade.`
      );
      msg.push("");
    } else if (force) {
      boxColor = "green";
      msg.push("");
      msg.push(`${LATEST_IS_INSTALLED} (${self.currentVersion})`);
      msg.push("");
    }
  } else if (force) {
    return printCustomMessage([NO_DATA_AVAILABLE]);
  }

  if (msg.length && (!rcInfo.alreadyDisplayed || force)) {
    // need to mark version as displayed so that it won't
    // be shown to the user again (until the expiration date)
    config.setKey(
      "envtoolsversion",
      _.extend(rcInfo, {
        alreadyDisplayed: true
      }),
      true,
      true
    );

    return printCustomMessage(msg, boxColor);
  }
};

/**
 * This method is supposed to be called explicitely by the user (for
 * example, envtools -v). In that case, we assume that we can present
 * the current version, but also the 'update available' message.
 *
 * @method printCurrentVersion
 */
EnvtoolsVersion.prototype.printCurrentVersion = function(boring, done) {
  if (!this.printUpgradeIfAny()) {
    log.echo();
    log.printMessagesInBox(
      [
        "",
        this.i18n.t("version.installed") +
          log.strToColor("green", this.currentVersion),
        ""
      ],
      common.LOG_COLORS.DEFAULT_BOX
    );
    log.echo();
  }
  done();
};

// -- E X P O R T S
module.exports = (function() {
  return EnvtoolsVersion._instance || new EnvtoolsVersion();
})();
