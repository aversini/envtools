/*eslint complexity: 0*/

var common = require('../common'),
  util = require('util'),
  log = require('fedtools-logs'),
  config = require('fedtools-config'),
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

  // no dry-run by default
  this.write = true;

  config.init(this.config);
};

// -- P R I V A T E  M E T H O D S
EnvtoolsCLI.prototype._runCommand = function (program, command, optimist) {
  var self = this;

  if (self.help.help) {
    log.debug('call for help with command: ', command);
    if (command) {
      require('./actions/help')(self, command);
    } else {
      require('./actions/default')(self, program, optimist);
    }
  } else {
    switch (command) {
    case 'npmrc':
    case 'yarnrc':
      require('./actions/npmrc')(self, program);
      break;

    case 'registry':
      require('./actions/registry')(self, program);
      break;

    case 'smtp':
    case 'smtp-server':
    case 'smtpserver':
      require('./actions/smtp-server')(self, program);
      break;

    case 'info':
    case 'system':
      require('./actions/info')(self, program);
      break;

    case 'config':
      require('../bootstrap/plugins/envtools')(
        {
          version: self.version
        },
        function () {
          // nothing to declare
        }
      );
      break;
    case 'notif':
    case 'notifier':
    case 'alert':
    case 'growl':
      require('./actions/notifier')(self, program);
      break;

    case 'timer':
    case 't':
      require('./actions/timer')(self, program);
      break;

    case 'encrypt':
    case 'encipher':
      program.encrypt = true;
      require('./actions/crypto')(self, program);
      break;

    case 'decrypt':
    case 'decipher':
      program.encrypt = false;
      require('./actions/crypto')(self, program);
      break;

    case 'http':
    case 'web':
    case 'wup':
    case 'http-server':
      require('./actions/http-server')(self, program);
      break;

    case 'update':
    case 'check':
    case 'up':
    case 'upgrade':
      self.version.printUpgradeIfAny(true);
      break;

    case 'sinopia':
      require('./actions/sinopia')(self, program);
      break;

    case 'auto':
    case 'automatic':
    case 'boot':
    case 'bootstrap':
    case 'a':
      require('./actions/bootstrap')(self, 'auto', program, function (err) {
        if (!err) {
          self.version.printUpgradeIfAny();
        }
      });
      break;

    case 'manual':
    case 'configure':
    case 'setup':
    case 'm':
      require('./actions/bootstrap')(self, 'manual', program, function (err) {
        if (!err) {
          self.version.printUpgradeIfAny();
        }
      });
      break;

    case 'extra':
    case 'xtra':
    case 'e':
    case 'x':
      require('./actions/bootstrap')(self, 'extra', program, function (err) {
        if (!err) {
          self.version.printUpgradeIfAny();
        }
      });
      break;

    case 'lite':
    case 'envlite':
    case 'envtools-lite':
      require('./actions/envlite')(self, program);
      break;

    case 'wt':
      require('./actions/testing-only')(self, program);
      break;

    case 'sds':
      require('./actions/sds')(self, program);
      break;

    default:
      log.debug('default case...');
      require('./actions/default')(self, program, optimist);
      break;
    }
  }
};

// -- P U B L I C  M E T H O D S
EnvtoolsCLI.prototype.parseCommandLine = function () {
  var self = this,
    optimist,
    command,
    program;

  optimist = require('optimist')
    .usage(
      log.strToColor('yellow', 'Usage: ') + self.name + ' [options] command'
    )
    .alias('v', 'version')
    .describe('v', self.i18n.t('help.v'))
    .alias('b', 'boring')
    .describe('b', self.i18n.t('help.b'))
    .alias('d', 'debug')
    .describe('d', self.i18n.t('help.d'))
    .alias('h', 'help')
    .describe('h', self.i18n.t('help.h'))
    .boolean(['b', 'd', 'V', 'v', 'h', 'n']);

  program = optimist.argv;

  // set the logs
  log.boring = program.boring || false;
  self.debug = log.verbose = program.debug || false;

  // parse some hidden options
  if (program.r || program.remote) {
    self.remote = log.remote = true;
  }
  if (program.write === false) {
    self.write = false;
  }

  // Parsing the actual commands
  if (program._[0] === 'help' && program._[1]) {
    self.help.help = true;
    command = program._[1];
  } else {
    command = program._[0];
  }

  log.debug('program: ', program);
  log.debug('command: ', command);

  // Geronimo!
  common.createRuntimeDir(function () {
    self._runCommand(program, command, optimist);
  });
};

// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsCLI._instance || new EnvtoolsCLI();
})();
