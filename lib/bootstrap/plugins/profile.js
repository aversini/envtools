var
  _ = require('lodash'),
  async = require('async'),
  path = require('path'),
  fs = require('fs-extra'),
  log = require('fedtools-logs'),
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

  // in auto mode, no setting env if it's already set!
  if (options.auto && process.env.ENVTOOLS_VERSION) {
    return callback(null, options);
  }

  function _writeDotProfile(file, buffer, done) {
    var
      msg,
      envdir = path.join(__dirname, '..', '..', '..', 'shell');

    buffer.push(DOT_PROFILE_COMMENT);
    if (process.platform === 'win32') {
      buffer.push('export ENVTOOLS_ENVDIR="' + envdir + '"');
    }
    buffer.push('source "' + path.join(envdir, 'load.sh"'));

    fs.writeFile(file, buffer.join('\n'), function (err) {
      if (!err) {
        msg = 'Done! Envtools will load at each session.';
      } else {
        log.error('Unable to update the file ' + file);
        log.echo(err);
      }
      if (msg) {
        options.msg = msg;
      }
      done();
    });
  }

  function _parseDotProfile(file, done) {
    var p, d, res = [],
      loadSignature;
    if (!fs.existsSync(file)) {
      return done(null, res);
    } else {
      backup(file);
      if (process.platform === 'win32') {
        loadSignature = 'envtools';
      } else {
        loadSignature = '/envtools/shell/load.sh';
      }
      p = fs.readFileSync(file, 'utf8');
      d = p.split('\n');
      res = _.filter(d, function (line) {
        if (line.match(DOT_PROFILE_COMMENT) ||
          line.match(loadSignature)) {
          return false;
        } else {
          return true;
        }
      });
      return done(null, res);
    }
  }

  function _updateDotProfiles(done) {
    async.waterfall([
      function (fini) {
        _parseDotProfile(DOT_PROFILE, fini);
      },
      function (buffer, fini) {
        _writeDotProfile(DOT_PROFILE, buffer, fini);
      },
      function (fini) {
        _parseDotProfile(DOT_BASH_PROFILE, fini);
      },
      function (buffer, fini) {
        _writeDotProfile(DOT_BASH_PROFILE, buffer, fini);
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

  questions = [{
    type: 'confirm',
    name: 'change',
    message: 'About to update .profile... Continue?',
    default: true
  }];
  inquirer.prompt(questions).then(function (answers) {
    if (answers.change) {
      return _updateDotProfiles(callback);
    } else {
      if (options.auto) {
        return callback(null, options);
      }
      return callback(common.USER_INTERRUPT, options);
    }
  });
};
