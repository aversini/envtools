var
  path = require('path'),
  fs = require('fs-extra'),
  utilities = require('fedtools-utilities'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  common = require('../../common');

module.exports = function (self) {
  var
    msg = [],
    destDir,
    tmpDir,
    version = self.version.currentVersion,
    destFile = 'envlite-' + version + '.tgz',
    shortName = path.basename(destFile);

  tmpDir = utilities.getTemporaryDir('envlite-' + version);
  destDir = path.join(tmpDir, 'envlite');
  fs.ensureDirSync(destDir);
  fs.copy(common.ENVTOOLS.SHELLDIR, destDir, function (err) {
    if (err) {
      log.red(err);
    } else {
      cmd.run('tar czf ' + destFile + ' envlite', {
        status: false,
        pwd: tmpDir
      }, function (err, stderr) {
        if (err) {
          if (stderr) {
            log.red(stderr);
          } else {
            log.red(err);
          }
        } else {
          fs.copy(path.join(tmpDir, destFile), path.join(process.cwd(), destFile), function (err) {
            if (err) {
              log.red(err);
            } else {
              msg.push(log.strToColor('cyan', 'ENVTOOLS LITE\n'));
              msg.push('A compressed file has been created and deposited in the current folder.');
              msg.push('The file name is ' + log.strToColor('yellow', shortName));
              msg.push('');
              msg.push(log.strToColor('cyan', 'WHAT IS IT?\n'));
              msg.push('It contains a very limited subset of envtools, the bare minimum to at least');
              msg.push('have a decent prompt, as well as a few core aliases (ll, etc.)');
              msg.push('It does not have any of envtools node capabilities since the package only');
              msg.push('contains shell scripts helpers.');
              msg.push('');
              msg.push(log.strToColor('cyan', 'HOW TO USE IT?\n'));
              msg.push('1) copy the generated tar.gz file on the destination machine');
              msg.push(log.strToColor('yellow', ' $ scp ' + shortName + ' remoteServerName:\n'));
              msg.push('2) login to the remote machine and untar the file');
              msg.push(log.strToColor('yellow', ' $ ssh remoteServerName'));
              msg.push(log.strToColor('yellow', ' $ tar xf ' + shortName + '\n'));
              msg.push('3) Add the following lines to your profile (.bashrc or .bash_profile)');
              msg.push(log.strToColor('yellow', ' ENVTOOLS_LITE=1 && source "$HOME/envlite/load.sh"'));
              log.printMessagesInBox(msg, 'green');
            }
          });
        }
      });
    }
  });
};
