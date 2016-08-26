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

/**
 * Display a standardized help page, akin to man pages.
 *
 * @method printManPage
 * @param  {Object} options  Object containing the following keys:
 * "name", "synopsis", "description", "options", and "examples"
 */
EnvtoolsHelp.prototype.printManPage = function (module, type) {
  var
    prop,
    options, _options,
    i, j, len, sublen, res, re,
    MAX_WORD_WRAP_LEN = 12,
    PREFIX_LEVEL1 = '       ',
    PREFIX_LEVEL2 = '           ';

  if (this.help) {
    if (typeof module.getHelp === 'function') {
      options = module.getHelp(false, {
        i18n: this.i18n,
        type: type
      });
      re = new RegExp(options.namespace);
      log.resetConsole();
      for (prop in options) {
        if (options.hasOwnProperty(prop) && prop) {
          if (options[prop] && !re.exec(options[prop])) {
            log.title(this.i18n.t('help.full.' + prop));
            if (prop === 'options') {
              _options = options[prop];
              len = _options.length;
              for (i = 0; i < len; i += 1) {
                if (!re.exec(_options[i].desc)) {
                  log.echo(PREFIX_LEVEL1 + _options[i].option);
                  res = utilities.wordWrap(_options[i].desc, process.stdout.columns - MAX_WORD_WRAP_LEN);
                  sublen = res.length;
                  for (j = 0; j < sublen; j += 1) {
                    log.echo(PREFIX_LEVEL2 + res[j]);
                  }
                  log.echo();
                }
              }
            } else {
              res = utilities.wordWrap(options[prop], process.stdout.columns - MAX_WORD_WRAP_LEN);
              len = res.length;
              for (i = 0; i < len; i += 1) {
                log.echo(PREFIX_LEVEL1 + res[i]);
              }
            }
            log.echo();
          }
        }
      }
    } else {
      log.echo();
      log.notice(this.i18n.t('help.na'));
      log.echo();
    }
    process.exit();
  }
};

// -- E X P O R T S
module.exports = (function () {
  return EnvtoolsHelp._instance || new EnvtoolsHelp();
})();
