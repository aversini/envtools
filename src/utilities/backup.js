const _ = require('lodash/core');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const log = require('fedtools-logs');
const cmd = require('fedtools-commands');

const BACKUPDIR = path.join(process.env.HOME, '.envtools', 'backups');

/**
 * Backup files and directories to a unique backup directory.
 * This is to be used when some commands are going to modify
 * some files.
 *
 * @method backup
 * @param {String|Array} backup Files or directory to backup. If more than
 * one is needed, then use an array. The backup directory is located under
 * ~/$ENVDIR/backups and calculated as MMDDYYYYHHmmss.
 * @param {Boolean} [verbose=false] Verbose flag. If true, a notice will be printed.
 */
module.exports = function (backups, verbose) {
  let backupStr;
  const backupDir = path.join(
    BACKUPDIR,
    moment().format('MMDDYYYY-HH[h]mm[m]')
  );

  verbose = verbose || false;

  if (verbose) {
    log.echo();
    log.notice(
      'All existing files that could be updated are going to be backed up...'
    );
    log.notice(`Backup directory: ${backupDir}`);
    log.echo();
  }
  fs.ensureDirSync(backupDir);

  if (_.isArray(backups)) {
    backupStr = backups.join('" "');
  } else {
    backupStr = backups;
  }
  const cmdline = `cp -Rf "${backupStr}"  "${backupDir}"`;
  cmd.run(cmdline, {
    verbose,
    status: verbose
  });
};
