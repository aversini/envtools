const _ = require("lodash");
const inquirer = require("inquirer");
const waterfall = require("async/waterfall");
const isAppInstalled = require("../../utilities/isAppInstalled");
const cmd = require("fedtools-commands");
const log = require("fedtools-logs");
const common = require("../../common");
const ATOM_PACKAGES = [
  {
    value: "atom-beautify",
    short: "atom-beautify",
    name: " [atom-beautify] .... Code beautifier (better for html, css, svg)."
  },
  {
    value: "autoclose-html",
    short: "autoclose-html",
    name: " [autoclose-html] ... Automates closing of HTML Tags."
  },
  {
    value: "docblockr",
    short: "docblockr",
    name: " [docblockr] ........ A helper package for writing documentation."
  },
  {
    value: "highlight-line",
    short: "highlight-line",
    name: " [highlight-line] ... Highlights the current line in the editor."
  },
  {
    value: "file-icons",
    short: "file-icons",
    name: " [file-icons] ....... Assign file extension icons and colors."
  },
  {
    value: "layout-control",
    short: "layout-control",
    name: " [layout-control] ... Layout pane manager."
  },
  {
    value: "language-babel",
    short: "language-babel",
    name:
      " [language-babel] ... React (JSX) language support, indentation, snippets, auto completion, reformatting."
  },
  {
    value: "language-postcss",
    short: "language-postcss",
    name: " [language-postcss] ..... PostCSS language support."
  },
  {
    value: "language-soy",
    short: "language-soy",
    name: " [language-soy] ..... Soy Template language support."
  },
  {
    value: "language-svg",
    short: "language-svg",
    name: " [language-svg] ..... SVG language support."
  },
  {
    value: [
      "linter",
      "linter-eslint",
      "linter-ui-default",
      "busy-signal",
      "intentions"
    ],
    short: "linter-eslint",
    name: " [linter-eslint] .... Lint JavaScript on the fly, using ESLint."
  },
  {
    value: "minimap",
    short: "minimap",
    name: " [minimap] .......... A preview of the full source code."
  },
  {
    value: "minimap-linter",
    short: "minimap-linter",
    name: " [minimap-linter] ... Display linter markers in the minimap."
  },
  {
    value: "open-in-browser",
    short: "open-in-browser",
    name: " [open-in-browser] .. Open file in default Browser."
  },
  {
    value: "prettier-atom",
    short: "prettier",
    name: " [prettier] ......... Another code beautifier (better for js, jsx)."
  },
  {
    value: "Sublime-Style-Column-Selection",
    short: "sublime-col",
    name: " [sublime-col] ...... Enable Sublime style 'Column Selection'."
  },
  {
    value: "platformio-ide-terminal",
    short: "platformio-ide-terminal",
    name: " [terminal] ......... Terminal emulation within Atom."
  }
];

module.exports = function(options, callback) {
  waterfall(
    [
      function(done) {
        // need to check for apm package manager first...
        const res = isAppInstalled("apm");
        if (res === true) {
          return done();
        } else {
          log.error("Atom package manager is not installed on this machine...");
          return done(common.USER_FATAL);
        }
      },
      function(done) {
        cmd.run(
          "apm config set strict-ssl false",
          {
            status: !options.auto
          },
          function() {
            done();
          }
        );
      },
      function(done) {
        if (!options.auto) {
          inquirer
            .prompt([
              {
                type: "checkbox",
                message: "Select all packages you want to install",
                name: "atoms",
                choices: ATOM_PACKAGES,
                pageSize: ATOM_PACKAGES.length + 1,
                validate(val) {
                  if (!val.length) {
                    return "Press <space> to select one or more packages, or <ctrl-c> to quit...";
                  }
                  return true;
                }
              }
            ])
            .then(function(answers) {
              /*
               * flatten the answers in case there is an array within the array, that is
               * multiple entries for one package (for example split-diff)
               */
              return done(null, _.flatten(answers.atoms));
            });
        } else {
          return done(null, ATOM_PACKAGES);
        }
      },
      function(packages, done) {
        /*
         * need to run each commands in waterfall,
         * so extracting all fct and putting them into
         * an array (for async.waterfall)
         */
        const res = _.map(packages, function(item) {
          return function(goodToGo) {
            cmd.run(
              `apm install ${item}`,
              {
                status: true
              },
              function(err) {
                goodToGo(err);
              }
            );
          };
        });
        // and finally running the show
        if (packages && packages.length) {
          waterfall(res, function(err) {
            if (!err) {
              log.echo();
              log.printMessagesInBox(
                ["Restart Atom to take the changes into effect."],
                common.LOG_COLORS.DEFAULT_BOX
              );
              err = common.USER_IGNORE;
            }
            done(err);
          });
        } else {
          return done(common.USER_INTERRUPT);
        }
      }
    ],
    function(err) {
      callback(err, options);
    }
  );
};
