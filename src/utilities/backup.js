const _ = require('lodash/core');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');

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
 */
module.exports = (backups) => {
  let backupStr;
  const backupDir = path.join(
    BACKUPDIR,
    moment().format('MMDDYYYY-HH[h]mm[m]')
  );

  fs.ensureDirSync(backupDir);

  if (_.isArray(backups)) {
    backupStr = backups.join('" "');
  } else {
    backupStr = backups;
  }
  try {
    execa.shellSync(`cp -Rf "${backupStr}"  "${backupDir}"`);
  } catch (e) {
    // nothing to declare
  }
  return backupDir;
};
