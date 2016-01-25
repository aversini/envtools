/*jshint unused:false*/

var
  EnvtoolsBase,
  _ = require('underscore'),
  i18n = require('fedtools-i18n'),
  fs = require('fs'),
  path = require('path');


// -- C O N S T R U C T O R

/**
 * Base class that should be used by the CLI components (CLI, help and version).
 * It provides a basic initializer that loads the valid i18n strings, as well as
 * the common commands and their description. It also adds a reference to the
 * content of package.json (useful for version and config)
 */
EnvtoolsBase = function () {
  if (!EnvtoolsBase._instance) {
    EnvtoolsBase._instance = this;
  }

  // -- P U B L I C  P R O P E R T I E S
  Object.defineProperty(this, 'CMD_MAX_LEN', {
    value: 25,
    writable: false
  });
  Object.defineProperty(this, 'CMD_DESC_MAX', {
    value: 50,
    writable: false
  });

  this._initialize();
};
EnvtoolsBase.prototype.name = 'envtoolsBase';


// -- P R O T E C T E D  M E T H O D S
EnvtoolsBase.prototype._initialize = function () {
  // load common phrases
  this.i18n = i18n.loadPhrases(path.resolve(__dirname,
    '..', '..', 'data', 'i18n', 'common'));

  // cache package.json information
  this.packageJson = JSON.parse(fs.readFileSync(path.join(__dirname,
    '..', '..', 'package.json'), 'utf8'));

  // load commands
  this.commands = {
    'auto': {
      'description': this.i18n.t('commands.auto')
    },
    'manual': {
      'description': this.i18n.t('commands.manual')
    },
    'extra': {
      'description': this.i18n.t('commands.extra')
    }
  };
};

// -- E X P O R T S
module.exports = EnvtoolsBase;
