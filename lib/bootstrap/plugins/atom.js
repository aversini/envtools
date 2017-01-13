var
  _ = require('lodash'),
  inquirer = require('inquirer'),
  async = require('async'),
  utilities = require('fedtools-utilities'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  common = require('../../common'),

  ATOM_PACKAGES = [{
    value: 'atom-beautify',
    short: 'atom-beautify',
    name: '[atom-beautify] .... Code beautifier.'
  }, {
    value: 'autoclose-html',
    short: 'autoclose-html',
    name: '[autoclose-html] ... Automates closing of HTML Tags.'
  }, {
    value: 'docblockr',
    short: 'docblockr',
    name: '[docblockr] ........ A helper package for writing documentation.'
  }, {
    value: 'highlight-line',
    short: 'highlight-line',
    name: '[highlight-line] ... Highlights the current line in the editor.'
  }, {
    value: 'file-icons',
    short: 'file-icons',
    name: '[file-icons] ....... Assign file extension icons and colors.'
  }, {
    value: 'language-soy',
    short: 'language-soy',
    name: '[language-soy] ..... Soy Template language support.'
  }, {
    value: 'language-vue',
    short: 'language-vue',
    name: '[language-vue] ..... Vue component support.'
  }, {
    value: 'linter',
    short: 'linter',
    name: '[linter] ........... A Base linter with Cow Powers.'
  }, {
    value: 'linter-eslint',
    short: 'linter-eslint',
    name: '[linter-eslint] .... Lint JavaScript on the fly, using ESLint.'
  }, {
    value: 'merge-conflicts',
    short: 'merge-conflicts',
    name: '[merge-conflicts] .. Resolve git conflicts within Atom.'
  }, {
    value: 'minimap',
    short: 'minimap',
    name: '[minimap] .......... A preview of the full source code.'
  }, {
    value: 'open-in-browser',
    short: 'open-in-browser',
    name: '[open-in-browser] .. Open file in default Browser.'
  }, {
    value: 'pane-manager',
    short: 'pane-manager',
    name: '[pane-manager] ..... Atom pane layout manager.'
  }, {
    value: 'project-manager',
    short: 'project-manager',
    name: '[project-manager] .. Project Manager for easy access and switching between projects.'
  }, {
    value: 'react',
    short: 'react',
    name: '[react] ............ React.js (JSX) language support, indentation, snippets, auto completion, reformatting.'
  }, {
    value: 'Sublime-Style-Column-Selection',
    short: 'sublime-col',
    name: '[sublime-col] ...... Enable Sublime style \'Column Selection\'.'
  }, {
    value: 'platformio-ide-terminal',
    short: 'platformio-ide-terminal',
    name: '[terminal] ......... Terminal emulation within Atom.'
  }];

module.exports = function (options, callback) {
  async.waterfall([
    function (done) {
      // need to check for apm package manager first...
      var res = utilities.isAppInstalled({
        name: 'apm',
        error: 'Atom package manager is not installed on this machine...'
      });
      if (res === true) {
        return done();
      } else {
        return done(common.USER_FATAL);
      }
    },
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to update Atom configuration for ssl, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        options.actionsPending++;
        if (answers.goForIt) {
          options.actionsDone++;
          return done(null, 1);
        } else {
          return done(null, 0);
        }
      });
    },
    function (goForIt, done) {
      if (goForIt) {
        cmd.run('apm config set strict-ssl false', {
          status: !options.auto
        }, function () {
          done();
        });
      } else {
        return done();
      }
    },
    function (done) {
      if (!options.auto) {
        inquirer.prompt([{
          type: 'checkbox',
          message: 'Select all packages you want to install',
          name: 'atoms',
          choices: ATOM_PACKAGES,
          pageSize: ATOM_PACKAGES.length + 1,
          validate: function (val) {
            if (!val.length) {
              return 'Press <space> to select one or more packages, or <ctrl-c> to quit...';
            }
            return true;
          }
        }]).then(function (answers) {
          return done(null, answers.atoms);
        });
      } else {
        return done(null, ATOM_PACKAGES);
      }
    },
    function (packages, done) {
      // need to run each commands in waterfall,
      // so extracting all fct and putting them into
      // an array (for async.waterfall)
      var res = _.map(packages, function (item) {
        return function (goodToGo) {
          cmd.run('apm install ' + item, {
            status: true
          }, function (err) {
            goodToGo(err);
          });
        };
      });
      // and finally running the show
      if (packages && packages.length) {
        async.waterfall(res, function (err) {
          if (!err) {
            log.echo();
            log.printMessagesInBox(['Restart Atom to take the changes into effect.'], common.LOG_COLORS.DEFAULT_BOX);
            err = common.USER_IGNORE;
          }
          done(err);
        });
      } else {
        return done(common.USER_INTERRUPT);
      }
    }
  ], function (err) {
    callback(err, options);
  });
};
