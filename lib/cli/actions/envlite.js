const path = require('path');
const fs = require('fs-extra');
const utilities = require('fedtools-utilities');
const cmd = require('fedtools-commands');
const log = require('fedtools-logs');
const common = require('../../common');

module.exports = function (self) {
  const msg = [];
  const version = self.version.currentVersion;
  const destFile = `envlite-${version}.tgz`;
  const shortName = path.basename(destFile);

  const tmpDir = utilities.getTemporaryDir(`envlite-${version}`);
  const destDir = path.join(tmpDir, 'envlite');
  fs.ensureDirSync(destDir);
  fs.copy(common.ENVTOOLS.SHELLDIR, destDir, function (err) {
    if (err) {
      log.red(err);
    } else {
      fs.writeFileSync(path.join(destDir, 'version'), common.ENVTOOLS.VERSION);
      cmd.run(
        `tar czf ${destFile} envlite`,
        {
          status: false,
          pwd: tmpDir
        },
        function (err, stderr) {
          if (err) {
            if (stderr) {
              log.red(stderr);
            } else {
              log.red(err);
            }
          } else {
            fs.copy(
              path.join(tmpDir, destFile),
              path.join(process.cwd(), destFile),
              function (err) {
                if (err) {
                  log.red(err);
                } else {
                  msg.push('');
                  msg.push(log.strToColor('yellow', 'ENVTOOLS LITE\n'));
                  msg.push(
                    'A compressed file has been created and deposited in the current folder.'
                  );
                  msg.push(
                    `The file name is ${log.strToColor('yellow', shortName)}`
                  );
                  msg.push('');
                  msg.push(log.strToColor('yellow', 'WHAT IS IT?\n'));
                  msg.push(
                    'It contains a very limited subset of envtools, the bare minimum to at least'
                  );
                  msg.push(
                    'have a decent prompt, as well as a few core aliases (ll, etc.)'
                  );
                  msg.push(
                    'It does not have any of envtools node capabilities since the package only'
                  );
                  msg.push('contains shell scripts helpers.');
                  msg.push('');
                  msg.push(log.strToColor('yellow', 'HOW TO USE IT?\n'));
                  msg.push(
                    '1) copy the generated tar.gz file on the destination machine'
                  );
                  msg.push(
                    log.strToColor(
                      'blue',
                      ` $ scp ${shortName} remoteServerName:\n`
                    )
                  );
                  msg.push('2) login to the remote machine and untar the file');
                  msg.push(log.strToColor('blue', ' $ ssh remoteServerName'));
                  msg.push(
                    log.strToColor('blue', ` $ tar xf ${shortName}\n`)
                  );
                  msg.push(
                    '3) Add the following lines to your profile (.bashrc or .bash_profile)'
                  );
                  msg.push(
                    log.strToColor(
                      'blue',
                      ' ENVTOOLS_LITE=1 && source "$HOME/envlite/load.sh"'
                    )
                  );
                  msg.push('');
                  log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
                }
              }
            );
          }
        }
      );
    }
  });
};
