/*jshint unused:true*/

var
  _ = require('underscore'),
  util = require('util'),
  fs = require('fs-extra'),
  path = require('path'),

  log = require('fedtools-logs'),
  notifier = require('fedtools-notifier'),
  config = require('fedtools-config'),
  utilities = require('fedtools-utilities'),

  EnvtoolsBase = require('./base'),
  EnvtoolsCLI;


// -- C O N S T R U C T O R

/**
 * The one and only class you should use to bootstrap envtools CLI.
 * It's a one liner:
 * require('<this file>').parseCommandLine();
 */
EnvtoolsCLI = function () {
  EnvtoolsBase.call(this);
};

// -- I N H E R I T A N C E

util.inherits(EnvtoolsCLI, EnvtoolsBase);
EnvtoolsCLI.prototype.name = 'EnvtoolsCLI';

// -- E X T E N D E D  M E T H O D S

EnvtoolsCLI.prototype._initialize = function () {
  EnvtoolsBase.prototype._initialize.call(this);

  this.help = require('./help');
  this.version = require('./version');
  this.config = this.packageJson.config;
  this.name = this.packageJson.name;

  this.write = true; // no dry-run by default

  config.init(this.config);
};

// -- P R I V A T E  M E T H O D S
EnvtoolsCLI.prototype._runCommand = function (program, command, optimist) {
  var
    msg = [],
    bootstrap,
    rcInfo,
    versionMsg,
    notification = _.isBoolean(program.notification) ? program.notification : true,
    self = this;

  switch (command) {

  case 'http':
  case 'web':
  case 'wup':
  case 'http-server':
    self.help.printManPage(utilities, 'simpleserver');
    utilities.simpleserver.listen({
      port: (program.port) ? program.port : 8080,
      root: process.cwd()
    });
    process.on('SIGINT', function () {
      log.echo();
      log.success('simple web server stopped.');
      process.exit();
    });

    process.on('SIGTERM', function () {
      log.echo();
      log.success('simple web server stopped.');
      process.exit();
    });
    break;


  case 'banner':
    if (fs.existsSync(path.join(process.env.RUNTIME_DIR, 'envtools-banner'))) {
      msg.push('             ★ Welcome to Envtools ★');
      msg.push('Environment loaded, type ' +
        log.strToColor('red', 'h') +
        ' for available shortcuts');
      switch (process.env.PROXY_STATUS) {
      case 'ON':
        msg.push(log.strToColor('yellow', '               (Proxy is turned ON)'));
        break;
      case 'OFF':
        msg.push(log.strToColor('yellow', '               (Proxy is turned OFF)'));
        break;
      }
      msg.push('\n');

      // current version to be displayed in the lower right corner banner
      versionMsg = log.strToColor('yellow', 'v' + self.version.currentVersion);

      // checking if there is a newer version
      rcInfo = config.getKey('envtoolsversion');
      if (rcInfo && rcInfo.latest) {
        if (require('semver').gt(rcInfo.latest, this.version.currentVersion)) {
          versionMsg = log.strToColor('green', 'New Version Available!');
        }
      }

      log.printMessagesInBox(msg, null, versionMsg);
    }
    break;

  case 'auto':
  case 'automatic':
  case 'boot':
  case 'bootstrap':
    bootstrap = require('../bootstrap');
    self.help.printManPage(bootstrap, 'auto');
    bootstrap.auto({
      debug: self.debug,
      i18n: self.i18n
    }, function (err) {
      if (err &&
        (err !== bootstrap.USER_INTERRUPT && err !== bootstrap.USER_WARNING)) {
        log.error(self.i18n.t('bootstrap.errors.general'));
        log.info(self.i18n.t('bootstrap.errors.info'));
        log.echo();
        if (notification) {
          notifier.notify({
            title: 'Envtools Notification',
            message: self.i18n.t('bootstrap.errors.general'),
            sound: 'Blow',
            type: 'ERROR',
            notifier: program.notifier
          });
        }
      }
    });
    break;

  case 'manual':
  case 'config':
  case 'configure':
  case 'setup':
    bootstrap = require('../bootstrap');
    self.help.printManPage(bootstrap, 'manual');
    bootstrap.manual({
      debug: self.debug,
      i18n: self.i18n
    }, function (err) {
      if (err &&
        (err !== bootstrap.USER_INTERRUPT && err !== bootstrap.USER_WARNING)) {
        log.error(self.i18n.t('bootstrap.errors.general'));
        log.info(self.i18n.t('bootstrap.errors.info'));
        log.echo();
        if (notification) {
          notifier.notify({
            title: 'Envtools Notification',
            message: self.i18n.t('bootstrap.errors.general'),
            sound: 'Blow',
            type: 'ERROR',
            notifier: program.notifier
          });
        }
      }
    });
    break;

  case 'extra':
  case 'xtra':
    bootstrap = require('../bootstrap');
    self.help.printManPage(bootstrap, 'extra');
    bootstrap.extra({
      debug: self.debug,
      i18n: self.i18n
    }, function (err) {
      if (err &&
        (err !== bootstrap.USER_INTERRUPT && err !== bootstrap.USER_WARNING)) {
        log.error(self.i18n.t('bootstrap.errors.general'));
        log.info(self.i18n.t('bootstrap.errors.info'));
        log.echo();
        if (notification) {
          notifier.notify({
            title: 'Envtools Notification',
            message: self.i18n.t('bootstrap.errors.general'),
            sound: 'Blow',
            type: 'ERROR',
            notifier: program.notifier
          });
        }
      }
    });
    break;


  case 'check':
  case 'up':
  case 'update':
  case 'upgrade':
    self.version.printCurrentVersion(program.boring, function () {});
    break;

  case 'wt': // test
    break;

  default:
    if (program._.length === 0 ||
      (program._.length > 1 && program._[0] !== 'help')) {
      if (program.version || program.V) {
        self.version.printCurrentVersion(program.boring, function () {
          process.exit(0);
        });
      } else {
        log.debug('command not found');
        self.help.printUsage(optimist.help(), program, self.version.currentVersion);
        process.exit(0);
      }
    } else if (program.version || program.V) {
      self.version.printCurrentVersion(program.boring, function () {
        process.exit(0);
      });
    } else {
      self.help.printUsage(optimist.help(), program, self.version.currentVersion);
      process.exit(0);
    }
    break;

  }
};

// -- P U B L I C  M E T H O D S
EnvtoolsCLI.prototype.parseCommandLine = function () {
  var
    optimist,
    command,
    program;

  optimist = require('optimist')
    .usage(log.strToColor('cyan', 'Usage: ') + this.name + ' [options] command')
    .alias('v', 'version')
    .describe('v', this.i18n.t('help.v'))
    .alias('b', 'boring')
    .describe('b', this.i18n.t('help.b'))
    .alias('d', 'debug')
    .describe('d', this.i18n.t('help.d'))
    .alias('h', 'help')
    .describe('h', this.i18n.t('help.h'))
    .boolean(['b', 'd', 'V', 'v', 'h', 'n']);

  program = optimist.argv;

  // set the logs
  log.boring = program.boring || false;
  this.debug = log.verbose = program.debug || false;

  // parse some hidden options
  if (program.r || program.remote) {
    this.remote = log.remote = true;
  }
  if (program.write === false) {
    this.write = false;
  }
  // Other hidden options for remote action (building a WAR file).
  // These options are hidden because users should not use them.
  // They are only intended for the remote fedtools job that runs on
  // the Jenkins server.
  // -e [email]       The email where notifications should be sent
  // -u [username]    The username (fork) of the repository to extract
  // -w [wria-branch] The WF-RIA2 branch to build
  // -y [yui-branch]  The YUI3 branch to use for the build
  // -S               Prints the status of all current WAR jobs
  // -A               Adds a jenkins WAR job to the queue
  // -R               Removes a jenkins WAR job from the queue
  // -P               Process the oldest WAR job from the queue if no other
  //                  is running
  // -E               Execute the command directly, bypassing job queueing
  // -N               Flag to indicate a nightly build (only works with -E)

  // Parsing the actual commands
  if (program._[0] === 'help' && program._[1]) {
    this.help.help = true;
    command = program._[1];
  } else {
    command = program._[0];
  }

  log.debug('program: ', program);
  log.debug('command: ', command);

  // Geronimo!
  this._runCommand(program, command, optimist);
};


// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsCLI._instance || new EnvtoolsCLI();
})();
