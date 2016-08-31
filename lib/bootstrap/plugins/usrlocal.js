var
  fs = require('fs-extra'),
  utilities = require('fedtools-utilities'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  common = require('../common');

module.exports = function (options, callback) {
  // resetting /usr/local permission to current owner
  var
    verbose = true,
    whoami = process.env.LOGNAME;

  if (options.auto) {
    verbose = false;
  }
  if (options.debug) {
    verbose = true;
  }

  function _chownUsrLocal(done) {
    cmd.run('sudo chown -R ' + whoami + ' /usr/local', {
      status: verbose
    }, function (err, stderr) {
      if (err && stderr) {
        log.echo(stderr);
      }
      if (!err && !options.auto) {
        err = common.USER_IGNORE;
      }
      done(err, options);
    });
  }

  if (!whoami) {
    whoami = cmd.run('whoami', {
      status: (options.debug) ? true : false
    }).output;
  }

  if (whoami && fs.existsSync('/usr/local')) {
    whoami = whoami.replace('\n', '');
    if (options.auto) {
      _chownUsrLocal(callback);
    } else {
      utilities.forceAdminAccess(true, function () {
        _chownUsrLocal(callback);
      });
    }
  } else {
    return callback(null, options);
  }
};
