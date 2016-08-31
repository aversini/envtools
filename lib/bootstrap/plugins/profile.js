var
  async = require('async'),
  path = require('path'),
  fs = require('fs-extra'),
  utilities = require('fedtools-utilities'),
  inquirer = require('inquirer'),

  backup = require('../../backup'),
  common = require('../common'),

  DOT_PROFILE = path.join(process.env.HOME, '.profile'),
  DOT_BASH_PROFILE = path.join(process.env.HOME, '.bash_profile'),
  DOT_HUSHLOGIN = path.join(process.env.HOME, '.hushlogin'),
  DOT_PROFILE_COMMENT = '### Added by Envtools';

module.exports = function (options, callback) {
  var
    questions;

  function _writeDotProfile(file, choice, done) {
    var
      envdir = path.join(__dirname, '..', '..', '..', 'shell'),
      lines = [DOT_PROFILE_COMMENT];

    if (process.platform === 'win32') {
      lines.push('export ENVTOOLS_ENVDIR="' + envdir + '"');
    }
    lines.push('source "' + path.join(envdir, 'load.sh"'));

    backup(file);
    fs.ensureFileSync(file);

    if (choice === common.ON) {
      utilities.appendLinesInFile({
        lines: lines,
        file: file
      }, function (err) {
        done(err);
      });
    } else {
      utilities.removeLinesInFile({
        lines: lines,
        file: file
      }, function (err) {
        done(err);
      });
    }
  }

  function _updateDotProfiles(choice, done) {
    async.waterfall([
      function (fini) {
        _writeDotProfile(DOT_PROFILE, choice, fini);
      },
      function (fini) {
        _writeDotProfile(DOT_BASH_PROFILE, choice, fini);
      },
      function (fini) {
        // also remove the useless "last login info" shown
        // at each session startup to speed things up.
        fs.writeFile(DOT_HUSHLOGIN, '', function () {
          fini();
        });
      }
    ], function (err) {
      done(err, options);
    });
  }

  // in auto mode, no setting env if it's already set!
  if (options.auto && process.env.ENVTOOLS_VERSION) {
    return callback(null, options);
  }

  questions = [{
    type: 'list',
    name: 'change',
    message: 'Please choose one of the following options',
    choices: [{
      name: 'Automatically load Envtools at each session',
      value: common.ON
    }, {
      name: 'Do not load Envtools automatically',
      value: common.OFF
    }]
  }];

  inquirer.prompt(questions).then(function (answers) {
    return _updateDotProfiles(answers.change, function () {
      callback(null, options);
    });
  });
};
