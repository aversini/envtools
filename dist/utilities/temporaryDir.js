'use strict';const _=require('lodash'),fs=require('fs-extra'),path=require('path'),os=require('os'),common=require('../common');module.exports=(a,b)=>{let c,d;return c=_.isString(b)&&fs.existsSync(b)?path.resolve(b):common.isLinux()||common.isMac()?fs.existsSync('/repo')?'/repo':'/tmp':os.tmpdir(),d=path.join(c,'envtools-tmp'),a&&(d=path.join(d,a)),fs.ensureDirSync(d),d};