'use strict';const _=require('lodash'),util=require('util'),utilities=require('fedtools-utilities'),log=require('fedtools-logs'),common=require('../common'),EnvtoolsBase=require('./base'),EnvtoolsHelp=function(){EnvtoolsBase.call(this)};util.inherits(EnvtoolsHelp,EnvtoolsBase),EnvtoolsHelp.prototype.name='EnvtoolsHelp',EnvtoolsHelp.prototype._initialize=function(){EnvtoolsBase.prototype._initialize.call(this)},EnvtoolsHelp.prototype.printShortUsage=function(a,b){const c=[],d=_.keys(this.commands);c.push(''),a&&c.push(a),c.push(log.strToColor('yellow',this.i18n.t('prompt.parameters')));const e=utilities.wordWrap(d.join(', '),this.CMD_DESC_MAX),f=e.length;for(let d=0;d<f;d+=1)c.push(`  ${e[d]}`);c.push(''),c.push(log.strToColor('yellow',this.i18n.t('prompt.extraHelpTitle'))),c.push(`  ${this.i18n.t('prompt.extraHelpContent')}`),c.push('');const g=b&&b.currentVersion?`v${b.currentVersion}`:null;log.printMessagesInBox(c,common.LOG_COLORS.DEFAULT_BOX,g)},EnvtoolsHelp.prototype.printLongUsage=function(a){const b=_.keys(this.commands),c=b.length,d='  ';let e,f,g,h,k,l,i,j,m,n='';for(a&&log.echo(a),log.echo(this.i18n.t('prompt.parameters')),l=0;l<c;l+=1)for(g=b[l],h=this.commands[b[l]].full,k=this.commands[b[l]].description,e=h?`${d+g} (${h})`:d+g,f=e.length,n=`${log.strToColor('cyan',e)+log.strToColor('white',Array(this.CMD_MAX_LEN-f).join('.'))} `,j=utilities.wordWrap(k,this.CMD_DESC_MAX),log.echo(),log.rainbow(n+j[0]),m=j.length,i=1;i<m;i+=1)log.rainbow(Array(this.CMD_MAX_LEN+1).join(' ')+j[i]);log.echo()},EnvtoolsHelp.prototype.printUsage=function(a,b,c){b.help||'help'===b._[0]?(this.printLongUsage(a),c.printUpgradeIfAny()):(this.printShortUsage(a,c),c.printUpgradeIfAny())},module.exports=function(){return EnvtoolsHelp._instance||new EnvtoolsHelp}();