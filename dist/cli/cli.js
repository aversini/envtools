'use strict';var common=require('../common'),util=require('util'),log=require('fedtools-logs'),config=require('fedtools-config'),EnvtoolsBase=require('./base'),EnvtoolsCLI=function(){EnvtoolsBase.call(this)};util.inherits(EnvtoolsCLI,EnvtoolsBase),EnvtoolsCLI.prototype.name='EnvtoolsCLI',EnvtoolsCLI.prototype._initialize=function(){EnvtoolsBase.prototype._initialize.call(this),this.help=require('./help'),this.version=require('./version'),this.config=this.packageJson.config,this.name=this.packageJson.name,this.write=!0,config.init(this.config)},EnvtoolsCLI.prototype._runCommand=function(a,b,c){var d=this;d.help.help?(log.debug('call for help with command: ',b),b?require('./actions/help')(d,b):require('./actions/default')(d,a,c)):'npmrc'===b||'yarnrc'===b?require('./actions/npmrc')(d,a):'registry'===b?require('./actions/registry')(d,a):'smtp'===b||'smtp-server'===b||'smtpserver'===b?require('./actions/smtp-server')(d,a):'info'===b||'system'===b?require('./actions/info')(d,a):'config'===b?require('../bootstrap/plugins/envtools')({version:d.version},function(){}):'notif'===b||'notifier'===b||'alert'===b||'growl'===b?require('./actions/notifier')(d,a):'timer'===b||'t'===b?require('./actions/timer')(d,a):'encrypt'===b||'encipher'===b?(a.encrypt=!0,require('./actions/crypto')(d,a)):'decrypt'===b||'decipher'===b?(a.encrypt=!1,require('./actions/crypto')(d,a)):'http'===b||'web'===b||'wup'===b||'http-server'===b?require('./actions/http-server')(d,a):'update'===b||'check'===b||'up'===b||'upgrade'===b?d.version.printUpgradeIfAny(!0):'sinopia'===b?require('./actions/sinopia')(d,a):'auto'===b||'automatic'===b||'boot'===b||'bootstrap'===b||'a'===b?require('./actions/bootstrap')(d,'auto',a,function(a){a||d.version.printUpgradeIfAny()}):'manual'===b||'configure'===b||'setup'===b||'m'===b?require('./actions/bootstrap')(d,'manual',a,function(a){a||d.version.printUpgradeIfAny()}):'extra'===b||'xtra'===b||'e'===b||'x'===b?require('./actions/bootstrap')(d,'extra',a,function(a){a||d.version.printUpgradeIfAny()}):'lite'===b||'envlite'===b||'envtools-lite'===b?require('./actions/envlite')(d,a):'wt'===b?require('./actions/testing-only')(d,a):'sds'===b?require('./actions/sds')(d,a):(log.debug('default case...'),require('./actions/default')(d,a,c))},EnvtoolsCLI.prototype.parseCommandLine=function(){var a,b=this,c=require('optimist').usage(log.strToColor('yellow','Usage: ')+b.name+' [options] command').alias('v','version').describe('v',b.i18n.t('help.v')).alias('b','boring').describe('b',b.i18n.t('help.b')).alias('d','debug').describe('d',b.i18n.t('help.d')).alias('h','help').describe('h',b.i18n.t('help.h')).boolean(['b','d','V','v','h','n']),d=c.argv;log.boring=d.boring||!1,b.debug=log.verbose=d.debug||!1,(d.r||d.remote)&&(b.remote=log.remote=!0),!1===d.write&&(b.write=!1),'help'===d._[0]&&d._[1]?(b.help.help=!0,a=d._[1]):a=d._[0],log.debug('program: ',d),log.debug('command: ',a),common.createRuntimeDir(function(){b._runCommand(d,a,c)})},module.exports=function(){return EnvtoolsCLI._instance||new EnvtoolsCLI}();