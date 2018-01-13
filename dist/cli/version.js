'use strict';var _=require('lodash'),util=require('util'),moment=require('moment'),path=require('path'),log=require('fedtools-logs'),config=require('fedtools-config'),common=require('../common'),EnvtoolsBase=require('./base'),EnvtoolsVersion=function(){EnvtoolsBase.call(this)};util.inherits(EnvtoolsVersion,EnvtoolsBase),EnvtoolsVersion.prototype.name='EnvtoolsVersion',EnvtoolsVersion.prototype._initialize=function(){var a=!1,b=!1;EnvtoolsBase.prototype._initialize.call(this),this.currentVersion=this.packageJson.version;var c=this._getConfiguration();c&&c[common.ENVTOOLS.CFG_AUTOCHECK]===common.ON&&(a=!0),a&&c&&c.expiration?moment().isAfter(c.expiration)&&(b=!0):b=a,b&&require('child_process').spawn(process.execPath,[path.join(__dirname,'..','..','bin','check.js')],{detached:!0,stdio:'ignore'}).unref()},EnvtoolsVersion.prototype._getConfiguration=function(){return config.getKey('envtoolsversion')},EnvtoolsVersion.prototype.setAutoCheck=function(a){var b={};b[common.ENVTOOLS.CFG_AUTOCHECK]=a,config.setKey('envtoolsversion',_.extend(this._getConfiguration(),b),!0,!0)},EnvtoolsVersion.prototype.getAutoCheck=function(){var a=this._getConfiguration();return a?a[common.ENVTOOLS.CFG_AUTOCHECK]?a[common.ENVTOOLS.CFG_AUTOCHECK]:common.OFF:common.OFF},EnvtoolsVersion.prototype.printUpgradeIfAny=function(a){function b(a,b){return log.echo(),log.printMessagesInBox(a,b?b:common.LOG_COLORS.DEFAULT_BOX),log.echo(),!0}var c,d=this,e=[],f=245,g=this._getConfiguration()||{},h='There is no data available at this time.\nPlease check again later...',i='Automatically check for update is disabled.\nYou can enable this option by typing '+log.strToColor(f,'envtools config')+'\nand following the instructions at the prompt.';if(a&&!g)return b([h]);if(a&&g&&g[common.ENVTOOLS.CFG_AUTOCHECK]!==common.ON)return b([i]);if(g&&g.latest)require('semver').gt(g.latest,d.currentVersion)?(c='cyan',e.push(''),e.push('A new version of Envtools has been published!'),e.push('Envtools '+log.strToColor('green',g.latest)+' is now available - you have '+log.strToColor(f,d.currentVersion)),e.push('Type '+log.strToColor(f,'npm install -g envtools')+' to upgrade.'),e.push('')):a&&(c='green',e.push(''),e.push('You are up-to-date!'+' ('+d.currentVersion+')'),e.push(''));else if(a)return b([h]);return e.length&&(!g.alreadyDisplayed||a)?(config.setKey('envtoolsversion',_.extend(g,{alreadyDisplayed:!0}),!0,!0),b(e,c)):void 0},EnvtoolsVersion.prototype.printCurrentVersion=function(a,b){this.printUpgradeIfAny()||(log.echo(),log.printMessagesInBox(['',this.i18n.t('version.installed')+log.strToColor('green',this.currentVersion),''],common.LOG_COLORS.DEFAULT_BOX),log.echo()),b()},module.exports=function(){return EnvtoolsVersion._instance||new EnvtoolsVersion}();