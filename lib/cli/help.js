/*eslint max-depth:0*/
var
  _ = require('lodash'),
  util = require('util'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  EnvtoolsBase = require('./base'),
  EnvtoolsHelp;

// -- C O N S T R U C T O R

EnvtoolsHelp = function () {
  EnvtoolsBase.call(this);
};

// -- I N H E R I T A N C E

util.inherits(EnvtoolsHelp, EnvtoolsBase);
EnvtoolsHelp.prototype.name = 'EnvtoolsHelp';

// -- E X T E N D E D  M E T H O D S

EnvtoolsHelp.prototype._initialize = function () {
  EnvtoolsBase.prototype._initialize.call(this);
};

// -- P R I V A T E  M E T H O D S


// -- P U B L I C  M E T H O D S

/**
 * Print the short usage for envtools withing a box.
 *
 * @method printShortUsage
 * @param  {String} intro   Some introductory message(s) to print.
 * @param  {String} version The currently installed version.
 */
EnvtoolsHelp.prototype.printShortUsage = function (intro, version) {
  var
    i, msgs = [],
    commandsArray,
    commandsArrayLen,
    commandsList = _.keys(this.commands).sort();

  msgs.push('');
  if (intro) {
    msgs.push(intro);
  }
  msgs.push(log.strToColor('cyan', this.i18n.t('prompt.parameters')));
  commandsArray = utilities.wordWrap(commandsList.join(', '), this.CMD_DESC_MAX);
  commandsArrayLen = commandsArray.length;
  for (i = 0; i < commandsArrayLen; i += 1) {
    msgs.push('  ' + commandsArray[i]);
  }
  msgs.push('');
  msgs.push(log.strToColor('cyan', this.i18n.t('prompt.extraHelpTitle')));
  msgs.push('  ' + this.i18n.t('prompt.extraHelpContent'));
  msgs.push('');

  version = (version) ? 'v' + version : null;
  log.printMessagesInBox(msgs, null, version);
};

/**
 * Use this method to print envtools usage. Based on the parameters it will
 * know if the full or short usage should be printed.
 *
 * @method printUsage
 * @param  {String} intro     Some introductory message(s) to print.
 * @param  {Object} program   Only prints the full usage if program.help
 *                            is true or if program._[0] is 'help'...
 *                            (Way too close to optimist... needs to be improved)
 */
EnvtoolsHelp.prototype.printUsage = function (intro, program, version) {
  if (program.help || program._[0] === 'help') {
    require('./actions/help')();
  } else {
    this.printShortUsage(intro, version);
  }
};

// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsHelp._instance || new EnvtoolsHelp();
})();
