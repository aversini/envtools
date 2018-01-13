'use strict';var fs=require('fs-extra'),waterfall=require('async/waterfall'),inquirer=require('inquirer'),path=require('path'),download=require('download'),log=require('fedtools-logs'),common=require('../../common'),MAVEN_VERSION='3.3.9',MAVEN_DEST_DIR=path.join(common.RUNTIME_DIR,'apache-maven-'+MAVEN_VERSION),MAVEN_BIN_URL='http://archive.apache.org/dist/maven/maven-3/'+MAVEN_VERSION+'/binaries/apache-maven-'+MAVEN_VERSION+'-bin.zip',MAVEN_USER_SETTINGS_DST=path.join(process.env.HOME,'.m2');module.exports=function(a,b){function c(a,b){var c=[];a?c=a:c.push('Before using Maven, you need to restart your session.'),process.env.ENVTOOLS_VERSION&&(c.push(''),c.push(log.strToColor('cyan','Hint:')+' type r ENTER or just restart your terminal...')),log.echo(),log.printMessagesInBox(c,b?b:common.LOG_COLORS.SUCCESS)}var d;waterfall([function(a){process.env.RUNTIME_DIR||(process.env.RUNTIME_DIR=path.join(process.env.HOME,'.envtools')),common.createRuntimeDir(a)},function(a){fs.ensureDir(MAVEN_USER_SETTINGS_DST,function(){a()})},function(b){return d=MAVEN_DEST_DIR,fs.existsSync(d)?(a.auto||c(['Maven is already installed...','Before using it, you may need to restart your session.'],common.LOG_COLORS.WARNING),b(common.USER_IGNORE)):b()},function(b){inquirer.prompt({type:'confirm',message:'About to install Maven '+MAVEN_VERSION+', continue?',name:'goForIt',default:!0}).then(function(c){return a.actionsPending++,c.goForIt?(a.actionsDone++,b(null,!0)):b(null,!1)})},function(a,b){return a?void download(MAVEN_BIN_URL,common.RUNTIME_DIR,{mode:'755',extract:!0}).then(function(){b()},function(a){log.error('Unable to download Maven...'),log.echo(a),b(common.USER_IGNORE)}):b(common.USER_INTERRUPT)},function(b){a.needToCheckForMaven=!1,a.auto||c(),b(common.USER_IGNORE)}],function(c){c&&(c===common.USER_INTERRUPT||c===common.USER_IGNORE)&&a.auto&&(c=null),b(c,a)})};