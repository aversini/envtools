let fs = require('fs-extra'),
  inquirer = require('inquirer'),
  glob = require('glob'),
  waterfall = require('async/waterfall'),
  each = require('async/each'),
  path = require('path'),
  log = require('fedtools-logs'),
  decompress = require('decompress'),
  backup = require('../../backup'),
  common = require('../../common');

function _installScreensavers(options, callback) {
  let srcFolderPattern = path.join(
      common.ENVTOOLS.THIRDDIR,
      'screensavers/*.tgz'
    ),
    destFolder = path.join(process.env.HOME, 'Library', 'Screen Savers');

  waterfall(
    [
      function (done) {
        const questions = [
          {
            type: 'confirm',
            name: 'install',
            message: 'Extra screensavers will be installed, continue?',
            default: true
          }
        ];
        inquirer.prompt(questions).then(function (answers) {
          if (answers.install) {
            return done();
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      },
      function (done) {
        glob(
          srcFolderPattern,
          {
            nosort: true,
            nocase: true
          },
          function (err, files) {
            // need to decompress each tgz
            if (!err && files) {
              each(
                files,
                function (file, cb) {
                  decompress(file, destFolder).then(
                    function () {
                      cb();
                    },
                    function () {
                      cb();
                    }
                  );
                },
                function (err) {
                  done(err);
                }
              );
            } else {
              return done();
            }
          }
        );
      }
    ],
    function (err) {
      if (!err) {
        log.success('Extra screensavers have been successfully installed!');
        err = common.USER_IGNORE;
      }
      callback(err, options);
    }
  );
}

function _fixScreensaverSettings(options, callback) {
  let i,
    len,
    msg = [],
    ssFolder = path.join(process.env.HOME, 'Library', 'Preferences', 'ByHost');

  waterfall(
    [
      function (done) {
        const questions = [
          {
            type: 'confirm',
            name: 'change',
            message:
              'Screensaver configuration files will be cleaned, continue?',
            default: true
          }
        ];
        inquirer.prompt(questions).then(function (answers) {
          if (answers.change) {
            return done();
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      },
      function (done) {
        glob(
          `${ssFolder}/com.apple.screensaver*`,
          {
            nosort: true,
            nocase: true
          },
          function (err, files) {
            // removing the old screensaver configurations
            if (!err && files) {
              len = files.length;
              for (i = 0; i < len; i++) {
                backup(path.join(ssFolder, path.basename(files[i])));
                fs.removeSync(path.join(ssFolder, path.basename(files[i])));
              }
            }
            msg.push('Screensaver configuration files have been cleaned.');
            msg.push(
              'Please logout or restart before accessing the\nscreensaver configuration panel again.'
            );
            log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
            done();
          }
        );
      }
    ],
    function (err) {
      callback(err, options);
    }
  );
}

module.exports = {
  fix: _fixScreensaverSettings,
  install: _installScreensavers
};
