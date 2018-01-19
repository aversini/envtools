'use strict';function _asyncToGenerator(a){return function(){var b=a.apply(this,arguments);return new Promise(function(a,c){function d(e,f){try{var g=b[e](f),h=g.value}catch(a){return void c(a)}return g.done?void a(h):Promise.resolve(h).then(function(a){d('next',a)},function(a){d('throw',a)})}return d('next')})}}const _=require('lodash'),execa=require('execa'),moment=require('moment'),fs=require('fs-extra'),cmd=require('fedtools-commands'),common=require('../../common'),DOWNLOAD_URL_TIMEOUT=3e3,MAX_DIGITS=2,MILLISECONDS_IN_SECOND=1e3,BYTES_IN_MEGABYTES=1024,BYTES_IN_GIGABYTES=BYTES_IN_MEGABYTES*BYTES_IN_MEGABYTES*BYTES_IN_MEGABYTES;function getDefaultRoute(){let a;return common.isMac()&&(a=cmd.run('route -n get default | grep interface | awk \'{print $2}\'',{status:!1}),a&&a.stdout&&(a=a.stdout.replace(/\n$/,''))),a}function getInternalIp(){let a,b;return common.isMac()&&(a=getDefaultRoute(),a&&(b=cmd.run(`ifconfig ${a} inet | grep inet | awk '{print $2}'`,{status:!1}),b&&b.stdout&&(b=b.stdout.replace(/\n$/,'')))),b}function getPublicIp(a){const b=require('download');let c={};process.env.NODE_TLS_REJECT_UNAUTHORIZED='0',b('https://api.ipify.org',{timeout:process.env.https_proxy?null:DOWNLOAD_URL_TIMEOUT,retries:0}).then(function(b){return b&&(c=b.toString()),a(null,c)}).catch(function(b){return a(b,c)})}function parseMavenInformation(a){const b={};return _.forEach(a.split('\n'),function(a){a.match('Apache Maven ')&&(b.mavenVersion=a.slice(0,a.indexOf(' (')).trim()),a.match('Maven home:')&&(b.mavenHome=a.replace('Maven home:','').trim()),a.match('Java version:')&&(b.javaVersion=a.replace('Java version:','').trim()),a.match('Java home:')&&(b.javaHome=a.replace('Java home:','').trim())}),b}function getMacVersion(a){const b=require('semver'),c=require('macos-release'),d=c().version,e=b.minor(a);return e?`${d}.${e}`:d}function getDiskSpace(a){let b;return common.isMac()&&(b='df -PlH'),common.isLinux()&&(b='df -Plh'),b?void cmd.run(b,{status:!1},function(b,c,d){a(b,d?d.replace(/\n$/,''):null)}):a(1)}function getProxyStatus(a){const b=process.env.PROXY_STATUS===common.ON;let c,d,e=common.NA,f=!1;fs.readFile(common.ENVTOOLS.PROXY_STATUS_FILE,function(g,h){!g&&h&&(h=h.toString().replace(/\n$/,''),f=h===common.ON),fs.readFile(common.ENVTOOLS.PROXY_FILE,function(g,h){!g&&h&&(h=h.toString().replace(/\n$/,''),e=h),cmd.run('npm config get registry',{status:!1},function(g,h,i){!g&&i&&(c=i.replace(/\n$/,'')),cmd.run('yarn config get registry',{status:!1},function(g,h,i){return!g&&i&&(d=i.replace(/\n$/,'')),a(null,{proxy:e,localProxyStatus:b,globalProxyStatus:f,npmRegistry:c,yarnRegistry:d})})})})})}const getRegistryInfo=(()=>{var a=_asyncToGenerator(function*(a){try{var b=yield execa('npm',['config','get','registry']);const d=b.stdout;var c=yield execa('yarn',['config','get','registry']);const e=c.stdout;return a(null,{npmRegistry:d,yarnRegistry:e})}catch(b){return a(b)}});return function(){return a.apply(this,arguments)}})();function getSystemInfo(a,b,c){const d=require('os'),e=require('os-name'),f=require('async/parallel'),g=require('fedtools-utilities');let h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y;common.isMac()&&b.os&&(h=getMacVersion(d.release())),b.uptime&&(i=g.formatMillisecondsToHuman(d.uptime()*MILLISECONDS_IN_SECOND)),b.cpu&&(j=d.cpus()[0].model),b.load&&(k=common.isWindows()?null:d.loadavg()),b.memory&&(l=d.totalmem()/BYTES_IN_GIGABYTES,m=d.freemem()/BYTES_IN_GIGABYTES),b.hostname&&(n=d.hostname());const z=process.versions;z.arch=d.arch();const A=a.version.currentVersion;f([function(a){return b.localIp?(o=getInternalIp(),a()):a()},function(a){return b.publicIp?void getPublicIp(function(b,c){!b&&c&&(p=c),a()}):a()},function(a){return b.proxy?void getProxyStatus(function(b,c){b||(r=c),a()}):a()},function(a){getRegistryInfo(function(b,c){b||(s=c),a()})},function(a){return b.disk?void getDiskSpace(function(b,c){b||(q=c),a()}):a()},function(a){cmd.run('npm -v',{status:!1},function(b,c,d){!b&&d&&(t=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('npm root -g',{status:!1},function(b,c,d){!b&&d&&(u=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('yarn --version',{status:!1},function(b,c,d){!b&&d&&(v=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('git --version',{status:!1},function(b,c,d){!b&&d&&(w=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('ruby -v',{status:!1},function(b,c,d){!b&&d&&(x=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('mvn -v',{status:!1},function(b,c,d){!b&&d&&(y=parseMavenInformation(d.replace(/\n$/,''))),a(null)})}],function(a){c(a,{osName:b.os?e():null,osVersion:h,uptime:i,cpuModel:j,loadAverage:k,totalMemory:l,freeMemory:m,hostname:n,localIp:o,publicIp:p,diskSpace:q,proxyData:r,registryData:s,nodeVersions:z,npmVersion:t,npmGlobalRootLocation:u,yarnVersion:v,gitVersion:w,rubyVersion:x,mavenData:y,envtoolsVersion:A})})}function displayResults(a){const b=require('fedtools-logs'),c=[];let d,e;c.push(''),c.push(b.strToColor('yellow','S Y S T E M')),a.osName&&(a.osVersion?c.push(`Operating System  : ${a.osName} (${a.osVersion})`):c.push(`Operating System  : ${a.osName}`)),a.hostname&&c.push(`Hostname          : ${a.hostname}`),a.cpuModel&&c.push(`Processor         : ${a.cpuModel}`),0<=a.totalMemory&&c.push(`Memory            : ${a.totalMemory.toFixed(MAX_DIGITS)} GB`),c.push(''),c.push(b.strToColor('yellow','E N V I R O N M E N T')),a.uptime&&c.push(`Uptime            : ${a.uptime}`),a.loadAverage&&c.push(`Load average      : ${a.loadAverage.map(function(a){return a.toFixed(MAX_DIGITS)}).join(', ')}`),0<=a.freeMemory&&c.push(`Memory used       : ${(a.totalMemory-a.freeMemory).toFixed(MAX_DIGITS)} GB (${a.freeMemory.toFixed(MAX_DIGITS)} GB free)`),a.localIp&&c.push(`Local IP address  : ${a.localIp}`),a.publicIp?c.push(`Public IP address : ${a.publicIp}`):c.push('Public IP address : use --publicIp flag to show'),a.proxyData&&(c.push(''),c.push(b.strToColor('yellow','P R O X Y')),d=a.proxyData.localProxyStatus===a.proxyData.globalProxyStatus?a.proxyData.localProxyStatus?'enabled':'disabled':a.proxyData.localProxyStatus?'enabled, but only in current window':'disabled, but only in current window',c.push(`Proxy             : ${a.proxyData.proxy}`),a.proxyData.proxy!==common.NA&&c.push(`Proxy status      : ${d}`)),a.registryData&&(c.push(''),c.push(b.strToColor('yellow','N P M  R E G I S T R Y')),a.registryData.npmRegistry&&c.push(`Npm registry      : ${a.proxyData.npmRegistry}`),a.registryData.yarnRegistry&&c.push(`Yarn registry     : ${a.proxyData.yarnRegistry}`)),common.isMac()&&a.diskSpace&&(c.push(''),c.push(b.strToColor('yellow','F I L E  S Y S T E M')),c.push(a.diskSpace)),c.push(''),c.push(b.strToColor('yellow','V E R S I O N S')),c.push(`Node              : ${a.nodeVersions.node} (${a.nodeVersions.arch}, v8 ${a.nodeVersions.v8}, module ${a.nodeVersions.modules})`),c.push(`Npm               : ${a.npmVersion}`),a.yarnVersion&&c.push(`Yarn              : ${a.yarnVersion}`),a.gitVersion&&c.push(`Git               : ${a.gitVersion.replace('git version ','').trim()}`),a.rubyVersion&&c.push(`Ruby              : ${a.rubyVersion.slice(0,a.rubyVersion.indexOf(' [')).replace('ruby','').trim()}`),a.mavenData&&a.mavenData.mavenVersion&&c.push(`Maven             : ${a.mavenData.mavenVersion.replace('Apache Maven','').trim()}`),a.mavenData&&a.mavenData.javaVersion&&c.push(`Java              : ${a.mavenData.javaVersion}`),c.push(`Envtools          : ${a.envtoolsVersion}`),c.push(''),c.push(b.strToColor('yellow','L O C A T I O N S')),a.npmGlobalRootLocation&&c.push(`Npm root location : ${a.npmGlobalRootLocation.replace(process.env.HOME,'~')}`),a.mavenData&&a.mavenData.mavenHome&&c.push(`Maven location    : ${a.mavenData.mavenHome.replace(process.env.HOME,'~')}`),c.push(''),a.expiration?(e=moment(a.expiration).diff(moment())/MILLISECONDS_IN_SECOND,c.push(''),b.printMessagesInBox(c,common.LOG_COLORS.DEFAULT_BOX,`Last update: ${moment(a.lastUpdate).format('hh:mm:ssa')} (next update in ${e.toFixed(0)}s)`)):b.printMessagesInBox(c,common.LOG_COLORS.DEFAULT_BOX)}module.exports=function(a,b){const c={force:!!_.isBoolean(b.force)&&b.force,all:!!_.isBoolean(b.all)&&b.all,os:!_.isBoolean(b.os)||b.os,uptime:!_.isBoolean(b.uptime)||b.uptime,cpu:!_.isBoolean(b.cpu)||b.cpu,load:!_.isBoolean(b.load)||b.load,memory:!_.isBoolean(b.memory)||b.memory,hostname:!_.isBoolean(b.hostname)||b.hostname,localIp:!_.isBoolean(b.localIp)||b.localIp,publicIp:!!_.isBoolean(b.publicIp)&&b.publicIp,disk:!_.isBoolean(b.disk)||b.disk,proxy:!_.isBoolean(b.proxy)||b.proxy,nodeVersions:!0,npmVersion:!0,npmGlobalRootLocation:!0,yarnVersion:!0,gitVersion:!0,rubyVersion:!0,mavenData:!0,envtoolsVersion:!0};let d={};if(c.all&&_.each(c,function(a,b){c[b]=!0}),c.publicIp||c.force)d.expiration=moment().subtract(1,'d');else try{d=JSON.parse(fs.readFileSync(common.ENVTOOLS.SYSTEM_INFO))}catch(a){d.expiration=moment().subtract(1,'d')}moment().isAfter(d.expiration)?getSystemInfo(a,c,function(a,b){if(a)throw a;else b.lastUpdate=moment(),b.expiration=moment().add(1,'m'),displayResults(b),fs.writeFileSync(common.ENVTOOLS.SYSTEM_INFO,JSON.stringify(b,null,common.NB_SPACES_FOR_TAB))}):displayResults(d)};