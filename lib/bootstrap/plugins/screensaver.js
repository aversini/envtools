var
  fs = require('fs-extra'),
  inquirer = require('inquirer'),
  glob = require('glob'),
  async = require('async'),
  path = require('path'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../common');

module.exports = function (options, callback) {
  var
    i,
    len,
    msg = [],
    ssFolder = path.join(process.env.HOME, 'Library',
      'Preferences', 'ByHost');

  async.waterfall([
    function (done) {
      var questions = [{
        type: 'confirm',
        name: 'change',
        message: 'Screensaver configuration files will be cleaned, continue?',
        default: true
      }];
      inquirer.prompt(questions).then(function (answers) {
        if (answers.change) {
          return done();
        } else {
          return done(common.USER_INTERRUPT);
        }
      });
    },
    function (done) {
      glob(ssFolder + '/com.apple.screensaver*', {
        nosort: true,
        nocase: true
      }, function (err, files) {
        // removing the old screensaver configurations
        if (!err && files) {
          len = files.length;
          for (i = 0; i < len; i++) {
            backup(path.join(ssFolder, path.basename(files[i])));
            fs.removeSync(path.join(ssFolder, path.basename(files[i])));
          }
        }
        msg.push('Screensaver configuration files have been cleared.');
        msg.push('Please logout or restart before accessing the\nscreensaver configuration panel again.');
        log.printMessagesInBox(msg);
        done();
      });
    }
  ], function (err) {
    callback(err, options);
  });
};
