const fs = require("fs-extra");
const waterfall = require("async/waterfall");
const path = require("path");
const inquirer = require("inquirer");
const cmd = require("fedtools-commands");
const utilities = require("fedtools-utilities");
const gith = utilities.git;
const log = require("fedtools-logs");
const backup = require("../../utilities/backup");
const common = require("../../common");
const DOT_PROFILE_COMMENT = "### Added by Envtools (custom nvm loader)";
const NVM_VERSION = "v0.33.11";
const NVM_DIR = "nvm";
const NVM_DEST_DIR = path.join(common.RUNTIME_DIR, NVM_DIR);
const NVM_URL = "https://github.com/creationix/nvm.git";

module.exports = function(options, callback) {
  const lines = [DOT_PROFILE_COMMENT];
  const alreadyInstalled = fs.existsSync(NVM_DEST_DIR);

  let verbose = false,
    skipInstall = false,
    loadNvmAutomatically = false;

  if (options.debug) {
    verbose = true;
  }

  lines.push(`export NVM_DIR="${NVM_DEST_DIR}"`);
  lines.push(
    '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm'
  );
  lines.push("[[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion");

  function _writeDotProfile(file, load, done) {
    backup(file);
    fs.ensureFileSync(file);
    if (load) {
      utilities.appendLinesInFile(
        {
          lines,
          file
        },
        function(err) {
          done(err);
        }
      );
    } else {
      utilities.removeLinesInFile(
        {
          lines,
          file
        },
        function(err) {
          done(err);
        }
      );
    }
  }

  waterfall(
    [
      function(done) {
        const questions = {
          message: alreadyInstalled
            ? "About to update nvm, continue?"
            : "About to install nvm, continue?",
          type: "confirm",
          name: "goForIt",
          default: true
        };

        inquirer.prompt(questions).then(function(answers) {
          if (answers.goForIt) {
            skipInstall = false;
          } else {
            skipInstall = true;
          }
          done();
        });
      },
      function(done) {
        if (alreadyInstalled && !skipInstall) {
          // nvm is not compatible with npm config "prefix"
          cmd.run(
            "npm config delete prefix",
            {
              status: true
            },
            function() {
              done();
            }
          );
        } else {
          return done();
        }
      },
      function(done) {
        if (alreadyInstalled && !skipInstall) {
          gith.checkoutBranch(
            {
              cwd: NVM_DEST_DIR,
              branch: NVM_VERSION,
              silent: true
            },
            function(err, res) {
              if (err && res.stderr) {
                log.error(res.stderr);
              }
              done(err);
            }
          );
        } else {
          return done();
        }
      },
      function(done) {
        if (!alreadyInstalled && !skipInstall) {
          gith.cloneGitRepository(
            {
              cloneArgs: `--branch ${NVM_VERSION}`,
              name: NVM_DIR,
              cwd: common.RUNTIME_DIR,
              verbose,
              silent: true,
              url: NVM_URL
            },
            function(err, res) {
              if (err && res.stderr) {
                log.error(res.stderr);
              }
              done(err);
            }
          );
        } else {
          return done();
        }
      },
      function(done) {
        const questions = [
          {
            type: "list",
            name: "load",
            message: "Please choose one of the following options",
            when() {
              return !options.auto;
            },
            choices: [
              {
                name: "Automatically load nvm at each session",
                short: "Load nvm",
                value: common.ON
              },
              {
                name: "Do not load nvm automatically",
                short: "Do not load nvm",
                value: common.OFF
              }
            ]
          }
        ];

        // only ask to load nvm if it is installed
        if (alreadyInstalled || !skipInstall) {
          inquirer.prompt(questions).then(function(answers) {
            if (answers.load === common.ON) {
              loadNvmAutomatically = true;
            } else {
              loadNvmAutomatically = false;
            }
            done();
          });
        } else {
          return done();
        }
      },
      function(done) {
        _writeDotProfile(common.DOT_PROFILE, loadNvmAutomatically, done);
      },
      function(done) {
        _writeDotProfile(common.DOT_BASH_PROFILE, loadNvmAutomatically, done);
      },
      function(done) {
        const installType = alreadyInstalled
          ? `updated to ${NVM_VERSION}`
          : "installed";
        let name = "\nNode Version Manager (nvm)";
        if (!skipInstall) {
          log.success(`${name} has been ${installType}`);
          name = "nvm";
        }
        if (alreadyInstalled || !skipInstall) {
          if (loadNvmAutomatically) {
            log.success(`${name} will load automatically at each session`);
          } else {
            log.notice(`${name} will NOT load automatically`);
          }
        }
        if (!skipInstall) {
          log.echo(`The location is: ${NVM_DEST_DIR}`);
        }
        done();
      }
    ],
    function(err) {
      /*
       * we cannot reload the session via "r" since
       * .profile files have been updated. User needs
       * to restart the full terminal (tab or new)...
       */
      options.restartShortcutHint = false;
      // if we didn't do nothin', just say it
      if (skipInstall && !alreadyInstalled) {
        err = common.USER_INTERRUPT;
      }
      callback(err);
    }
  );
};
