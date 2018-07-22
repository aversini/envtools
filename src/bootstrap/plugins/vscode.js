const _ = require('lodash');
const inquirer = require('inquirer');
const waterfall = require('async/waterfall');
const isAppInstalled = require('../../utilities/isAppInstalled');
const cmd = require('fedtools-commands');
const log = require('fedtools-logs');
const common = require('../../common');
const VSCODE_PACKAGES = [
  {
    value: 'shurelia.base16-tomorrow-dark-vscode',
    short: 'Base16 Tomorrow Dark+',
    name: `[Base16 Tomorrow Dark+] .... A base16 color theme styled to look like Atom's base16-tomorrow-dark-theme.`
  },
  {
    value: 'alefragnani.bookmarks',
    short: 'Bookmarks',
    name: '[Bookmarks] ................ Mark lines and jump to them.'
  },
  {
    value: 'streetsidesoftware.code-spell-checker',
    short: 'Code Spell Checker',
    name: '[Code Spell Checker] ....... Spelling checker for source code.'
  },
  {
    value: 'dbaeumer.vscode-eslint',
    short: 'ESLint',
    name:
      '[ESLint] ................... Integrates ESLint JavaScript into VS Code.'
  },
  {
    value: 'file-icons.file-icons',
    short: 'file-icons',
    name:
      '[file-icons] ............... File-specific icons in VSCode for improved visual grepping.'
  },
  {
    value: 'cpylua.language-postcss',
    short: 'language-postcss',
    name: '[language-postcss] ......... PostCSS language support.'
  },
  {
    value: 'bierner.markdown-preview-github-styles',
    short: 'Md Preview for Github',
    name: `[Md Preview for Github] .... Changes VS Code's built-in markdown preview to match Github's style.`
  },
  {
    value: 'esbenp.prettier-vscode',
    short: 'Prettier-Code formatter',
    name: '[Prettier-Code] ............ VS Code plugin for prettier/prettier.'
  },
  {
    value: 'erikphansen.vscode-toggle-column-selection',
    short: 'Toggle Column Selection',
    name:
      '[Toggle Column Selection] .. Turn a selection in a column selection à la TextMate.'
  },
  {
    value: 'mrmlnc.vscode-duplicate',
    short: 'Duplicate action',
    name:
      '[Duplicate action] ......... Ability to duplicate files and folders in VS Code.'
  }
];

module.exports = function (options, callback) {
  waterfall(
    [
      function (done) {
        // need to check for code package manager first...
        const res = isAppInstalled('code');
        if (res === true) {
          return done();
        } else {
          log.error('VS Code CLI is not installed on this machine...');
          return done(common.USER_FATAL);
        }
      },
      function (done) {
        if (!options.auto) {
          inquirer
            .prompt([
              {
                type: 'checkbox',
                message: 'Select all packages you want to install',
                name: 'vscode',
                choices: VSCODE_PACKAGES,
                pageSize: VSCODE_PACKAGES.length + 1,
                validate(val) {
                  if (!val.length) {
                    return 'Press <space> to select one or more packages, or <ctrl-c> to quit...';
                  }
                  return true;
                }
              }
            ])
            .then(function (answers) {
              // flatten the answers in case there is an array within the array, that is
              // multiple entries for one package (for example split-diff)
              return done(null, _.flatten(answers.vscode));
            });
        } else {
          return done(null, VSCODE_PACKAGES);
        }
      },
      function (packages, done) {
        // need to run each commands in waterfall,
        // so extracting all fct and putting them into
        // an array (for async.waterfall)
        const res = _.map(packages, function (item) {
          return function (goodToGo) {
            cmd.run(
              `code --install-extension ${item}`,
              {
                status: true
              },
              function (err) {
                goodToGo(err);
              }
            );
          };
        });
        // and finally running the show
        if (packages && packages.length) {
          waterfall(res, function (err) {
            if (!err) {
              log.echo();
              log.printMessagesInBox(
                ['Restart Visual Studio Code to take the changes into effect.'],
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
    function (err) {
      callback(err, options);
    }
  );
};
