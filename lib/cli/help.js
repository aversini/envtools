/*eslint max-depth:0*/
var
  _ = require('lodash'),
  util = require('util'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  common = require('../common'),
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
 * Print the short usage for envtools within a box.
 *
 * @method printShortUsage
 * @param  {String} intro   Some introductory message(s) to print.
 * @param  {Object} version The version instance.
 */
EnvtoolsHelp.prototype.printShortUsage = function (intro, version) {
  var
    i,
    msgs = [],
    currentVersion,
    commandsArray,
    commandsArrayLen,
    commandsList = _.keys(this.commands);

  msgs.push('');
  if (intro) {
    msgs.push(intro);
  }
  msgs.push(log.strToColor('yellow', this.i18n.t('prompt.parameters')));
  commandsArray = utilities.wordWrap(commandsList.join(', '), this.CMD_DESC_MAX);
  commandsArrayLen = commandsArray.length;
  for (i = 0; i < commandsArrayLen; i += 1) {
    msgs.push('  ' + commandsArray[i]);
  }
  msgs.push('');
  msgs.push(log.strToColor('yellow', this.i18n.t('prompt.extraHelpTitle')));
  msgs.push('  ' + this.i18n.t('prompt.extraHelpContent'));
  msgs.push('');

  currentVersion = (version && version.currentVersion) ? 'v' + version.currentVersion : null;
  log.printMessagesInBox(msgs, common.LOG_COLORS.DEFAULT_BOX, currentVersion);
};

/**
 * Print long usage for envtools.
 *
 * @method printLongtUsage
 * @param  {String} intro Some introductory message(s) to print.
 */
EnvtoolsHelp.prototype.printLongUsage = function (intro) {
  var
    cmdtmp, cmdtmplen, cmdt, cmdl, cmdd, i, j,
    commandsList = _.keys(this.commands),
    len = commandsList.length,
    descArray, descArrayLen,
    buffer = '',
    CMD_PRE_BUFFER = '  ';

  if (intro) {
    log.echo(intro);
  }
  log.echo(this.i18n.t('prompt.parameters'));

  for (i = 0; i < len; i += 1) {
    cmdt = commandsList[i];
    cmdl = this.commands[commandsList[i]].full;
    cmdd = this.commands[commandsList[i]].description;

    if (cmdl) {
      cmdtmp = CMD_PRE_BUFFER + cmdt + ' (' + cmdl + ')';
    } else {
      cmdtmp = CMD_PRE_BUFFER + cmdt;
    }
    cmdtmplen = cmdtmp.length;

    buffer = log.strToColor('cyan', cmdtmp) +
      log.strToColor('white', new Array(this.CMD_MAX_LEN - cmdtmplen).join('.')) + ' ';
    descArray = utilities.wordWrap(cmdd, this.CMD_DESC_MAX);

    log.echo();
    log.rainbow(buffer + descArray[0]);
    descArrayLen = descArray.length;
    for (j = 1; j < descArrayLen; j += 1) {
      log.rainbow(new Array(this.CMD_MAX_LEN + 1).join(' ') + descArray[j]);
    }
  }
  log.echo();
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
    this.printLongUsage(intro);
    version.printUpgradeIfAny();
  } else {
    this.printShortUsage(intro, version);
    version.printUpgradeIfAny();
  }
};

// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsHelp._instance || new EnvtoolsHelp();
})();
