const i18n = require('fedtools-i18n');
const fs = require('fs');
const path = require('path');

// -- C O N S T R U C T O R

/**
 * Base class that should be used by the CLI components (CLI, help and version).
 * It provides a basic initializer that loads the valid i18n strings, as well as
 * the common commands and their description. It also adds a reference to the
 * content of package.json (useful for version and config)
 */
const EnvtoolsBase = function () {
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
  this.i18n = i18n.loadPhrases(
    path.resolve(__dirname, '..', '..', 'data', 'i18n', 'common')
  );

  // cache package.json information
  this.packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8')
  );

  // load commands
  this.commands = {
    'auto': {
      description: this.i18n.t('commands.auto')
    },
    'manual': {
      description: this.i18n.t('commands.manual')
    },
    'extra': {
      description: this.i18n.t('commands.extra')
    },
    'web': {
      description: this.i18n.t('commands.web')
    },
    'decrypt': {
      description: this.i18n.t('commands.decrypt')
    },
    'encrypt': {
      description: this.i18n.t('commands.encrypt')
    },
    'timer': {
      description: this.i18n.t('commands.timer')
    },
    'notifier': {
      description: this.i18n.t('commands.notifier')
    },
    'smtp': {
      description: this.i18n.t('commands.smtp')
    },
    'config': {
      description: this.i18n.t('commands.config')
    },
    'info': {
      description: this.i18n.t('commands.info')
    },
    'registry': {
      description: this.i18n.t('commands.registry')
    },
    'update': {
      description: this.i18n.t('commands.update')
    },
    'lite': {
      description: this.i18n.t('commands.lite')
    },
    'help [command]': {
      description: this.i18n.t('commands.help')
    }
  };
};

// -- E X P O R T S
module.exports = EnvtoolsBase;
