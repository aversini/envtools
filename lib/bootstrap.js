/*jshint maxlen: false */

var
  _ = require('underscore'),
  path = require('path'),
  glob = require('glob'),
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  Download = require('download'),
  rimraf = require('rimraf'),
  url = require('url'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  backup = require('./backup').backup,
  needToCheckForMaven = true,

  USER_INTERRUPT = -1,
  USER_WARNING = -2,
  USER_FATAL = -3,
  USER_IGNORE = -4,

  TYPE_AUTO = 't_auto',
  TYPE_MANUAL = 't_manual',
  TYPE_EXTRA = 't_extra',

  RUNTIME_DIR = path.join(process.env.HOME, '.envtools'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
    DOT_ESLINT_CFG: path.join(process.env.HOME, '.eslintrc'),
    DOT_JSBEAUTIFY_CFG: path.join(process.env.HOME, '.jsbeautifyrc'),
    DOT_GIT_CONFIG: path.join(process.env.HOME, '.gitconfig'),
    NPM_CONFIG: path.join(process.env.HOME, '.npmrc'),
    DOT_PROFILE: path.join(process.env.HOME, '.profile'),
    PROXY_FILE: path.join(RUNTIME_DIR, 'proxy'),
    PROXY_STATUS_FILE: path.join(RUNTIME_DIR, 'proxy_status'),
    RESUME_AUTO: path.join(RUNTIME_DIR, 'resume_auto')
  },

  MAVEN_BIN_URL = 'http://archive.apache.org/dist/maven/maven-3/3.2.5/binaries/apache-maven-3.2.5-bin.zip',
  MAVEN_DEST_DIR = path.join(RUNTIME_DIR, 'apache-maven-3.2.5'),
  // Maven 3.3.9 is not compatible with the framework for now... Ticket has been opened: PN-13533
  // MAVEN_BIN_URL = 'http://apachemirror.ovidiudan.com/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.zip',

  HUSHLOGIN = path.join(process.env.HOME, '.hushlogin'),

  DOT_PROFILE_COMMENT = '### Added by Envtools',

  REQUEST_ATOM = 'r_atom',
  REQUEST_SCREENSAVER = 'r_screensaver',
  REQUEST_QUICKLOOK = 'r_quicklook',
  REQUEST_APP_STORE = 'r_appstore',
  REQUEST_POWER_CHIME = 'r_powerchime',

  REQUEST_JSBEAUTIFY_CFG = 'r_jsbeautifyrc',
  REQUEST_ESLINT_CFG = 'r_eslintrc',
  REQUEST_PROMPT = 'r_prompt',
  REQUEST_BANNER = 'r_banner',
  REQUEST_FEDTOOLS = 'r_fedtools',
  REQUEST_USR_LOCAL = 'r_usr_local',
  REQUEST_MAVEN = 'r_maven',
  REQUEST_RUBY = 'r_ruby',
  REQUEST_HOMEBREW = 'r_brew',
  REQUEST_ENV = 'r_env',
  REQUEST_PROXY = 'r_proxy',
  REQUEST_CHECK_APPS = 'r_check_apps',
  REQUEST_GIT_CFG = 'r_git',
  REQUEST_NODE_NPM = 'r_node_npm',

  ATOM_PACKAGES = [
    'atom-beautify',
    'atomatigit',
    'autoclose-html',
    'docblockr',
    'highlight-line',
    'language-soy',
    'linter',
    'linter-eslint',
    'merge-conflicts',
    'minimap',
    'pane-manager',
    'Sublime-Style-Column-Selection'
  ],
  NPM_PACKAGES = [
    'grunt',
    'grunt-cli',
    'phantomjs',
    'selleck',
    'shifter',
    'svgo',
    'yeti',
    'yogi',
    'yuidocjs'
  ];

exports.USER_FATAL = USER_FATAL;
exports.USER_WARNING = USER_WARNING;
exports.USER_INTERRUPT = USER_INTERRUPT;
exports.USER_IGNORE = USER_IGNORE;


// -- P R I V A T E  M E T H O D S

function _createRuntimeDir(callback) {
  if (!fs.exists(RUNTIME_DIR)) {
    fs.mkdirs(RUNTIME_DIR, function (err) {
      callback(err);
    });
  }
}

function _bootstrapPrompt(options, callback) {
  var
    envtoolsPrompt = path.join(RUNTIME_DIR, 'envtools-prompt'),
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'Do you want to enable a nicer prompt?',
      default: true
    }];

  function _enableEnvtoolsPrompt(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag) {
          fs.writeFile(envtoolsPrompt, 'true', goodToGo);
        } else {
          rimraf(envtoolsPrompt, {}, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsPrompt(true, callback);
  } else {
    inquirer.prompt(questions, function (answers) {
      _enableEnvtoolsPrompt(answers.change, callback);
    });
  }
}

function _bootstrapBanner(options, callback) {
  var
    envtoolsBanner = path.join(RUNTIME_DIR, 'envtools-banner'),
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'Do you want to add a welcome banner to all sessions?',
      default: true
    }];

  function _enableEnvtoolsBanner(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag) {
          fs.writeFile(envtoolsBanner, 'true', goodToGo);
        } else {
          rimraf(envtoolsBanner, {}, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsBanner(true, callback);
  } else {
    inquirer.prompt(questions, function (answers) {
      _enableEnvtoolsBanner(answers.change, callback);
    });
  }
}

function _fixUsrLocal(options, callback) {
  // resetting /usr/local permission to current owner
  var
    verbose = true,
    whoami = process.env.LOGNAME;

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }

  function _chownUsrLocal(done) {
    cmd.run('sudo chown -R ' + whoami + ' /usr/local', {
      status: verbose
    }, function (err, stderr) {
      if (err && stderr) {
        log.echo(stderr);
      }
      done(err, options);
    });
  }

  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: (options.debug) ? true : false
    }).output;
  }

  if (whoami && fs.existsSync('/usr/local')) {
    whoami = whoami.replace('\n', '');
    if (options.auto) {
      _chownUsrLocal(callback);
    } else {
      utilities.forceAdminAccess(true, function () {
        _chownUsrLocal(callback);
      });
    }
  } else {
    callback(null, options);
  }
}

function _bootstrapEnv(options, callback) {
  var
    questions;

  // in auto mode, no setting env if it's already set!
  if (options.auto && process.env.ENVTOOLS_VERSION) {
    return callback(null, options);
  }

  function _writeDotProfile(res, done) {
    var msg;
    res.push(DOT_PROFILE_COMMENT);
    res.push('source ' + path.join(__dirname, '..', 'shell', 'load.sh'));
    fs.writeFile(ENVTOOLS.DOT_PROFILE, res.join('\n'), function (err) {
      if (!err) {
        msg = 'Done! Envtools will load at each session.';
      } else {
        log.error('Unable to update your profile...');
        log.echo(err);
      }
      // also remove the useless "last login info" shown
      // at each session startup to speed things up.
      fs.writeFile(HUSHLOGIN, '', function () {
        if (msg) {
          options.msg = msg;
        }
        done(null, options);
      });
    });
  }

  function _parseDotProfile(done) {
    var p, d, res = [];
    if (!fs.existsSync(ENVTOOLS.DOT_PROFILE)) {
      _writeDotProfile(res, done);
    } else {
      backup(ENVTOOLS.DOT_PROFILE);
      p = fs.readFileSync(ENVTOOLS.DOT_PROFILE, 'utf8');
      d = p.split('\n');
      res = _.filter(d, function (line) {
        if (line.match(DOT_PROFILE_COMMENT) ||
          line.match('/envtools/shell/load.sh')) {
          return false;
        } else {
          return true;
        }
      });
      _writeDotProfile(res, done);
    }
  }

  questions = [{
    type: 'confirm',
    name: 'change',
    message: 'About to update .profile... Continue?',
    default: true
  }];
  inquirer.prompt(questions, function (answers) {
    if (answers.change) {
      return _parseDotProfile(callback);
    } else {
      if (options.auto) {
        return callback(null, options);
      }
      callback(USER_INTERRUPT, options);
    }
  });
}

function _bootstrapProxy(options, callback) {
  var
    msg = [],
    proxy = '',
    questions;

  // in auto mode, no setting proxy if it's already set!
  if (options.auto && fs.existsSync(ENVTOOLS.PROXY_FILE)) {
    return callback(null, options);
  }

  function _setProxy(proxy, done) {
    var
      questions = {
        type: 'input',
        name: 'proxy',
        message: 'Enter proxy',
        validate: function (val) {
          var parsed;
          if (!val) {
            return 'Proxy cannot be empty...';
          }
          parsed = url.parse(val);
          if (!parsed.protocol || !parsed.hostname ||
            (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
            parsed.hostname.match(/\./) === null) {
            return 'Invalid proxy';
          }
          if (val.match('http://') || val.match('https://')) {
            return true;
          } else {
            return 'Invalid proxy, protocol is required (http or https)...';
          }
        }
      };
    if (proxy) {
      questions.default = proxy;
      questions.message = questions.message + ' or press ENTER for default';
    }
    inquirer.prompt(questions, function (answers) {
      if (answers.proxy) {
        fs.writeFileSync(ENVTOOLS.PROXY_FILE, answers.proxy);
        log.echo();
        msg.push('To take your proxy into account, you need to restart your session.');
        if (process.env.ENVTOOLS_VERSION) {
          msg.push('');
          msg.push(log.strToColor('cyan', 'Hint #1:') + ' type r ENTER or just restart your terminal...');
          msg.push(log.strToColor('cyan', 'Hint #2:') + ' type pon ENTER to turn the proxy ON.');
          msg.push(log.strToColor('cyan', 'Hint #3:') + ' type poff ENTER to turn the proxy OFF.');
        }
        fs.writeFileSync(ENVTOOLS.RESUME_AUTO, '');
        options.msg = msg;
        return done(USER_WARNING, options);
      } else {
        if (options.auto) {
          return done(null, options);
        }
        return done(USER_INTERRUPT, options);
      }
    });
  }

  async.waterfall([
    function (done) {
      questions = [{
        type: 'confirm',
        name: 'goForIt',
        message: 'Do you need to setup a proxy?',
        default: true
      }];
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      if (fs.existsSync(ENVTOOLS.PROXY_FILE)) {
        proxy = fs.readFileSync(ENVTOOLS.PROXY_FILE, 'utf8');
        if (proxy && proxy !== '') {
          questions = [{
            type: 'confirm',
            name: 'change',
            message: 'Proxy already set... Do you want to change it?',
            default: false
          }];
        }
        inquirer.prompt(questions, function (answers) {
          if (answers.change) {
            _setProxy(proxy, done);
          } else {
            done(USER_INTERRUPT);
          }
        });
      } else {
        _createRuntimeDir(function () {
          _setProxy(null, done);
        });
      }
    }
  ], function (err, data) {
    if (err && err === USER_WARNING && data && data.msg) {
      log.printMessagesInBox(data.msg);
    }
    if (options.auto && err === USER_INTERRUPT) {
      err = null;
    }
    callback(err, options);
  });
}

function _checkForCoreApps(options, callback) {
  var res = utilities.isAppInstalled([{
    'name': 'shifter',
    'error': options.i18n.t('bootstrap.errors.shifter')
  }, {
    'name': 'java',
    'error': options.i18n.t('bootstrap.errors.java')
  }, {
    'name': 'git',
    'error': options.i18n.t('bootstrap.errors.git')
  }, {
    'name': 'ruby',
    'error': options.i18n.t('bootstrap.errors.ruby')
  }]);
  if (!res) {
    callback(1, options);
  } else {
    callback(null, options);
  }
}

function _checkForApps(options, callback) {
  _checkForCoreApps(options, function (err) {
    var
      apps = [{
        'name': 'selleck',
        'error': options.i18n.t('bootstrap.errors.selleck')
      }, {
        'name': 'yuidoc',
        'error': options.i18n.t('bootstrap.errors.yuidoc')
      }, {
        'name': 'fedtools',
        'error': options.i18n.t('bootstrap.errors.fedtools')
      }, {
        'name': 'yogi',
        'error': options.i18n.t('bootstrap.errors.yogi')
      }, {
        'name': 'phantomjs',
        'error': options.i18n.t('bootstrap.errors.phantomjs')
      }],
      res;

    if (needToCheckForMaven) {
      apps.push({
        'name': 'mvn',
        'error': options.i18n.t('bootstrap.errors.mvn')
      });
    }
    res = utilities.isAppInstalled(apps);
    if (!res || err) {
      log.warning('Some applications needed for WF-RIA² could not be found...');
    }
    if (!err && res && !options.auto) {
      log.success('All applications required for WF-RIA² have been found!');
    }
    callback(null, options);
  });
}

function _bootstrapEslintConfiguration(options, callback) {
  if (fs.existsSync(ENVTOOLS.DOT_ESLINT_CFG)) {
    backup(ENVTOOLS.DOT_ESLINT_CFG);
  }
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install ESLint configuration, continue?',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      var
        srcFile = path.join(ENVTOOLS.THIRDDIR, 'eslint', 'dot.eslintrc'),
        cmdline = 'cp -f ' + srcFile + ' ' + ENVTOOLS.DOT_ESLINT_CFG;
      cmd.run(cmdline, {
        status: false
      }, function (err) {
        done(err);
      });
    }
  ], function (err) {
    callback(err, options);
  });
}

function _bootstrapJsBeautifyConfiguration(options, callback) {
  if (fs.existsSync(ENVTOOLS.DOT_JSBEAUTIFY_CFG)) {
    backup(ENVTOOLS.DOT_JSBEAUTIFY_CFG);
  }
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install jsBeautify configuration, continue?',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      var
        srcFile = path.join(ENVTOOLS.THIRDDIR,
          'beautify', 'dot.jsbeautifyrc'),
        cmdline = 'cp -f ' + srcFile + ' ' + ENVTOOLS.DOT_JSBEAUTIFY_CFG;
      cmd.run(cmdline, {
        status: false
      }, function (err) {
        done(err);
      });
    }
  ], function (err) {
    callback(err, options);
  });
}

function _bootstrapGitConfiguration(options, callback) {
  if (fs.existsSync(ENVTOOLS.DOT_PROFILE)) {
    backup(ENVTOOLS.DOT_GIT_CONFIG);

    async.waterfall([
        function (done) {
          var
            questions = {
              type: 'confirm',
              name: 'goForIt',
              message: 'About to update git configuration, continue?',
              default: true
            };
          if (options.auto) {
            inquirer.prompt(questions, function (answers) {
              if (answers.goForIt) {
                done();
              } else {
                done(USER_INTERRUPT);
              }
            });
          } else {
            done();
          }
        },
        function (done) {
          var
            git,
            cmdline,
            confirmAdmin = (options.auto) ? false : true,
            gitkeychain;

          if (process.platform === 'darwin') {
            git = cmd.run('which git', {
              status: false
            }).output;
            gitkeychain = path.join(ENVTOOLS.THIRDDIR, 'git', 'git-credential-osxkeychain');
            if (git) {
              if (fs.existsSync(path.join(path.dirname(git), 'git-credential-osxkeychain'))) {
                done(null, 1);
              } else {
                utilities.forceAdminAccess(confirmAdmin, function () {
                  cmdline = 'sudo -E cp -f ' + gitkeychain + ' ' + path.dirname(git) + '/';
                  cmd.run(cmdline, {
                    status: false
                  }, function () {
                    done(null, 1);
                  });
                });
              }
            } else {
              done(null, 0);
            }
          } else {
            done(null, 0);
          }
        },
        function (keychain, done) {
          var
            fullname,
            questions = {
              type: 'input',
              name: 'fullname',
              message: 'Enter your full name',
              validate: function (val) {
                if (!val) {
                  return 'Your full name cannot be empty...';
                } else {
                  return true;
                }
              }
            };

          fullname = cmd.run('git config --global --get user.name', {
            status: false
          }).output;
          if (fullname) {
            questions.default = fullname.replace('\n', '');
            questions.message = questions.message + ' or press ENTER for default';
          }

          inquirer.prompt(questions, function (answers) {
            if (answers.fullname) {
              done(null, keychain, answers.fullname);
            } else {
              done(USER_INTERRUPT);
            }
          });
        },
        function (keychain, fullName, done) {
          var
            email,
            questions = {
              type: 'input',
              name: 'email',
              message: 'Enter your email address',
              validate: function (val) {
                if (!val) {
                  return 'Your email address cannot be empty...';
                } else {
                  return true;
                }
              }
            };

          email = cmd.run('git config --global --get user.email', {
            status: false
          }).output;
          if (email) {
            questions.default = email.replace('\n', '');
            questions.message = questions.message + ' or press ENTER for default';
          }

          inquirer.prompt(questions, function (answers) {
            if (answers.email) {
              done(null, keychain, fullName, answers.email);
            } else {
              done(USER_INTERRUPT);
            }
          });
        },
        function (keychain, fullName, email, done) {
          var
            questions = [{
              type: 'input',
              name: 'github',
              message: 'If you have one, enter your github username',
            }];

          inquirer.prompt(questions, function (answers) {
            done(null, keychain, fullName, email, answers.github);
          });
        }
      ],
      function (err, keychain, fullName, email, github) {
        if (!err) {
          var cmdline = [
            'git config --global user.name "' + fullName + '"',
            'git config --global user.email ' + email,
            'git config --global color.diff auto',
            'git config --global color.status auto',
            'git config --global color.ui auto',
            'git config --global url."https://github.com/".insteadOf "git://github.com/"',
            'git config --global alias.st status',
            'git config --global alias.d diff',
            'git config --global alias.br branch',
            'git config --global alias.ci commit',
            'git config --global alias.co checkout',
            'git config --global diff.tool opendiff',
            'git config --global merge.tool opendiff'
          ];

          if (github) {
            cmdline.push('git config --global github.user ' + github);
          }
          if (keychain) {
            cmdline.push('git config --global credential.helper osxkeychain');
          }

          cmd.run(cmdline, {
            status: (options.auto) ? false : true
          });
          cmdline = [];
          if (process.env.ALL_PROXY) {
            cmdline.push('git config --global http.proxy ' + process.env.ALL_PROXY);
            cmdline.push('git config --global https.proxy ' + process.env.ALL_PROXY);
          } else {
            cmdline.push('git config --global --remove-section http');
            cmdline.push('git config --global --remove-section https');
          }
          cmd.run(cmdline, {
            status: (options.auto) ? false : true
          });
          callback(null, options);
        } else {
          if (options.auto && err === USER_INTERRUPT) {
            err = null;
          }
          callback(err, options);
        }
      });
  } else {
    callback(null, options);
  }
}

function _bootstrapNodeAndNpm(options, callback) {
  backup(ENVTOOLS.NPM_CONFIG);
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to update npm configuration, continue?',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done(null, 1);
        } else {
          done(null, 0);
        }
      });
    },
    function (goForIt, done) {
      if (goForIt) {
        var
          cmdline = 'npm config set registry=http://registry.npmjs.org/';
        cmd.run(cmdline, {
          status: (options.auto) ? false : true
        }, function () {
          cmdline = 'npm config set progress false';
          cmd.run(cmdline, {
            status: (options.auto) ? false : true
          }, function () {
            done();
          });
        });
      } else {
        done();
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install core node packages, continue?',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done(null, 1);
        } else {
          done(null, 0);
        }
      });
    },
    function (goForIt, done) {
      // forcing sudo on other than Mac
      if (process.platform === 'darwin') {
        done(null, goForIt, false);
      } else {
        done(null, goForIt, true);
      }
    },
    function (goForIt, sudo, done) {
      if (goForIt) {
        if (sudo && !options.auto) {
          utilities.forceAdminAccess(true, function () {
            done(null, sudo);
          });
        } else {
          done(null, sudo);
        }
      } else {
        done(USER_INTERRUPT);
      }
    },
    function (sudo, done) {
      var
        sudoCmd = (sudo) ? 'sudo -E ' : '',

        cmdline = _.map(NPM_PACKAGES, function (pkg) {
          return sudoCmd + 'npm install -g ' + pkg;
        });
      cmd.run(cmdline, {
        status: true
      }); // no async for array of commands
      done();
    }
  ], function (err) {
    if (options.auto && err === USER_INTERRUPT) {
      err = null;
    }
    callback(err, options);
  });
}

function _bootstrapHomebrew(options, callback) {
  var
    brewAlreadyInstalled = false;

  if (process.platform !== 'darwin') {
    log.warning('Homebrew can only be installed on Mac.');
    if (options.auto) {
      return callback(null, options);
    }
    callback(-3, options);
  } else {
    async.waterfall([
        function (done) {
          var
            brew = cmd.run('which brew', {
              status: false
            }).output;
          if (brew) {
            brewAlreadyInstalled = true;
          }
          done();
        },
        function (done) {
          var
            questions = {
              type: 'confirm',
              name: 'goForIt',
              default: true
            };
          if (brewAlreadyInstalled) {
            questions.message = 'About to update Homebrew, continue?';
          } else {
            questions.message = 'About to install Homebrew, continue?';
          }
          inquirer.prompt(questions, function (answers) {
            if (answers.goForIt) {
              done(null, 1);
            } else {
              done(null, 0);
            }
          });
        },
        function (goForIt, done) {
          if (goForIt) {
            _fixUsrLocal(options, function () {
              done(null, goForIt);
            });
          } else {
            done(null, goForIt);
          }
        },
        function (goForIt, done) {
          var
            destFolder = path.join(RUNTIME_DIR, 'homebrew'),
            url = 'https://github.com/Homebrew/homebrew/tarball/master';

          if (goForIt) {
            if (brewAlreadyInstalled) {
              cmd.run('brew update', {
                status: (options.auto) ? false : true
              }, function (err, stderr) {
                if (err && stderr) {
                  log.echo(stderr);
                }
                done(err);
              });
            } else {
              new Download({
                  mode: '755',
                  extract: true,
                  strip: true
                })
                .get(url)
                .dest(destFolder)
                .run(function (err) {
                  if (err) {
                    log.error('Unable to download Homebrew...');
                    done(err);
                  } else {
                    fs.copy(destFolder, '/usr/local', function (err) {
                      if (err) {
                        log.error('Unable to install Homebrew...');
                      }
                      done(err);
                    });
                  }
                });
            }
          } else {
            done();
          }
        },
        function (done) {
          fs.writeFile(path.join(process.env.HOME, '.gemrc'), 'gem: -n/usr/local/bin', {
            flag: 'w'
          }, done);
        }
      ],
      function (err) {
        callback(err, options);
      });
  }
}

function _bootstrapRuby(options, callback) {
  var
    ruby,
    brew,
    compass,
    gem;

  function _installRuby(done) {
    if (process.platform === 'darwin') {
      if (brew) {
        cmd.run('brew install ruby', {
          status: (options.auto) ? false : true
        }, done);
      } else {
        _bootstrapHomebrew(options, function (err) {
          if (!err) {
            cmd.run('brew install ruby', {
              status: (options.auto) ? false : true
            }, done);
          }
        });
      }
    } else {
      log.notice('Cannot find Ruby (ruby), please install it manually.');
      done(USER_INTERRUPT);
    }
  }

  function _installCompass(done) {
    var
      cmdline;

    if (gem) {
      if (process.platform === 'darwin') {
        cmdline = 'gem install --no-ri --no-rdoc compass --install-dir /usr/local/gems';
      } else {
        cmdline = 'sudo -E gem install --no-ri --no-rdoc compass';
      }
      cmd.run(cmdline, {
        status: (options.auto) ? false : true
      }, done);
    } else {
      log.notice('Cannot find Rubygems (gem), please install it manually.');
      done(USER_INTERRUPT);
    }
  }

  function _isRubyVersionOk(done) {
    var res = cmd.run('ruby -v', {
        status: false
      }).output,
      version = res.split(' ')[1].slice(0, 5).split('.'),
      major = Number(version[0]),
      minor = Number(version[1]);

    if (major > 1 ||
      (major <= 1 && minor > 8)) {
      done();
    } else {
      done(1);
    }
  }

  function _isCompassVersionOk(done) {
    var res = cmd.run('compass -v', {
        status: false
      }).output,
      major = Number(res.split(' ')[1].charAt(0));

    if (major >= 1) {
      done();
    } else {
      done(1);
    }
  }

  async.waterfall([
    function (done) {
      var
        questions = {
          message: 'About to install/update Ruby and Compass, continue?',
          type: 'confirm',
          name: 'goForIt',
          default: true
        };

      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      ruby = cmd.run('which ruby', {
        status: false
      }).output;
      brew = cmd.run('which brew', {
        status: false
      }).output;
      compass = cmd.run('which compass', {
        status: false
      }).output;
      gem = cmd.run('which gem', {
        status: false
      }).output;
      done();
    },
    function (done) {
      if (ruby) {
        _isRubyVersionOk(function (err) {
          if (err) {
            _installRuby(done);
          } else {
            done();
          }
        });
      } else {
        _installRuby(done);
      }
    },
    function (done) {
      if (compass) {
        _isCompassVersionOk(function (err) {
          if (err) {
            _installCompass(done);
          } else {
            done();
          }
        });
      } else {
        _installCompass(done);
      }
    }
  ], function (err) {
    if (options.auto && err === USER_INTERRUPT) {
      err = null;
    }
    callback(err, options);
  });
}

function _bootstrapMaven(options, callback) {
  var
    m2SettingsDest = path.join(process.env.HOME, '.m2', 'settings.xml'),
    resultingFolder,
    url = MAVEN_BIN_URL;

  function _displayMavenRestartInfo(line) {
    var msg = [];
    if (line) {
      msg.push(line);
    }
    msg.push('Before using Maven, you need to restart your session.');
    if (process.env.ENVTOOLS_VERSION) {
      msg.push('');
      msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
    }
    log.printMessagesInBox(msg);
  }

  function _installM2Settings(done) {
    var
      m2SettingsOrig = path.join(ENVTOOLS.THIRDDIR, 'wfria2', 'settings.xml'),
      cmdline = 'cp -f ' + m2SettingsOrig + ' ' + m2SettingsDest;
    cmd.run(cmdline, {
      status: false
    }, function (err, stderr) {
      if (err && stderr) {
        log.echo(stderr);
      }
      done(err);
    });
  }

  async.waterfall([
    function (done) {
      if (!process.env.RUNTIME_DIR) {
        process.env.RUNTIME_DIR = path.join(process.env.HOME, '.envtools');
      }
      _createRuntimeDir(done);
    },
    function (done) {
      if (fs.existsSync(m2SettingsDest)) {
        var questions = [{
          type: 'confirm',
          name: 'change',
          message: 'Maven settings.xml exists... Do you want to replace it?',
          default: false
        }];
        inquirer.prompt(questions, function (answers) {
          if (answers.change) {
            _installM2Settings(done);
          } else {
            done();
          }
        });
      } else {
        utilities.mkdirp.sync(path.join(process.env.HOME, '.m2'));
        _installM2Settings(done);
      }
    },
    function (done) {
      resultingFolder = MAVEN_DEST_DIR;
      if (!fs.existsSync(resultingFolder)) {
        // need to download maven
        done();
      } else {
        if (!options.auto) {
          _displayMavenRestartInfo('Maven is already installed...');
        }
        done(USER_IGNORE);
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          message: 'About to install Maven, continue?',
          name: 'goForIt',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    },
    function (goForIt, done) {
      if (goForIt) {
        new Download({
            mode: '755',
            extract: true
          })
          .get(url)
          .dest(RUNTIME_DIR)
          .run(function (err) {
            if (err) {
              log.error('Unable to download Maven...');
              log.echo(err);
            }
            done(err);
          });
      } else {
        done(USER_INTERRUPT);
      }
    },
    function (done) {
      needToCheckForMaven = false;
      if (!options.auto) {
        _displayMavenRestartInfo();
      }
      done();
    }
  ], function (err) {
    if (err && (err === USER_INTERRUPT || err === USER_IGNORE)) {
      err = null;
    }
    callback(err, options);
  });
}

function _installFedtools(options, callback) {
  var
    sudo = '',
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'About to install fedtools... Continue?',
      default: true
    }];
  if (process.platform !== 'darwin') {
    sudo = 'sudo -E';
  }
  inquirer.prompt(questions, function (answers) {
    if (answers.change) {
      cmd.run(sudo + ' npm install -g fedtools', {
        status: (options.auto) ? false : true
      }, function (err, stderr) {
        if (err && stderr) {
          log.echo(stderr);
        }
        callback(err, options);
      });
    } else {
      if (options.auto) {
        return callback(null, options);
      }
      callback(USER_INTERRUPT, options);
    }
  });
}

function _installQuickLookPlugins(options, callback) {
  var
    destFolder = path.join(process.env.HOME, 'Library', 'QuickLook'),
    srcFolder = path.join(ENVTOOLS.THIRDDIR, 'quicklook');

  async.waterfall([
    function (done) {
      if (!fs.existsSync(destFolder)) {
        // folder doesn't exist, let's create it
        utilities.mkdirp(destFolder, function (err) {
          done(err);
        });
      } else {
        // folder already exists, need to backup first
        backup(destFolder);
        done();
      }
    },
    function (done) {
      var
        i,
        len;
      glob(srcFolder + '/*.qlgenerator', {}, function (err, plugins) {
        // removing the old ones if any
        // (but only the ones that are going to be re-installed)
        if (!err && plugins) {
          len = plugins.length;
          for (i = 0; i < len; i++) {
            rimraf.sync(path.join(destFolder, path.basename(plugins[i])));
          }
        }
        done(err);
      });
    },
    function (done) {
      // copy new ones instead
      fs.copy(srcFolder, destFolder, done);
    },
    function (done) {
      // tell the system to load the new plugins
      cmd.run('qlmanage -r', {
        status: false
      }, done);
    }
  ], function (err) {
    if (!err) {
      log.success('QuickLook Plugins successfully installed');
    }
    callback(err, options);
  });
}

function _fixScreensaver(options, callback) {
  var
    i,
    len,
    msg = [],
    ssFolder = path.join(process.env.HOME, 'Library',
      'Preferences', 'ByHost');

  async.waterfall([
    function (done) {
      var questions = [{
        type: 'confirm',
        name: 'change',
        message: 'Screensaver configuration files will be cleaned, continue?',
        default: true
      }];
      inquirer.prompt(questions, function (answers) {
        if (answers.change) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      glob(ssFolder + '/com.apple.screensaver*', {
        nosort: true,
        nocase: true
      }, function (err, files) {
        // removing the old screensaver configurations
        if (!err && files) {
          len = files.length;
          for (i = 0; i < len; i++) {
            backup(path.join(ssFolder, path.basename(files[i])));
            rimraf.sync(path.join(ssFolder, path.basename(files[i])));
          }
        }
        msg.push('Screensaver configuration files have been cleared.');
        msg.push('Please logout or restart before accessing the\nscreensaver configuration panel again.');
        log.printMessagesInBox(msg);
        done();
      });
    }
  ], function (err) {
    callback(err, options);
  });
}

function _bootstrapAtom(options, callback) {
  async.waterfall([
    function (done) {
      // need to check for apm package manager first...
      var res = utilities.isAppInstalled({
        name: 'apm',
        error: 'Atom package manager is not installed on this machine...'
      });
      if (res === true) {
        done()
      } else {
        done(USER_FATAL);
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install core Atom packages, continue?',
          default: true
        };
      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(USER_INTERRUPT);
        }
      });
    },
    function (done) {
      // need to run each commands in waterfall,
      // so extracting all fct and putting them into
      // an array (for async.waterfall)
      var res = _.map(ATOM_PACKAGES, function (item) {
        return function (goodToGo) {
          cmd.run('apm install ' + item, {
            status: true
          }, function (err) {
            goodToGo(err);
          });
        }
      });
      // and finally running the show
      async.waterfall(res, function (err) {
        if (!err) {
          log.echo();
          log.printMessagesInBox(['Restart Atom to take the changes into effects.']);
          err = USER_IGNORE;
        }
        done(err);
      });
    },
  ], function (err) {
    callback(err, options);
  });
}

function _fixAppStore(options, callback) {
  var
    msg = [];

  msg.push('1) Close the App Store.');
  msg.push('2) Open Keychain Access.');
  msg.push('3) Open Preferences.');
  msg.push('4) Go to "Certificates".');
  msg.push('5) Switch "Certificate Revocation List" to "Off".');
  msg.push('6) Close Keychain Access.');
  msg.push('7) Enjoy a faster App Store.');


  log.printMessagesInBox(msg);
  callback(USER_IGNORE, options);
}

function _togglePowerChimeSound(options, callback) {
  var
    cmdON = [
      'defaults write com.apple.PowerChime ChimeOnAllHardware -bool true',
      'open /System/Library/CoreServices/PowerChime.app'
    ],
    cmdOFF = [
      'defaults write com.apple.PowerChime ChimeOnAllHardware -bool false',
      'killall PowerChime'
    ],

    questions = {
      type: 'confirm',
      name: 'change',
      message: 'Play a power charging sound effect when plugged in?',
      default: true
    };

  function _toggle(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag) {
          cmd.run(cmdON, {
            status: true
          }); // array of commands, not async
        } else {
          cmd.run(cmdOFF, {
            status: true
          }); // array of commands, not async
        }
        goodToGo();
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _toggle(true, function () {
      return callback(USER_IGNORE, options);
    });
  } else {
    inquirer.prompt(questions, function (answers) {
      _toggle(answers.change, function () {
        return callback(USER_IGNORE, options);
      });
    });
  }
}

// -- R O U T I N G  P R O C E D U R E S
function _buildOptions(options, callback) {
  var
    choices = {};

  choices[TYPE_MANUAL] = [];
  choices[TYPE_AUTO] = [];
  choices[TYPE_EXTRA] = [];

  function _addChoice(choice) {
    var
      platform = choice.restrictOs || [process.platform];
    _.each(choice.type, function (type) {
      if (platform.indexOf(process.platform) >= 0) {
        choices[type].push(choice);
      }
    });
  }

  _addChoice({
    name: options.i18n.t('bootstrap.setPrompt'),
    value: REQUEST_PROMPT,
    type: [TYPE_EXTRA, TYPE_AUTO],
    fct: _bootstrapPrompt
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setBanner'),
    value: REQUEST_BANNER,
    type: [TYPE_EXTRA, TYPE_AUTO],
    fct: _bootstrapBanner
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setEnv'),
    value: REQUEST_ENV,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapEnv
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setUsrLocal'),
    value: REQUEST_USR_LOCAL,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _fixUsrLocal
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setProxy'),
    value: REQUEST_PROXY,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapProxy
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setEslintConfig'),
    value: REQUEST_ESLINT_CFG,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapEslintConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setJsBeautifyConfig'),
    value: REQUEST_JSBEAUTIFY_CFG,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapJsBeautifyConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setGitCfg'),
    value: REQUEST_GIT_CFG,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapGitConfiguration
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setNPM'),
    value: REQUEST_NODE_NPM,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapNodeAndNpm
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setMaven'),
    value: REQUEST_MAVEN,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapMaven
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setBrew'),
    value: REQUEST_HOMEBREW,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapHomebrew,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setRuby'),
    value: REQUEST_RUBY,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _bootstrapRuby,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.installFedtools'),
    value: REQUEST_FEDTOOLS,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _installFedtools
  });
  _addChoice({
    name: options.i18n.t('bootstrap.checkApps'),
    value: REQUEST_CHECK_APPS,
    type: [TYPE_AUTO, TYPE_MANUAL],
    fct: _checkForApps
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setQuicklook'),
    value: REQUEST_QUICKLOOK,
    type: [TYPE_EXTRA],
    fct: _installQuickLookPlugins,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.fixScreensaver'),
    value: REQUEST_SCREENSAVER,
    type: [TYPE_EXTRA],
    fct: _fixScreensaver,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setAtom'),
    value: REQUEST_ATOM,
    type: [TYPE_EXTRA],
    fct: _bootstrapAtom
  });
  _addChoice({
    name: options.i18n.t('bootstrap.fixAppStore'),
    value: REQUEST_APP_STORE,
    type: [TYPE_EXTRA],
    fct: _fixAppStore,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.enablePowerChime'),
    value: REQUEST_POWER_CHIME,
    type: [TYPE_EXTRA],
    fct: _togglePowerChimeSound,
    restrictOs: ['darwin']
  });

  callback(null, choices);
}

function _displayOptions(type, choices, options, callback) {
  var
    introMsg = {},
    questions;

  introMsg[TYPE_AUTO] = [
    options.i18n.t('bootstrap.intro.auto'),
    options.i18n.t('bootstrap.intro.getOutAdvice1')
  ];
  introMsg[TYPE_MANUAL] = [
    options.i18n.t('bootstrap.intro.manual'),
    options.i18n.t('bootstrap.intro.getOutAdvice2')
  ];
  introMsg[TYPE_EXTRA] = [
    options.i18n.t('bootstrap.intro.extra'),
    options.i18n.t('bootstrap.intro.getOutAdvice3')
  ];

  log.resetConsole();
  log.echo();
  log.printMessagesInBox(introMsg[type]);
  log.echo();

  if (type === TYPE_AUTO) {
    // we are in auto mode, we need less confirmations
    options.auto = true;
    // we also need to cleanup the resume_auto file if any
    rimraf.sync(ENVTOOLS.RESUME_AUTO);
    // need to run each commands in waterfall,
    // so extracting all fct and putting them into
    // an array (for async.waterfall)
    var res = _.map(choices[TYPE_AUTO], function (item) {
      return item.fct;
    });
    // Creating the first function for waterfall
    function _entryPoint(done) {
      utilities.forceAdminAccess(true, function (err) {
        return done(err, options);
      });
    }
    // adding it on top of the list
    res.unshift(_entryPoint);
    // and finally running the show
    async.waterfall(res, function (err) {
      callback(err);
    });
  } else {
    choices[type].unshift(new inquirer.Separator(''));
    questions = [{
      pageSize: choices[type].length + 1,
      type: 'list',
      name: 'command',
      message: options.i18n.t('bootstrap.intro.msg1'),
      choices: choices[type]
    }];
    inquirer.prompt(questions, function (answers) {
      var res = _.find(choices[type], function (item) {
        return (item.value === answers.command);
      });
      if (res && _.isFunction(res.fct)) {
        res.fct(options, function (err, opt, msg) {
          if (!err && msg) {
            log.echo();
            log.success(msg);
            log.echo();
          }
          callback(err);
        });
      } else {
        callback(1);
      }
    });
  }
}

function _routeCLIRequest(type, options, done) {
  var msg = [];
  options.i18n.loadPhrases(path.resolve(__dirname, '..', 'data', 'i18n', 'bootstrap'));
  _buildOptions(options, function (err, choices) {
    _createRuntimeDir(function () {
      _displayOptions(type, choices, options, function (err) {
        if (err && err === USER_INTERRUPT) {
          log.echo();
          log.echo('Bye then...');
          return done();
        }
        if (err && err === USER_IGNORE) {
          log.echo();
          return done();
        }
        if (!err) {
          log.echo();
          msg.push('You may need to restart your session.');
          if (process.env.ENVTOOLS_VERSION) {
            msg.push('');
            msg.push(log.strToColor('cyan', 'Hint:') + ' type r + ENTER or just restart your terminal...');
          }
          log.printMessagesInBox(msg);
        }
        log.echo();
        done(err);
      });
    });
  });
}

// -- C O M M A N D  E N T R Y  P O I N T
exports.manual = function (options, done) {
  _routeCLIRequest(TYPE_MANUAL, options, done);
};

exports.extra = function (options, done) {
  _routeCLIRequest(TYPE_EXTRA, options, done);
};

exports.auto = function (options, done) {
  _routeCLIRequest(TYPE_AUTO, options, done);
};

exports.getHelp = function (debug, options) {
  var
    i = 0,
    MAX_OPTIONS = 10,
    namespace = 'bootstrap.help.' + options.type,
    _options = [];

  options.i18n.loadPhrases(path.resolve(__dirname, '..', 'data', 'i18n', 'bootstrap'));

  for (i = 0; i < MAX_OPTIONS; i += 1) {
    _options.push({
      option: options.i18n.t(namespace + '.options.' + i + '.option'),
      desc: options.i18n.t(namespace + '.options.' + i + '.desc')
    });
  }
  return {
    namespace: namespace,
    synopsis: options.i18n.t(namespace + '.synopsis'),
    command: options.i18n.t(namespace + '.command'),
    description: options.i18n.t(namespace + '.description'),
    options: _options,
    examples: options.i18n.t(namespace + '.examples')
  };
};
