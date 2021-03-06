const _ = require("lodash");
const waterfall = require("async/waterfall");
const inquirer = require("inquirer");
const path = require("path");
const cmd = require("fedtools-commands");
const log = require("fedtools-logs");
const isAppInstalled = require("../../utilities/isAppInstalled");
const backup = require("../../utilities/backup");
const common = require("../../common");
const DOT_GIT_CONFIG = path.join(process.env.HOME, ".gitconfig");

module.exports = function(options, callback) {
  if (isAppInstalled("git")) {
    backup(DOT_GIT_CONFIG);
    waterfall(
      [
        function(done) {
          const questions = {
            type: "confirm",
            name: "goForIt",
            message: "About to update git configuration, continue?",
            default: true
          };
          if (options.auto) {
            inquirer.prompt(questions).then(function(answers) {
              options.actionsPending++;
              if (answers.goForIt) {
                options.actionsDone++;
                return done();
              } else {
                return done(common.USER_INTERRUPT);
              }
            });
          } else {
            return done();
          }
        },
        function(done) {
          const questions = {
            type: "input",
            name: "fullname",
            message: "[git] Enter your full name",
            validate(val) {
              if (!val) {
                return "Your full name cannot be empty...";
              } else {
                return true;
              }
            }
          };

          const fullname = cmd.run("git config --global --get user.name", {
            status: false
          }).output;
          if (_.isString(fullname)) {
            questions.default = fullname.replace("\n", "");
            questions.message = `${questions.message} or press ENTER for default`;
          }

          inquirer.prompt(questions).then(function(answers) {
            if (answers.fullname) {
              return done(null, answers.fullname);
            } else {
              return done(common.USER_INTERRUPT);
            }
          });
        },
        function(fullName, done) {
          const questions = {
            type: "input",
            name: "email",
            message: "[git] Enter your email address",
            validate(val) {
              if (!val) {
                return "Your email address cannot be empty...";
              } else {
                return true;
              }
            }
          };

          const email = cmd.run("git config --global --get user.email", {
            status: false
          }).output;
          if (_.isString(email)) {
            questions.default = email.replace("\n", "");
            questions.message = `${questions.message} or press ENTER for default`;
          }

          inquirer.prompt(questions).then(function(answers) {
            if (answers.email) {
              return done(null, fullName, answers.email);
            } else {
              return done(common.USER_INTERRUPT);
            }
          });
        },
        function(fullName, email, done) {
          const questions = [
            {
              type: "input",
              name: "github",
              message:
                "[git] Enter your external github username (if you have one)"
            }
          ];

          inquirer.prompt(questions).then(function(answers) {
            done(null, fullName, email, answers.github);
          });
        }
      ],
      function(err, fullName, email, github) {
        let cmdline;
        if (!err) {
          cmdline = [
            `git config --global user.name "${fullName}"`,
            `git config --global user.email ${email}`,
            "git config --global color.diff auto",
            "git config --global color.status auto",
            "git config --global color.ui auto",
            'git config --global url."https://github.com/".insteadOf "git://github.com/"',
            "git config --global alias.st 'status --short --branch'",
            "git config --global alias.d diff",
            "git config --global alias.br branch",
            "git config --global alias.ci commit",
            "git config --global alias.co checkout",
            "git config --global push.default simple",
            "git config --global http.sslVerify false"
          ];

          if (github) {
            cmdline.push(`git config --global github.user ${github}`);
          }

          if (common.isMac()) {
            cmdline.push(
              "git config --global alias.l 'log --graph --abbrev-commit --decorate --all --format=format:\"%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(dim white) - %an%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n %C(white)%s%C(reset)\"'"
            );
            cmdline.push("git config --global diff.tool opendiff");
            cmdline.push("git config --global merge.tool opendiff");
            cmdline.push("git config --global credential.helper osxkeychain");
          } else {
            cmdline.push(
              "git config --global credential.helper 'cache --timeout 1209600'"
            );
          }

          cmd.run(cmdline, {
            status: !options.auto
          });
          cmdline = [];
          if (process.env.ALL_PROXY) {
            cmdline.push(
              `git config --global http.proxy ${process.env.ALL_PROXY}`
            );
            cmdline.push(
              `git config --global https.proxy ${process.env.ALL_PROXY}`
            );
          } else {
            cmdline.push("git config --global --remove-section http");
            cmdline.push("git config --global --remove-section https");
          }
          cmd.run(cmdline, {
            status: !options.auto
          });
          return callback(null, options);
        } else {
          if (options.auto && err === common.USER_INTERRUPT) {
            err = null;
          }
          return callback(err, options);
        }
      }
    );
  } else {
    log.error("Git is not installed on this machine...");
    return callback(null, options);
  }
};
