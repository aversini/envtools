'use strict';var _=require('lodash'),moment=require('moment'),fs=require('fs-extra'),cmd=require('fedtools-commands'),common=require('../../common'),DOWNLOAD_URL_TIMEOUT=3e3,MAX_DIGITS=2,MILLISECONDS_IN_SECOND=1e3,BYTES_IN_MEGABYTES=1024,BYTES_IN_GIGABYTES=BYTES_IN_MEGABYTES*BYTES_IN_MEGABYTES*BYTES_IN_MEGABYTES;function getDefaultRoute(){var a;return common.isMac()&&(a=cmd.run('route -n get default | grep interface | awk \'{print $2}\'',{status:!1}),a&&a.stdout&&(a=a.stdout.replace(/\n$/,''))),a}function getInternalIp(){var a,b;return common.isMac()&&(a=getDefaultRoute(),a&&(b=cmd.run('ifconfig '+a+' inet | grep inet | awk \'{print $2}\'',{status:!1}),b&&b.stdout&&(b=b.stdout.replace(/\n$/,'')))),b}function getPublicIp(a){var b=require('download'),c={};process.env.NODE_TLS_REJECT_UNAUTHORIZED='0',b('https://api.ipify.org',{timeout:process.env.https_proxy?null:DOWNLOAD_URL_TIMEOUT,retries:0}).then(function(b){return b&&(c=b.toString()),a(null,c)}).catch(function(b){return a(b,c)})}function parseMavenInformation(a){var b={};return _.forEach(a.split('\n'),function(a){a.match('Apache Maven ')&&(b.mavenVersion=a.slice(0,a.indexOf(' (')).trim()),a.match('Maven home:')&&(b.mavenHome=a.replace('Maven home:','').trim()),a.match('Java version:')&&(b.javaVersion=a.replace('Java version:','').trim()),a.match('Java home:')&&(b.javaHome=a.replace('Java home:','').trim())}),b}function getMacVersion(a){var b=require('semver'),c=require('macos-release'),d=c().version,e=b.minor(a);return e?d+'.'+e:d}function getDiskSpace(a){var b;return common.isMac()&&(b='df -PlH'),common.isLinux()&&(b='df -Plh'),b?void cmd.run(b,{status:!1},function(b,c,d){a(b,d?d.replace(/\n$/,''):null)}):a(1)}function getProxyStatus(a){var b,c,d=common.NA,e=!1,f=!1,g=process.env.PROXY_STATUS===common.ON;fs.readFile(common.ENVTOOLS.PROXY_STATUS_FILE,function(h,i){!h&&i&&(i=i.toString().replace(/\n$/,''),f=i===common.ON),fs.readFile(common.ENVTOOLS.PROXY_FILE,function(h,i){!h&&i&&(i=i.toString().replace(/\n$/,''),d=i),fs.readFile(common.ENVTOOLS.SINOPIA_STATUS,function(h,i){!h&&i&&(i=i.toString().replace(/\n$/,''),e=i===common.ON),cmd.run('npm config get registry',{status:!1},function(h,i,j){!h&&j&&(b=j.replace(/\n$/,'')),cmd.run('yarn config get registry',{status:!1},function(h,i,j){return!h&&j&&(c=j.replace(/\n$/,'')),a(null,{proxy:d,sinopiaStatus:e,localProxyStatus:g,globalProxyStatus:f,npmRegistry:b,yarnRegistry:c})})})})})})}function getSystemInfo(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w=require('os'),x=require('os-name'),y=require('async/parallel'),z=require('fedtools-utilities');common.isMac()&&b.os&&(d=getMacVersion(w.release())),b.uptime&&(e=z.formatMillisecondsToHuman(w.uptime()*MILLISECONDS_IN_SECOND)),b.cpu&&(f=w.cpus()[0].model),b.load&&(g=common.isWindows()?null:w.loadavg()),b.memory&&(h=w.totalmem()/BYTES_IN_GIGABYTES,i=w.freemem()/BYTES_IN_GIGABYTES),b.hostname&&(j=w.hostname()),o=process.versions,o.arch=w.arch(),v=a.version.currentVersion,y([function(a){return b.localIp?(k=getInternalIp(),a()):a()},function(a){return b.publicIp?void getPublicIp(function(b,c){!b&&c&&(l=c),a()}):a()},function(a){return b.proxy?void getProxyStatus(function(b,c){b||(n=c),a()}):a()},function(a){return b.disk?void getDiskSpace(function(b,c){b||(m=c),a()}):a()},function(a){cmd.run('npm -v',{status:!1},function(b,c,d){!b&&d&&(p=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('npm root -g',{status:!1},function(b,c,d){!b&&d&&(q=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('yarn --version',{status:!1},function(b,c,d){!b&&d&&(r=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('git --version',{status:!1},function(b,c,d){!b&&d&&(s=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('ruby -v',{status:!1},function(b,c,d){!b&&d&&(t=d.replace(/\n$/,'')),a(null)})},function(a){cmd.run('mvn -v',{status:!1},function(b,c,d){!b&&d&&(u=parseMavenInformation(d.replace(/\n$/,''))),a(null)})}],function(a){c(a,{osName:b.os?x():null,osVersion:d,uptime:e,cpuModel:f,loadAverage:g,totalMemory:h,freeMemory:i,hostname:j,localIp:k,publicIp:l,diskSpace:m,proxyData:n,nodeVersions:o,npmVersion:p,npmGlobalRootLocation:q,yarnVersion:r,gitVersion:s,rubyVersion:t,mavenData:u,envtoolsVersion:v})})}function displayResults(a){var b,c,d=require('fedtools-logs'),e=[];e.push(''),e.push(d.strToColor('yellow','S Y S T E M')),a.osName&&(a.osVersion?e.push('Operating System  : '+a.osName+' ('+a.osVersion+')'):e.push('Operating System  : '+a.osName)),a.hostname&&e.push('Hostname          : '+a.hostname),a.cpuModel&&e.push('Processor         : '+a.cpuModel),0<=a.totalMemory&&e.push('Memory            : '+a.totalMemory.toFixed(MAX_DIGITS)+' GB'),e.push(''),e.push(d.strToColor('yellow','E N V I R O N M E N T')),a.uptime&&e.push('Uptime            : '+a.uptime),a.loadAverage&&e.push('Load average      : '+a.loadAverage.map(function(a){return a.toFixed(MAX_DIGITS)}).join(', ')),0<=a.freeMemory&&e.push('Memory used       : '+(a.totalMemory-a.freeMemory).toFixed(MAX_DIGITS)+' GB ('+a.freeMemory.toFixed(MAX_DIGITS)+' GB free)'),a.localIp&&e.push('Local IP address  : '+a.localIp),a.publicIp?e.push('Public IP address : '+a.publicIp):e.push('Public IP address : use --publicIp flag to show'),a.proxyData&&(e.push(''),e.push(d.strToColor('yellow','P R O X Y')),b=a.proxyData.localProxyStatus===a.proxyData.globalProxyStatus?a.proxyData.localProxyStatus?'enabled':'disabled':a.proxyData.localProxyStatus?'enabled, but only in current window':'disabled, but only in current window',e.push('Proxy             : '+a.proxyData.proxy),a.proxyData.proxy!==common.NA&&e.push('Proxy status      : '+b),b=a.proxyData.sinopiaStatus?'proxied through sinopia':'direct to registry',e.push('Npm               : '+b),a.proxyData.npmRegistry&&e.push('Npm registry      : '+a.proxyData.npmRegistry),a.proxyData.yarnRegistry&&e.push('Yarn registry     : '+a.proxyData.yarnRegistry)),common.isMac()&&a.diskSpace&&(e.push(''),e.push(d.strToColor('yellow','F I L E  S Y S T E M')),e.push(a.diskSpace)),e.push(''),e.push(d.strToColor('yellow','V E R S I O N S')),e.push('Node              : '+a.nodeVersions.node+' ('+a.nodeVersions.arch+', v8 '+a.nodeVersions.v8+', module '+a.nodeVersions.modules+')'),e.push('Npm               : '+a.npmVersion),a.yarnVersion&&e.push('Yarn              : '+a.yarnVersion),a.gitVersion&&e.push('Git               : '+a.gitVersion.replace('git version ','').trim()),a.rubyVersion&&e.push('Ruby              : '+a.rubyVersion.slice(0,a.rubyVersion.indexOf(' [')).replace('ruby','').trim()),a.mavenData&&a.mavenData.mavenVersion&&e.push('Maven             : '+a.mavenData.mavenVersion.replace('Apache Maven','').trim()),a.mavenData&&a.mavenData.javaVersion&&e.push('Java              : '+a.mavenData.javaVersion),e.push('Envtools          : '+a.envtoolsVersion),e.push(''),e.push(d.strToColor('yellow','L O C A T I O N S')),a.npmGlobalRootLocation&&e.push('Npm root location : '+a.npmGlobalRootLocation.replace(process.env.HOME,'~')),a.mavenData&&a.mavenData.mavenHome&&e.push('Maven location    : '+a.mavenData.mavenHome.replace(process.env.HOME,'~')),e.push(''),a.expiration?(c=moment(a.expiration).diff(moment())/MILLISECONDS_IN_SECOND,e.push(''),d.printMessagesInBox(e,common.LOG_COLORS.DEFAULT_BOX,'Last update: '+moment(a.lastUpdate).format('hh:mm:ssa')+' (next update in '+c.toFixed(0)+'s)')):d.printMessagesInBox(e,common.LOG_COLORS.DEFAULT_BOX)}module.exports=function(a,b){var c={},d={force:!!_.isBoolean(b.force)&&b.force,all:!!_.isBoolean(b.all)&&b.all,os:!_.isBoolean(b.os)||b.os,uptime:!_.isBoolean(b.uptime)||b.uptime,cpu:!_.isBoolean(b.cpu)||b.cpu,load:!_.isBoolean(b.load)||b.load,memory:!_.isBoolean(b.memory)||b.memory,hostname:!_.isBoolean(b.hostname)||b.hostname,localIp:!_.isBoolean(b.localIp)||b.localIp,publicIp:!!_.isBoolean(b.publicIp)&&b.publicIp,disk:!_.isBoolean(b.disk)||b.disk,proxy:!_.isBoolean(b.proxy)||b.proxy,nodeVersions:!0,npmVersion:!0,npmGlobalRootLocation:!0,yarnVersion:!0,gitVersion:!0,rubyVersion:!0,mavenData:!0,envtoolsVersion:!0};if(d.all&&_.each(d,function(a,b){d[b]=!0}),d.publicIp||d.force)c.expiration=moment().subtract(1,'d');else try{c=JSON.parse(fs.readFileSync(common.ENVTOOLS.SYSTEM_INFO))}catch(a){c.expiration=moment().subtract(1,'d')}moment().isAfter(c.expiration)?getSystemInfo(a,d,function(a,b){if(a)throw a;else b.lastUpdate=moment(),b.expiration=moment().add(1,'m'),displayResults(b),fs.writeFileSync(common.ENVTOOLS.SYSTEM_INFO,JSON.stringify(b,null,common.NB_SPACES_FOR_TAB))}):displayResults(c)};