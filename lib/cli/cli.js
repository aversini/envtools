/*jshint unused:true*/

var
  util = require('util'),
  log = require('fedtools-logs'),
  config = require('fedtools-config'),
  banner = require('./actions/banner'),
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
    self = this;

  switch (command) {

  case 'help':
    require('./actions/help')();
    break;

  case 'http':
  case 'web':
  case 'wup':
  case 'http-server':
    require('./actions/http-server')(self, program);
    break;

  case 'banner':
    banner(self, config);
    break;

  case 'sinopia':
    require('./actions/sinopia')(self, program);
    break;

  case 'auto':
  case 'automatic':
  case 'boot':
  case 'bootstrap':
  case 'a':
    require('./actions/bootstrap')(self, 'auto', program);
    break;

  case 'manual':
  case 'config':
  case 'configure':
  case 'setup':
  case 'm':
    require('./actions/bootstrap')(self, 'manual', program);
    break;

  case 'extra':
  case 'xtra':
  case 'e':
  case 'x':
    require('./actions/bootstrap')(self, 'extra', program);
    break;

  case 'check':
  case 'up':
  case 'update':
  case 'upgrade':
    require('./actions/version')(self, program);
    break;

  case 'lite':
  case 'envlite':
  case 'envtools-lite':
    require('./actions/envlite')(self, program);
    break;

  case 'wt': // test
    require('./actions/testing-only')(self, program);
    break;

  default:
    require('./actions/default')(self, program, optimist);
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
