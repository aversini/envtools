var
  _ = require('lodash'),
  inquirer = require('inquirer'),
  async = require('async'),
  utilities = require('fedtools-utilities'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  common = require('../common'),
  ATOM_PACKAGES = [
    'atom-beautify',
    'autoclose-html',
    'docblockr',
    'highlight-line',
    'file-icons',
    'language-soy',
    'linter',
    'linter-eslint',
    'merge-conflicts',
    'minimap',
    'open-in-browser',
    'pane-manager',
    'project-manager',
    'Sublime-Style-Column-Selection'
  ];

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
          message: 'About to install core Atom packages, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        if (answers.goForIt) {
          return done();
        } else {
          return done(common.USER_INTERRUPT);
        }
      });
    },
    function (done) {
      if (!options.auto) {
        inquirer.prompt([{
          type: 'checkbox',
          message: 'Select all packages you want to install',
          name: 'atoms',
          choices: ATOM_PACKAGES,
          pageSize: ATOM_PACKAGES.length + 1
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
            log.printMessagesInBox(['Restart Atom to take the changes into effects.']);
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
