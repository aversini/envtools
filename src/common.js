const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const waterfall = require('async/waterfall');
const inquirer = require('inquirer');
const cmd = require('fedtools-commands');
const log = require('fedtools-logs');
const config = require('fedtools-config');
const utilities = require('fedtools-utilities');
const Fuse = require('fuse.js');
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux =
  process.platform === 'linux' ||
  process.platform === 'freebsd' ||
  process.platform === 'openbsd';
const isZsh = Boolean(process.env.SHELL.match('zsh'));
const USER_INTERRUPT = -1;
const USER_WARNING = -2;
const USER_FATAL = -3;
const USER_IGNORE = -4;
const NB_SPACES_FOR_TAB = 2;
const TYPE_SUDO = 100;
const TYPE_CHOWN = 200;
const TYPE_PREFIX = 300;
const ON = 'ON';
const OFF = 'OFF';
const NA = 'N/A';
const NOOP = function () {};
const RUNTIME_DIR = path.join(process.env.HOME, '.envtools');
const RUNTIME_BIN_DIR = path.join(process.env.HOME, '.envtools', 'bin');
const DOT_PROFILE = path.join(process.env.HOME, '.profile');
const DOT_BASH_PROFILE = path.join(process.env.HOME, '.bash_profile');
const DOT_ZSH_PROFILE = path.join(process.env.HOME, '.zshrc');
const DOT = '.';
const NPRMC = 'npmrc';
const YARNC = 'yarnrc';
const NPMRC_FILE = DOT + NPRMC;
const YARNRC_FILE = DOT + YARNC;
const NPMRC_PROFILE_FILE = NPRMC;
const YARNRC_PROFILE_FILE = YARNC;
const NPM_CONFIG = path.join(process.env.HOME, NPMRC_FILE);
const YARN_CONFIG = path.join(process.env.HOME, YARNRC_FILE);
const ENVTOOLS = {
  NAME: 'Envtools',
  VERSION: process.env.ENVTOOLS_VERSION
    ? `v${process.env.ENVTOOLS_VERSION}`
    : '',
  ROOTDIR: path.join(__dirname, '..'),
  THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
  SHELLDIR: path.join(__dirname, '..', 'shell'),
  PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
  PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
  SINOPIA_STATUS: path.join(RUNTIME_DIR, 'sinopia_status'),
  HELP_STATUS: path.join(RUNTIME_DIR, 'help_status.json'),
  RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto'),
  SYSTEM_INFO: path.join(RUNTIME_DIR, 'info.json'),
  NPMRC_PROFILES: path.join(RUNTIME_DIR, 'npmrcs'),
  NPMRC_CONFIG: path.join(RUNTIME_DIR, 'npmrcs.json'),
  AUTO_DONE: path.join(RUNTIME_DIR, 'auto'),
  DOT_PROFILE_COMMENT: '### Added by Envtools (main loader)',
  CFG_AUTOLOAD: 'autoload',
  CFG_AUTOLOAD_LABEL: 'Automatically load Envtools at each session',
  CFG_BANNER: 'banner',
  CFG_BANNER_LABEL: 'Enable Envtools Welcome Banner',
  CFG_AUTOCHECK: 'autocheck',
  CFG_AUTOCHECK_LABEL: 'Automatically check for new version',
  CFG_CUSTOM_PROMPT: 'prompt',
  CFG_CUSTOM_PROMPT_LABEL: 'Enable Envtools Custom Command Line Prompt'
};

function _isMac() {
  return isMac;
}

function _isWindows() {
  return isWindows;
}

function _isLinux() {
  return isLinux;
}

function _isZsh() {
  return isZsh;
}

function _createRuntimeDir(callback) {
  const bin1Src = path.join(ENVTOOLS.THIRDDIR, 'growlnotify', 'growlnotify.exe');
  const bin2Src = path.join(ENVTOOLS.THIRDDIR, 'growlnotify', 'growlnotify.com');
  const bin1Dest = path.join(RUNTIME_BIN_DIR, 'growlnotify.exe');
  const bin2Dest = path.join(RUNTIME_BIN_DIR, 'growlnotify.com');

  fs.ensureDir(RUNTIME_BIN_DIR, function (err) {
    if (_isWindows()) {
      // need to drop growlnotify if not there...
      if (!fs.existsSync(bin1Dest) || !fs.existsSync(bin2Dest)) {
        fs.copy(bin1Src, bin1Dest, function () {
          fs.copy(bin2Src, bin2Dest, function () {
            callback();
          });
        });
      } else {
        return callback();
      }
    } else {
      return callback(err);
    }
  });
}

function _chownFolder(folder, options, callback) {
  // resetting some folder permission to current owner
  let verbose = true,
    whoami = process.env.LOGNAME;

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }

  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: Boolean(options.debug)
    }).output;
  }

  if (_.isString(whoami) && fs.existsSync(folder)) {
    whoami = whoami.replace('\n', '');
    cmd.sudo(
      `chown -R ${whoami} ${folder}`,
      {
        name: 'Envtools',
        status: verbose
      },
      function (err, stderr) {
        if (err && stderr) {
          err = stderr;
        }
        callback(err, options);
      }
    );
  } else {
    return callback(null, options);
  }
}

function _installNpmPackages(p, isYarnAvailable, yarnBinary, callback) {
  let cmdline;
  const packages = _.isString(p) ? [p] : p;
  const yarnConfig = config.getKey(config.FEDTOOLSRCKEYS.yarnvsnpm) || 'yarn';

  if (yarnConfig === 'yarn' && isYarnAvailable) {
    cmdline = `${yarnBinary} global add `;
  } else {
    cmdline = 'npm install -g ';
  }

  waterfall(
    [
      function (done) {
        const questions = {
          type: 'list',
          name: 'action',
          message: 'Please choose one of the following options',
          choices: [
            {
              value: TYPE_PREFIX,
              short: 'prefix',
              name:
                'Change the default location for global npm installation (preferable)'
            },
            {
              value: TYPE_CHOWN,
              short: 'chown',
              name:
                'Change ownership of the default destination folder to YOUR user (preferable)'
            },
            {
              value: TYPE_SUDO,
              short: 'sudo',
              name:
                'Install package(s) with sudo to overcome permission issue (not advised)'
            }
          ]
        };
        const destNodeModules = [];

        const rootNodeModules = utilities.getGlobalNodeModulesPath();
        destNodeModules.push(rootNodeModules);
        _.each(packages, function (p) {
          destNodeModules.push(path.join(rootNodeModules, p));
        });
        utilities.isFolderWritable(destNodeModules, function (err) {
          if (err) {
            log.warning('Uhoh, destination folder is not writable...');
            inquirer.prompt(questions).then(function (answers) {
              return done(null, rootNodeModules, packages, answers.action);
            });
          } else {
            return done(null, null, packages, false);
          }
        });
      },
      function (destination, packages, action, done) {
        const actions = _.map(packages, function (pkg) {
          return function (iamdone) {
            const name = pkg.value ? pkg.value : pkg;
            const res = cmd.run(cmdline + name, {
              status: true
            });
            if (res.code !== 0 && res.stderr) {
              log.rainbow(res.stderr);
            }
            iamdone();
          };
        });

        if (action === false) {
          waterfall(actions, done);
        } else if (action === TYPE_SUDO) {
          cmd.sudo(
            cmdline + packages.join(' '),
            {
              name: 'Envtools'
            },
            function (err, stderr) {
              log.debug(stderr);
              if (err) {
                log.error(
                  'Something went wrong or you did not grant admin access...'
                );
              }
              return done(err);
            }
          );
        } else if (action === TYPE_CHOWN) {
          _chownFolder(
            destination,
            {
              debug: false
            },
            function (err) {
              log.debug(err);
              if (err) {
                log.error(
                  'Something went wrong or you did not grant admin access...'
                );
              } else {
                waterfall(actions, done);
              }
            }
          );
        } else if (action === TYPE_PREFIX) {
          cmd.run(
            'npm config set prefix ~/npm',
            {
              status: true
            },
            function (err, stderr) {
              log.debug(err);
              if (err) {
                log.error('Something went wrong...');
                if (stderr) {
                  log.rainbow(stderr);
                } else {
                  log.rainbow(err);
                }
              } else {
                waterfall(actions, done);
              }
            }
          );
        } else {
          return done(USER_INTERRUPT);
        }
      }
    ],
    function (err) {
      callback(err);
    }
  );
}

function defaultSortFn(a, b) {
  return a.localeCompare(b);
}

function _sortObject(src, comparator) {
  let out;

  if (_.isArray(src)) {
    return src.map(function (item) {
      return _sortObject(item, comparator);
    });
  }

  if (_.isObject(src)) {
    out = {};

    Object.keys(src)
      .sort(comparator || defaultSortFn)
      .forEach(function (key) {
        out[key] = _sortObject(src[key], comparator);
      });

    return out;
  }

  return src;
}

function _displayConfirmation(msg, done) {
  const questions = {
    type: 'confirm',
    name: 'goodToGo',
    message: msg,
    default: true
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(!answers.goodToGo);
  });
}

function _displayPromptWithInput(msg, done) {
  const questions = {
    type: 'input',
    name: 'input',
    message: msg,
    validate(val) {
      if (!val) {
        return 'Entry cannot be empty...';
      }
      return true;
    }
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(null, answers.input);
  });
}

function _displayListOfOptions(msg, options, done) {
  const questions = {
    type: 'list',
    name: 'selection',
    message: msg
  };
  questions.choices = options;
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(null, answers.selection);
  });
}

function _getExistingNpmrcProfiles() {
  try {
    // try/catch is not only trapping a missing file, but also
    // an invalid file that could not be JSON parsed correctly
    // win-win!
    return JSON.parse(fs.readFileSync(ENVTOOLS.NPMRC_CONFIG));
  } catch (e) {
    return {
      available: []
    };
  }
}

function _unsetActiveNpmrcProfile() {
  const data = _getExistingNpmrcProfiles();
  if (!_.isEmpty(data) && data.enabled) {
    delete data.enabled;
    fs.writeFileSync(
      ENVTOOLS.NPMRC_CONFIG,
      JSON.stringify(data, null, NB_SPACES_FOR_TAB)
    );
  }
}

function _updateProfileConfigurationData(data, profileName) {
  data.enabled = profileName;
  data.available = _.union(data.available, [profileName]);
  fs.writeFileSync(
    ENVTOOLS.NPMRC_CONFIG,
    JSON.stringify(data, null, NB_SPACES_FOR_TAB)
  );
}

function _createNpmrcProfile(profileName, callback) {
  const profileDir = path.join(ENVTOOLS.NPMRC_PROFILES, profileName);
  const npmProfileConfigFile = path.join(profileDir, NPMRC_PROFILE_FILE);
  const yarnProfileConfigFile = path.join(profileDir, YARNRC_PROFILE_FILE);
  const data = _getExistingNpmrcProfiles();

  callback = callback || NOOP;
  profileName = profileName.trim().toLowerCase();
  waterfall(
    [
      function (done) {
        if (
          !_.isEmpty(data) &&
          data.available &&
          data.available.indexOf(profileName) > -1
        ) {
          log.warning(`\nProfile "${profileName}" already exists...`);
          _displayConfirmation('Do you want to overide it?', done);
        } else {
          return done();
        }
      }
    ],
    function (err) {
      if (!err) {
        _updateProfileConfigurationData(data, profileName);
        fs.ensureDirSync(profileDir);
        fs.copySync(NPM_CONFIG, npmProfileConfigFile);
        fs.copySync(YARN_CONFIG, yarnProfileConfigFile);
        return callback();
      } else {
        return callback(err);
      }
    }
  );
}

function _fuzzySearch(search, data, opts) {
  const options = _.defaults(opts, {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1
  });

  const fuse = new Fuse(data, options);
  const result = fuse.search(search);

  if (
    options.closestMatch &&
    !_.isEmpty(result) &&
    result.length &&
    !_.isEmpty(result[0].matches) &&
    result[0].matches.length
  ) {
    return result[0].matches[0].value;
  } else {
    return result;
  }
}

function _switchToNpmrcProfile(profileName, callback) {
  const data = _getExistingNpmrcProfiles();
  let searchRes;

  callback = callback || NOOP;
  waterfall(
    [
      function (done) {
        if (!_.isEmpty(data)) {
          searchRes = _fuzzySearch(profileName, data.available, {
            closestMatch: true
          });
        }
        if (_.isString(searchRes)) {
          _displayConfirmation(
            `About to switch to profile "${searchRes}", continue?`,
            function () {
              done(null, searchRes);
            }
          );
        } else {
          log.warning(`\nProfile "${profileName}" does not exists...`);
          return done(-1);
        }
      }
    ],
    function (err, name) {
      if (!err) {
        const profileDir = path.join(ENVTOOLS.NPMRC_PROFILES, name);
        const npmProfileConfigFile = path.join(profileDir, NPMRC_PROFILE_FILE);
        const yarnProfileConfigFile = path.join(
          profileDir,
          YARNRC_PROFILE_FILE
        );

        _updateProfileConfigurationData(data, name);

        fs.ensureDirSync(profileDir);
        fs.copySync(npmProfileConfigFile, NPM_CONFIG);
        fs.copySync(yarnProfileConfigFile, YARN_CONFIG);
        return callback(err, name);
      } else {
        return callback(err, name);
      }
    }
  );
}

// -- E X P O R T S
exports.NB_SPACES_FOR_TAB = NB_SPACES_FOR_TAB;
exports.DOT_PROFILE = DOT_PROFILE;
exports.DOT_BASH_PROFILE = DOT_BASH_PROFILE;
exports.DOT_ZSH_PROFILE = DOT_ZSH_PROFILE;
exports.TYPE_AUTO = 't_auto';
exports.TYPE_MANUAL = 't_manual';
exports.TYPE_EXTRA = 't_extra';
exports.RUNTIME_DIR = RUNTIME_DIR;
exports.ENVTOOLS = ENVTOOLS;
exports.USER_INTERRUPT = USER_INTERRUPT;
exports.USER_WARNING = USER_WARNING;
exports.USER_FATAL = USER_FATAL;
exports.USER_IGNORE = USER_IGNORE;
exports.CUSTOM_PROMPT_DEFAULT = 1;
exports.CUSTOM_PROMPT_WITH_SINOPIA = 2;
exports.CUSTOM_PROMPT_WITH_SINOPIA_AND_NODE = 3;
exports.CUSTOM_PROMPT_WITH_NODE = 4;
exports.LOG_COLORS = {
  SUCCESS: 'green',
  FAILURE: 'red',
  WARNING: 'yellow',
  DEFAULT_BOX: 'cyan',
  focusBg: chalk.bgYellow.black,
  gray: chalk.gray,
  blue: chalk.blue,
  reset: chalk.reset
};

exports.ON = ON;
exports.OFF = OFF;
exports.NA = NA;

exports.isWindows = _isWindows;
exports.isMac = _isMac;
exports.isLinux = _isLinux;
exports.isZsh = _isZsh;
exports.createRuntimeDir = _createRuntimeDir;
exports.chownFolder = _chownFolder;
exports.installNpmPackages = _installNpmPackages;
exports.sortObject = _sortObject;
exports.displayConfirmation = _displayConfirmation;
exports.displayPromptWithInput = _displayPromptWithInput;
exports.displayListOfOptions = _displayListOfOptions;
exports.getExistingNpmrcProfiles = _getExistingNpmrcProfiles;
exports.unsetActiveNpmrcProfile = _unsetActiveNpmrcProfile;
exports.updateProfileConfigurationData = _updateProfileConfigurationData;
exports.createNpmrcProfile = _createNpmrcProfile;
exports.switchToNpmrcProfile = _switchToNpmrcProfile;
