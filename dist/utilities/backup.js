'use strict';const _=require('lodash/core'),moment=require('moment'),path=require('path'),fs=require('fs-extra'),log=require('fedtools-logs'),cmd=require('fedtools-commands'),BACKUPDIR=path.join(process.env.HOME,'.envtools','backups');module.exports=function(a,b){let c;const d=path.join(BACKUPDIR,moment().format('MMDDYYYY-HH[h]mm[m]'));b=b||!1,b&&(log.echo(),log.notice('All existing files that could be updated are going to be backed up...'),log.notice(`Backup directory: ${d}`),log.echo()),fs.ensureDirSync(d),c=_.isArray(a)?a.join('" "'):a;const e=`cp -Rf "${c}"  "${d}"`;cmd.run(e,{verbose:b,status:b})};