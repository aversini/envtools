/*jshint maxlen: false */

var
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  Download = require('download'),
  rimraf = require('rimraf'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  backup = require('./backup').backup,

  ENVTOOLS_FOLDER = path.join(process.env.HOME, '.envtools'),
  ENVTOOLS = {
    THIRDDIR: path.join(__dirname, '..', 'data', 'third'),
    DOT_GIT_CONFIG: path.join(process.env.HOME, '.gitconfig'),
    NPM_CONFIG: path.join(process.env.HOME, '.npmrc'),
    DOT_PROFILE: path.join(process.env.HOME, '.profile'),
    PROXY_FILE: path.join(ENVTOOLS_FOLDER, 'proxy'),
    PROXY_STATUS_FILE: path.join(ENVTOOLS_FOLDER, 'proxy_status')
  },

  DOT_PROFILE_COMMENT = '### Added by Envtools',

  REQUEST_PROMPT = 'r_prompt',
  REQUEST_FEDTOOLS = 'r_fedtools',
  REQUEST_USR_LOCAL = 'r_usr_local',
  REQUEST_MAVEN = 'r_maven',
  REQUEST_RUBY = 'r_ruby',
  REQUEST_HOMEBREW = 'r_brew',
  REQUEST_ENV = 'r_env',
  REQUEST_PROXY = 'r_proxy',
  REQUEST_CHECK_APPS = 'r_check_apps',
  REQUEST_GIT_CFG = 'r_git',
  REQUEST_NODE_NPM = 'r_node_npm';





// -- P R I V A T E  M E T H O D S

function _bootstrapPrompt(options, callback) {
  var
    envtoolsPrompt = path.join(ENVTOOLS_FOLDER, 'envtools-prompt'),
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
      },
      function (goodToGo) {
        var msg = [];
        if (!options.bootstrap) {
          msg.push('You may need to restart your session.');
          if (process.env.ENVTOOLS_VERSION) {
            msg.push('');
            msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
          }
          log.printMessagesInBox(msg);
          log.echo();
        }
        goodToGo();
      }
    ], function (err) {
      done(err);
    });


  }
  if (options.bootstrap) {
    _enableEnvtoolsPrompt(true, callback);
  } else {
    inquirer.prompt(questions, function (answers) {
      _enableEnvtoolsPrompt(answers.change, callback);
    });
  }
}

function _fixUsrLocal(options, callback) {
  // resetting /usr/local permission to current owner
  var
    whoami = process.env.LOGNAME;

  function _chownUsrLocal(done) {
    cmd.run('sudo chown -R ' + whoami + ' /usr/local', {
      status: (options.bootstrap) ? false : true
    }, function (err, stderr) {
      if (err && stderr) {
        log.echo(stderr);
      }
      done(err);
    });
  }

  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: false
    }).output;
  }

  if (whoami && fs.existsSync('/usr/local')) {
    whoami = whoami.replace('\n', '');
    if (options.bootstrap) {
      _chownUsrLocal(callback);
    } else {
      utilities.forceAdminAccess(true, function () {
        _chownUsrLocal(callback);
      });
    }
  } else {
    callback();
  }
}

function _bootstrapEnv(options, callback) {
  var
    questions;

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
      done(null, msg);
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
      _parseDotProfile(callback);
    } else {
      callback(-1);
    }
  });
}

function _bootstrapProxy(options, callback) {
  var
    msg = [],
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
        fs.writeFileSync(ENVTOOLS.PROXY_FILE, answers.proxy);

        if (!options.bootstrap) {
          msg.push('To take your proxy into account, you need to restart your session.');
          if (process.env.ENVTOOLS_VERSION) {
            msg.push('');
            msg.push(log.strToColor('cyan', 'Hint #1:') + ' type r ENTER or just restart your terminal...');
            msg.push(log.strToColor('cyan', 'Hint #2:') + ' type pon ENTER to turn the proxy ON.');
            msg.push(log.strToColor('cyan', 'Hint #3:') + ' type poff ENTER to turn the proxy OFF.');
          }
        }
        done(-2, msg);
      } else {
        done(-1);
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
          done(-1);
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
            done(-1);
          }
        });
      } else {
        utilities.mkdirp.sync(ENVTOOLS_FOLDER);
        _setProxy(null, done);
      }
    }
  ], function (err, data) {
    if (err && err === -2 && data && data.length) {
      log.printMessagesInBox(data);
    }
    callback(err);
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
            confirmAdmin = (options.bootstrap) ? false : true,
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

          cmd.run(cmdline, {
            status: (options.bootstrap) ? false : true
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
            status: (options.bootstrap) ? false : true
          });
          callback();
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
      // forcing sudo on other than Mac
      if (process.platform === 'darwin') {
        done(null, goForIt, false);
      } else {
        done(null, goForIt, true);
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
          sudoCmd + 'npm install -g shifter',
          sudoCmd + 'npm install -g yeti',
          sudoCmd + 'npm install -g yogi',
          sudoCmd + 'npm install -g phantomjs',
          sudoCmd + 'npm install -g grunt',
          sudoCmd + 'npm install -g grunt-cli',
          sudoCmd + 'npm install -g jshint'
        ];
      cmd.run(cmdline, {
        status: true
      }); // no async for array of commands
      done();
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
            destFolder = path.join(process.env.RUNTIME_DIR, 'homebrew'),
            url = 'https://github.com/Homebrew/homebrew/tarball/master';

          if (goForIt) {
            if (brewAlreadyInstalled) {
              cmd.run('brew update', {
                status: (options.bootstrap) ? false : true
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
    var
      cmdline;

    if (gem) {
      if (process.platform === 'darwin') {
        cmdline = 'gem install --no-ri --no-rdoc compass --install-dir /usr/local/gems';
      } else {
        cmdline = 'sudo -E gem install --no-ri --no-rdoc compass';
      }
      cmd.run(cmdline, {
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

function _bootstrapMaven(options, callback) {
  var
    m2SettingsDest = path.join(process.env.HOME, '.m2', 'settings.xml'),
    resultingFolder,
    destFile,
    destFolder,
    url = 'http://apachemirror.ovidiudan.com/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.zip';

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
        utilities.mkdirp.sync(process.env.RUNTIME_DIR);
      }
      done();
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
      destFolder = process.env.RUNTIME_DIR;
      destFile = path.join(destFolder, 'apache-maven-3.3.9-bin.zip');
      resultingFolder = path.join(process.env.RUNTIME_DIR, 'apache-maven-3.3.9');
      if (!fs.existsSync(resultingFolder)) {
        // need to download maven
        done();
      } else {
        if (!options.bootstrap) {
          _displayMavenRestartInfo('Maven is already installed...');
        }
        done(-2);
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
          .dest(destFolder)
          .run(function (err) {
            done(err);
          });
      } else {
        done(-1);
      }
    },
    function (done) {
      _displayMavenRestartInfo();
      done();
    }
  ], function (err, data) {
    if (err && (err === -1 || err === -2)) {
      err = null;
    }
    callback(err, data);
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
        status: (options.bootstrap) ? false : true
      }, function (err, stderr) {
        if (err && stderr) {
          log.echo(stderr);
        }
        callback(err);
      });
    } else {
      callback(-1);
    }
  });
}

function _routeRequest(request, options, callback) {
  switch (request) {
  case REQUEST_PROMPT:
    _bootstrapPrompt(options, callback);
    break;
  case REQUEST_USR_LOCAL:
    _fixUsrLocal(options, callback);
    break;
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
  case REQUEST_MAVEN:
    _bootstrapMaven(options, callback);
    break;
  case REQUEST_FEDTOOLS:
    _installFedtools(options, callback);
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
    name: options.i18n.t('bootstrap.setUsrLocal'),
    value: REQUEST_USR_LOCAL,
  });
  _addChoice({
    name: options.i18n.t('bootstrap.setPrompt'),
    value: REQUEST_PROMPT
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
    name: options.i18n.t('bootstrap.setMaven'),
    value: REQUEST_MAVEN
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
    name: options.i18n.t('bootstrap.installFedtools'),
    value: REQUEST_FEDTOOLS
  });
  _addChoice({
    name: options.i18n.t('bootstrap.checkApps'),
    value: REQUEST_CHECK_APPS
  });

  questions = [{
    pageSize: choices.length + 1,
    type: 'list',
    name: 'bootstrap',
    message: options.i18n.t('bootstrap.intro.msg1'),
    choices: choices
  }];

  log.resetConsole();
  log.echo();
  log.printMessagesInBox([
    options.i18n.t('bootstrap.intro.manual'),
    options.i18n.t('bootstrap.intro.getOutAdvice2')
  ]);
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
exports.manual = function (options, done) {
  options.i18n.loadPhrases(path.resolve(__dirname, '..', 'data', 'i18n', 'bootstrap'));
  // create the .envtools folder (if it doesn't exist)
  utilities.mkdirp.sync(ENVTOOLS_FOLDER);
  // and display a welcome message and options
  _displayIntroduction(options, function (err) {
    if (err && (err === -1 || err === -2)) {
      err = null;
    }
    log.echo();
    done(err);
  });
};

exports.auto = function (options, done) {
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
  log.printMessagesInBox([
    options.i18n.t('bootstrap.intro.auto'),
    options.i18n.t('bootstrap.intro.getOutAdvice1')
  ]);
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
      _routeRequest(REQUEST_USR_LOCAL, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      if (!process.env.ENVTOOLS_VERSION) {
        _routeRequest(REQUEST_ENV, options, function (err) {
          _trapStandardError(err, callback);
        });
      } else {
        callback();
      }
    },
    function (callback) {
      _routeRequest(REQUEST_PROMPT, options, function (err) {
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
      _routeRequest(REQUEST_MAVEN, options, function (err) {
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
      _routeRequest(REQUEST_FEDTOOLS, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
    function (callback) {
      _routeRequest(REQUEST_CHECK_APPS, options, function (err) {
        _trapStandardError(err, callback);
      });
    },
  ], function (err) {
    var msg = [];
    if (err && (err === -1 || err === -2)) {
      err = null;
    }
    log.echo();
    if (!err) {
      msg.push('To take potential environment changes into account,\nyou need to restart your session.');
      if (process.env.ENVTOOLS_VERSION) {
        msg.push('');
        msg.push(log.strToColor('cyan', 'Hint:') + ' type r ENTER or just restart your terminal...');
      }
      log.printMessagesInBox(msg);
      log.echo();
    }
    done(err);
  });
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
