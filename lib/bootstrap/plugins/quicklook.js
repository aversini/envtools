var
  fs = require('fs-extra'),
  waterfall = require('async/waterfall'),
  path = require('path'),
  glob = require('glob'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../../common');

module.exports = function (options, callback) {
  var
    destFolder = path.join(process.env.HOME, 'Library', 'QuickLook'),
    srcFolder = path.join(common.ENVTOOLS.THIRDDIR, 'quicklook');

  waterfall([
    function (done) {
      if (!fs.existsSync(destFolder)) {
        // folder doesn't exist, let's create it
        fs.ensureDir(destFolder, function (err) {
          done(err);
        });
      } else {
        // folder already exists, need to backup first
        backup(destFolder);
        return done();
      }
    },
    function (done) {
      var
        i,
        len;
      glob(srcFolder + '/*.qlgenerator', {}, function (err, plugins) {
        // removing the old ones if any
        // (but only the ones that are going to be re-installed)
        if (!err && plugins) {
          len = plugins.length;
          for (i = 0; i < len; i++) {
            fs.removeSync(path.join(destFolder, path.basename(plugins[i])));
          }
        }
        done(err);
      });
    },
    function (done) {
      // copy new ones instead
      fs.copy(srcFolder, destFolder, done);
    },
    function (done) {
      // tell the system to load the new plugins
      cmd.run('qlmanage -r', {
        status: false
      }, done);
    }
  ], function (err) {
    if (!err) {
      log.success('QuickLook Plugins successfully installed');
    }
    callback(err, options);
  });
};
