/*eslint indent:0*/
var
  _ = require('lodash'),
  util = require('util'),
  moment = require('moment'),
  path = require('path'),

  log = require('fedtools-logs'),
  config = require('fedtools-config'),

  common = require('../common'),

  EnvtoolsBase = require('./base'),
  EnvtoolsVersion;

// -- C O N S T R U C T O R

EnvtoolsVersion = function () {
  EnvtoolsBase.call(this);
};

// -- I N H E R I T A N C E

util.inherits(EnvtoolsVersion, EnvtoolsBase);
EnvtoolsVersion.prototype.name = 'EnvtoolsVersion';

// -- E X T E N D E D  M E T H O D S

EnvtoolsVersion.prototype._initialize = function () {
  var
    rcInfo,
    canCheck = false,
    needToCheck = false;

  EnvtoolsBase.prototype._initialize.call(this);

  // check for current version
  this.currentVersion = this.packageJson.version;

  // checking if the version was already benn checked recently
  rcInfo = this._getConfiguration();
  if (rcInfo && rcInfo.checkAutomatically === common.ON) {
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
    require('child_process').spawn(process.execPath, [path.join(__dirname, '..', '..', 'bin',
      'check.js')], {
      detached: true,
      stdio: 'ignore'
    }).unref();
  }
};

// -- P R I V A T E  M E T H O D S
EnvtoolsVersion.prototype._getConfiguration = function () {
  return config.getKey('envtoolsversion');
};

// -- P U B L I C  M E T H O D S

EnvtoolsVersion.prototype.setAutoCheck = function (flag) {
  config.setKey('envtoolsversion', _.extend(this._getConfiguration(), {
    checkAutomatically: flag
  }), true, true);
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
 * @method printUpgradeOption
 * @param  {Boolean} force If true, ignore the 'alreadyDisplayed' key
 */
EnvtoolsVersion.prototype.printUpgradeOption = function (force) {
  var
    msg1,
    msg2,
    rcInfo = this._getConfiguration();

  if ((rcInfo && !rcInfo.alreadyDisplayed && rcInfo.latest) ||
    (rcInfo && force === true && rcInfo.latest)) {
    if (require('semver').gt(rcInfo.latest, this.currentVersion)) {
      msg1 = this.i18n.t('version.updateAvailable', {
        latest: log.strToColor('green', rcInfo.latest),
        current: this.currentVersion
      });
      msg2 = this.i18n.t('version.runCommandToUpdate', {
        command: (process.platform === 'win32') ?
          log.strToColor('cyan', this.i18n.t('updateCmdWin')) : log.strToColor('cyan',
            this.i18n.t(
              'updateCmd'))
      });

      log.printMessagesInBox([msg1, msg2]);

      // need to mark version as displayed so that it won't
      // be shown to the user again (until the expiration date)
      config.setKey('envtoolsversion', _.extend(rcInfo, {
        alreadyDisplayed: true
      }), true, true);
    }
  }
  return msg1;
};

/**
 * This method is supposed to be called explicitely by the user (for
 * example, envtools -v). In that case, we assume that we can present
 * the current version, but also the 'update available' message.
 *
 * @method printCurrentVersion
 */
EnvtoolsVersion.prototype.printCurrentVersion = function (boring, done) {
  log.echo();
  if (!this.printUpgradeOption(true)) {
    log.printMessagesInBox([
      this.i18n.t('version.installed') + log.strToColor('green', this.currentVersion)
    ]);
  }
  done();
};

// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsVersion._instance || new EnvtoolsVersion();
})();
