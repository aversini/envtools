var
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs'),
  async = require('async'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  backup = require('./backup').backup,

  ENVTOOLS_FOLDER = path.join(process.env.HOME, '.envtools'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', 'data'),
    DOT_GIT_CONFIG: path.join(process.env.HOME, '.gitconfig'),
    NPM_CONFIG: path.join(process.env.HOME, '.npmrc'),
    DOT_PROFILE: path.join(process.env.HOME, '.profile'),
    PROXY_FILE: path.join(ENVTOOLS_FOLDER, 'proxy'),
    PROXY_STATUS_FILE: path.join(ENVTOOLS_FOLDER, 'proxy_status')
  },

  DOT_PROFILE_COMMENT = '### Added by Envtools',

  REQUEST_RUBY = 'r_ruby',
  REQUEST_HOMEBREW = 'r_brew',
  REQUEST_ENV = 'r_env',
  REQUEST_PROXY = 'r_proxy',
  REQUEST_CHECK_APPS = 'r_check_apps',
  REQUEST_GIT_CFG = 'r_git',
  REQUEST_NODE_NPM = 'r_node_npm';





// -- P R I V A T E  M E T H O D S

function _bootstrapEnv(options, callback) {
  var
    questions;

  function _updateDotProfile(done) {
    var p, d, res, msg;
    if (fs.existsSync(ENVTOOLS.DOT_PROFILE)) {
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
      res.push(DOT_PROFILE_COMMENT);
      res.push('source ' + path.join(__dirname, '..', 'shell', 'load.sh'));
      fs.writeFile(ENVTOOLS.DOT_PROFILE, res.join('\n'), function (err) {
        if (!err) {
          msg = 'Done! Envtools will load at each session.';
        } else {
          log.error('Unable to update your profile...');
          log.echo(err);
        }
        done(null, msg);
      });
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
      _updateDotProfile(callback);
    } else {
      callback(-1);
    }
  });
}

function _bootstrapProxy(options, callback) {
  var
    proxy = '',
    questions;

  function _setProxy(proxy, done) {
    var
      questions = {
        type: 'input',
        name: 'proxy',
        message: 'Enter proxy',
        validate: function (val) {
          if (!val) {
            return true;
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
        log.notice('Setting proxy to ', answers.proxy);
        fs.writeFileSync(ENVTOOLS.PROXY_FILE, answers.proxy);
        log.notice('Done! Please reload your session.');
        if (process.env.ENVTOOLS_VERSION) {
          log.notice('Hint: type r ENTER or just restart your terminal...');
        }
        done();
      } else {
        done(-1);
      }
    });
  }
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
        _setProxy(proxy, callback);
      } else {
        callback(-1);
      }
    });
  } else {
    utilities.mkdirp.sync(ENVTOOLS_FOLDER);
    _setProxy(null, callback);
  }
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
    callback(1);
  } else {
    callback();
  }
}

function _checkForApps(options, callback) {
  _checkForCoreApps(options, function (err) {
    var
      res = utilities.isAppInstalled([{
        'name': 'mvn',
        'error': options.i18n.t('bootstrap.errors.mvn')
      }, {
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
      }]);
    if (!res || err) {
      log.warning('Some applications could not be found...');
    }
    if (!err && res && !options.bootstrap) {
      log.success('All needed applications have been found!');
    }
    callback();
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
          if (options.bootstrap) {
            inquirer.prompt(questions, function (answers) {
              if (answers.goForIt) {
                done();
              } else {
                done(-1);
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
                utilities.forceAdminAccess(true, function () {
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
              done(-1);
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
              done(-1);
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

          log.echo();
          cmd.run(cmdline, {
            status: (options.bootstrap) ? false : true
          }, function () {
            var cmdline = [];
            if (process.env.ALL_PROXY) {
              cmdline.push('git config --global http.proxy ' + process.env.ALL_PROXY);
              cmdline.push('git config --global https.proxy ' + process.env.ALL_PROXY);
            } else {
              cmdline.push('git config --global --remove-section http');
              cmdline.push('git config --global --remove-section https');
            }
            cmd.run(cmdline, {
              status: (options.bootstrap) ? false : true
            }, callback);
          });

        } else {
          callback(err);
        }
      });
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
          status: (options.bootstrap) ? false : true
        }, function () {
          done();
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
      var
        questions = [{
          type: 'confirm',
          name: 'sudo',
          message: 'Do you need "sudo" access to install npm packages?',
          default: false
        }];
      if (goForIt) {
        inquirer.prompt(questions, function (answers) {
          done(null, goForIt, answers.sudo);
        });
      } else {
        done(null, 0, 0);
      }
    },
    function (goForIt, sudo, done) {
      if (goForIt) {
        if (sudo && !options.bootstrap) {
          utilities.forceAdminAccess(true, function () {
            done(null, sudo);
          });
        } else {
          done(null, sudo);
        }
      } else {
        done(-1);
      }
    },
    function (sudo, done) {
      var
        sudoCmd = (sudo) ? 'sudo -E ' : '',
        cmdline = [
          sudoCmd + 'npm install -g selleck',
          sudoCmd + 'npm install -g yuidocjs',
          sudoCmd + 'npm install -g yeti',
          sudoCmd + 'npm install -g yogi',
          sudoCmd + 'npm install -g phantomjs',
          sudoCmd + 'npm install -g grunt',
          sudoCmd + 'npm install -g grunt-cli',
          sudoCmd + 'npm install -g jshint'
        ];
      cmd.run(cmdline, {
        status: true
      }, function () {
        done();
      });
    }

  ], function (err, data) {
    callback(err, data);
  });
}

function _bootstrapHomebrew(options, callback) {
  var
    brewAlreadyInstalled = false;

  if (process.platform !== 'darwin') {
    log.warning('Homebrew can only be installed on Mac.');
    callback(-1);
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
          var
            cmdline;

          if (goForIt) {
            if (brewAlreadyInstalled) {
              cmdline = 'brew update';
            } else {
              cmdline =
                'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"';
            }
            cmd.run(cmdline, {
              status: (options.bootstrap) ? false : true
            }, done);
          } else {
            done();
          }
        }
      ],
      callback);
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
          status: (options.bootstrap) ? false : true
        }, done);
      } else {
        _bootstrapHomebrew(options, function (err) {
          if (!err) {
            cmd.run('brew install ruby', {
              status: (options.bootstrap) ? false : true
            }, done);
          }
        });
      }
    } else {
      log.notice('Cannot find Ruby (ruby), please install it manually.');
      done(-1);
    }
  }

  function _installCompass(done) {
    if (gem) {
      cmd.run('sudo -E gem install --no-ri --no-rdoc compass', {
        status: true
      }, done);
    } else {
      log.notice('Cannot find Rubygems (gem), please install it manually.');
      done(-1);
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
          message: 'About to install Ruby, continue?',
          type: 'confirm',
          name: 'goForIt',
          default: true
        };

      inquirer.prompt(questions, function (answers) {
        if (answers.goForIt) {
          done();
        } else {
          done(-1);
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
            done();
          } else {
            done();
          }
        });
      } else {
        done();
        _installRuby(done);
      }
    },
    function (done) {
      if (compass) {
        _isCompassVersionOk(function (err) {
          if (err) {
            done();
            _installCompass(done);
          } else {
            done();
          }
        });
      } else {
        done();
        _installCompass(done);
      }
    }
  ], callback);
}

function _routeRequest(request, options, callback) {
  switch (request) {
  case REQUEST_ENV:
    _bootstrapEnv(options, callback);
    break;
  case REQUEST_PROXY:
    _bootstrapProxy(options, callback);
    break;
  case REQUEST_CHECK_APPS:
    _checkForApps(options, callback);
    break;
  case REQUEST_GIT_CFG:
    _bootstrapGitConfiguration(options, callback);
    break;
  case REQUEST_NODE_NPM:
    _bootstrapNodeAndNpm(options, callback);
    break;
  case REQUEST_HOMEBREW:
    _bootstrapHomebrew(options, callback);
    break;
  case REQUEST_RUBY:
    _bootstrapRuby(options, callback);
    break;

  default:
  }
}

function _displayIntroduction(options, callback) {
  var
    totalChoices = 0,
    choices = [new inquirer.Separator('')],
    questions;


  function _addChoice(choice) {
    var add = false;
    if (choice.restrictOs) {
      if (choice.restrictOs.indexOf(process.platform) >= 0) {
        add = true;
      }
    } else {
      add = true;
    }
    if (add) {
      totalChoices++;
      choice.name = totalChoices + ') ' + choice.name;
      choices.push(choice);
    }
  }

  _addChoice({
    name: options.i18n.t('bootstrap.setEnv'),
    value: REQUEST_ENV
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setProxy'),
    value: REQUEST_PROXY
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setGitCfg'),
    value: REQUEST_GIT_CFG
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setNPM'),
    value: REQUEST_NODE_NPM
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setBrew'),
    value: REQUEST_HOMEBREW,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setRuby'),
    value: REQUEST_RUBY,
    restrictOs: ['darwin']
  });
  _addChoice({
    name: options.i18n.t('bootstrap.checkApps'),
    value: REQUEST_CHECK_APPS
  });

  questions = [{
    type: 'list',
    name: 'bootstrap',
    message: options.i18n.t('bootstrap.intro.msg1'),
    choices: choices
  }];

  log.resetConsole();
  log.echo();
  log.blue(options.i18n.t('bootstrap.intro.setup'));
  log.echo();
  inquirer.prompt(questions, function (answers) {
    _routeRequest(answers.bootstrap, options, function (err, msg) {
      if (err && err === -1) {
        log.echo();
        log.echo('Bye then...');
        callback();
      } else {
        if (!err && msg) {
          log.echo();
          log.success(msg);
          log.echo();
        }
        callback(err);
      }
    });
  });
}





// -- C O M M A N D  E N T R Y  P O I N T
exports.setup = function (options, done) {
  options.i18n.loadPhrases(path.resolve(__dirname, '..', 'data', 'i18n', 'bootstrap'));
  // create the .envtools folder (if it doesn't exist)
  utilities.mkdirp.sync(ENVTOOLS_FOLDER);
  // and display a welcome message and options
  _displayIntroduction(options, done);
};

exports.bootstrap = function (options, done) {
  function _trapStandardError(err, callback) {
    if (err && err === -1) {
      err = null;
    }
    callback(err);
  }
  options.i18n.loadPhrases(path.resolve(__dirname, '..', 'data', 'i18n', 'bootstrap'));
  // create the .envtools folder (if it doesn't exist)
  utilities.mkdirp.sync(ENVTOOLS_FOLDER);
  // display a welcome message/introduction
  log.resetConsole();
  log.echo();
  log.blue(options.i18n.t('bootstrap.intro.boot'));
  log.blue(options.i18n.t('bootstrap.intro.getOutAdvice'));
  log.echo();
  // we are in boot mode, we need extra confirmations
  options.bootstrap = true;
  // and run each action one after the other
  async.waterfall([
    function (callback) {
      utilities.forceAdminAccess(true, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_ENV, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_PROXY, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_GIT_CFG, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_NODE_NPM, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      if (process.platform === 'darwin') {
        _routeRequest(REQUEST_HOMEBREW, options, function (err) {
          _trapStandardError(err, callback);
        });
      } else {
        callback();
      }
    },
    function (callback) {
      _routeRequest(REQUEST_RUBY, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_CHECK_APPS, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
  ], function (err) {
    if (err && err === -1) {
      err = null;
    }
    log.echo();
    done(err);
  });

};

exports.getHelp = function (debug, options) {
  var
    i = 0,
    MAX_OPTIONS = 10,
    namespace = 'bootstrap.help',
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
