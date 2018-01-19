'use strict';const execa=require('execa'),log=require('fedtools-logs'),config=require('fedtools-config'),waterfall=require('async/waterfall'),parallel=require('async/parallel'),_=require('lodash'),inquirer=require('inquirer'),common=require('../../common'),NA='N/A',DEFAULT_NPM_REGISTRY='http://registry.npmjs.org/',DEFAULT_YARN_REGISTRY='http://registry.yarnpkg.com';function getEnvProxyStatus(){return{http:process.env.HTTP_PROXY||NA,https:process.env.HTTPS_PROXY||NA,noProxy:process.env.no_proxy||NA}}function runCommand(a,b){let c=NA;const d=a.trim().split(' '),e=d[0];d.shift(),execa(e,d).then((a)=>(c=a.stdout,c&&'undefined'!==c&&'null'!==c||(c=NA),b(null,c))).catch((a)=>b(a,c))}function displayStatus(a){const b=[];let c,d,e,f,g,h,i,j,k;parallel([function(a){const b=common.getExistingNpmrcProfiles();return _.isEmpty(b)?a():(b.enabled&&(j=b.enabled),_.isEmpty(b.available)||(k=b.available.sort()),a())},function(a){i=getEnvProxyStatus(),a()},function(a){runCommand('npm config get registry',function(b,d){c=d,a(b)})},function(a){runCommand('npm config get proxy',function(b,c){e=c,a(b)})},function(a){runCommand('npm config get https-proxy',function(b,c){f=c,a(b)})},function(a){runCommand('yarn config get registry',function(b,c){d=c,a(b)})},function(a){runCommand('yarn config get proxy',function(b,c){g=c,a(b)})},function(a){runCommand('yarn config get https-proxy',function(b,c){h=c,a(b)})}],function(){return b.push(log.strToColor('yellow','Environment')),b.push(`http proxy  : ${i.http}`),b.push(`https proxy : ${i.https}`),i.noProxy.split(',').forEach(function(a,c){0===c?b.push(`no_proxy    : ${a}`):b.push(`              ${a}`)}),b.push(''),b.push(log.strToColor('yellow','NPM Configuration')),b.push(`registry    : ${c}`),b.push(`http proxy  : ${e}`),b.push(`https proxy : ${f}`),b.push(''),b.push(log.strToColor('yellow','Yarn Configuration')),b.push(`registry    : ${d}`),b.push(`http proxy  : ${g}`),b.push(`https proxy : ${h}`),(j||k)&&(b.push(''),b.push(log.strToColor('yellow','Envtools Registry Profile(s)')),!j&&(j=common.NA),b.push(`Current profile    : ${j}`),b.push(`Available profiles : ${k.join(', ')}`)),log.printMessagesInBox(b,common.LOG_COLORS.DEFAULT_BOX),a(null,{npmRegistry:c,npmHttpProxy:e,npmHttpsProxy:f,yarnRegistry:d,yarnHttpProxy:g,yarnHttpsProxy:h,envProxies:i,currentNpmProfile:j,availableNpmProfiles:k})})}function updateRegistry(a,b){waterfall([function(b){runCommand(`npm config set registry ${a}`,function(){b(null)})},function(b){runCommand(`yarn config set registry ${a}`,function(){b(null)})}],function(){log.echo(),log.success(`Registry set to ${a}`),b()})}function setRegistryProxies(a,b,c,d){const e=a?'set':'unset',f=a?[`npm config set proxy ${b}`,`npm config set https-proxy ${c}`]:['npm config delete proxy','npm config delete https-proxy'],g=_.map(f,function(a){return function(b){runCommand(a,function(){b(null)})}});waterfall(g,function(){log.echo(),log.success(`Registry proxies have been ${e}`),d()})}module.exports=function(){const a=666;let b,c;waterfall([function(a){displayStatus(function(b,d){c=d,a(b)})},function(a){b=config.getKey('envtoolsnpmregistries'),b&&b.length||(b=[DEFAULT_NPM_REGISTRY,DEFAULT_YARN_REGISTRY],config.setKey('envtoolsnpmregistries',b)),a()},function(b){return c&&!_.isEmpty(c.availableNpmProfiles)?void common.displayConfirmation('Do you want to activate an existing Profile?',function(d){return d?b():void common.displayListOfOptions('Please choose one of the following options:',c.availableNpmProfiles,function(c,d){return c?b(1):void common.switchToNpmrcProfile(d,function(c,d){return c?b():(log.success(`\nProfile "${d}" activated!`),b(a))})})}):b()},function(a){common.displayConfirmation('Do you want to update the current registry?',function(b){return b?void waterfall([function(a){common.displayConfirmation('Do you want to save this configuration in a profile?',a)},function(a){common.displayPromptWithInput('Please type a profile name:',function(b,c){b||common.createNpmrcProfile(c,function(b){a(b)})})},function(a){log.success('\nProfile created and active'),a()}],function(){a(b)}):a(b)})},function(a){const c={type:'list',name:'registry',message:'Please choose one of the following options:'};c.choices=b.slice(),c.choices.push({name:'Enter a custom registry',value:'custom'}),inquirer.prompt(c).then(function(c){let d;const e=new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(localhost)|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i),f={type:'input',name:'custom',message:'Type a custom registry (including protocol):',validate(a){return a?!!e.test(a)||'Please enter a valid URL...':'Registry URL cannot be empty...'}};return'custom'===c.registry?void inquirer.prompt(f).then(function(c){return d=c.custom.toLowerCase().trim(),b.push(d),config.setKey('envtoolsnpmregistries',_.uniqWith(b,_.isEqual)),a(null,d)}):(d=c.registry.toLowerCase().trim(),a(null,d))})},function(a,b){common.unsetActiveNpmrcProfile(),updateRegistry(a,b)},function(a){const b=c.envProxies.http||c.npmHttpProxy,d=c.envProxies.https||c.npmHttpsProxy;return b&&d&&b!==common.NA&&d!==common.NA?void common.displayConfirmation('Do you need to enable proxies for this registry?',function(c){return c?setRegistryProxies(!1,null,null,a):setRegistryProxies(!0,b,d,a)}):a()},function(a){common.displayConfirmation('Do you want to save this configuration in a profile?',a)},function(a){common.displayPromptWithInput('Please type a profile name:',function(b,c){b||common.createNpmrcProfile(c,function(b){a(b)})})},function(a){log.success('\nProfile created and active'),a()}],function(b){b&&b!==a&&log.echo('\nBye then!')})};