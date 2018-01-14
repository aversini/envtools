'use strict';const _=require('lodash'),chalk=require('chalk'),path=require('path'),fs=require('fs-extra'),waterfall=require('async/waterfall'),inquirer=require('inquirer'),cmd=require('fedtools-commands'),log=require('fedtools-logs'),config=require('fedtools-config'),utilities=require('fedtools-utilities'),Fuse=require('fuse.js'),isMac='darwin'===process.platform,isWindows='win32'===process.platform,isLinux='linux'===process.platform||'freebsd'===process.platform||'openbsd'===process.platform,isZsh=!!process.env.SHELL.match('zsh'),USER_INTERRUPT=-1,USER_WARNING=-2,USER_FATAL=-3,USER_IGNORE=-4,NB_SPACES_FOR_TAB=2,TYPE_SUDO=100,TYPE_CHOWN=200,TYPE_PREFIX=300,ON='ON',OFF='OFF',NA='N/A',NOOP=function(){},RUNTIME_DIR=path.join(process.env.HOME,'.envtools'),RUNTIME_BIN_DIR=path.join(process.env.HOME,'.envtools','bin'),DOT_PROFILE=path.join(process.env.HOME,'.profile'),DOT_BASH_PROFILE=path.join(process.env.HOME,'.bash_profile'),DOT_ZSH_PROFILE=path.join(process.env.HOME,'.zshrc'),DOT='.',NPRMC='npmrc',YARNC='yarnrc',NPMRC_FILE=DOT+NPRMC,YARNRC_FILE=DOT+YARNC,NPMRC_PROFILE_FILE=NPRMC,YARNRC_PROFILE_FILE=YARNC,NPM_CONFIG=path.join(process.env.HOME,NPMRC_FILE),YARN_CONFIG=path.join(process.env.HOME,YARNRC_FILE),ENVTOOLS={NAME:'Envtools',VERSION:process.env.ENVTOOLS_VERSION?`v${process.env.ENVTOOLS_VERSION}`:'',ROOTDIR:path.join(__dirname,'..'),THIRDDIR:path.join(__dirname,'..','data','third'),SHELLDIR:path.join(__dirname,'..','shell'),PROXY_FILE:path.join(RUNTIME_DIR,'proxy'),PROXY_STATUS_FILE:path.join(RUNTIME_DIR,'proxy_status'),SINOPIA_STATUS:path.join(RUNTIME_DIR,'sinopia_status'),HELP_STATUS:path.join(RUNTIME_DIR,'help_status.json'),RESUME_AUTO:path.join(RUNTIME_DIR,'resume_auto'),SYSTEM_INFO:path.join(RUNTIME_DIR,'info.json'),NPMRC_PROFILES:path.join(RUNTIME_DIR,'npmrcs'),NPMRC_CONFIG:path.join(RUNTIME_DIR,'npmrcs.json'),AUTO_DONE:path.join(RUNTIME_DIR,'auto'),DOT_PROFILE_COMMENT:'### Added by Envtools (main loader)',CFG_AUTOLOAD:'autoload',CFG_AUTOLOAD_LABEL:'Automatically load Envtools at each session',CFG_BANNER:'banner',CFG_BANNER_LABEL:'Enable Envtools Welcome Banner',CFG_AUTOCHECK:'autocheck',CFG_AUTOCHECK_LABEL:'Automatically check for new version',CFG_CUSTOM_PROMPT:'prompt',CFG_CUSTOM_PROMPT_LABEL:'Enable Envtools Custom Command Line Prompt'};function _isMac(){return isMac}function _isWindows(){return isWindows}function _isLinux(){return isLinux}function _isZsh(){return isZsh}function _createRuntimeDir(a){const b=path.join(ENVTOOLS.THIRDDIR,'growlnotify','growlnotify.exe'),c=path.join(ENVTOOLS.THIRDDIR,'growlnotify','growlnotify.com'),d=path.join(RUNTIME_BIN_DIR,'growlnotify.exe'),e=path.join(RUNTIME_BIN_DIR,'growlnotify.com');fs.ensureDir(RUNTIME_BIN_DIR,function(f){if(!_isWindows())return a(f);else if(!fs.existsSync(d)||!fs.existsSync(e))fs.copy(b,d,function(){fs.copy(c,e,function(){a()})});else return a()})}function _chownFolder(a,b,c){let d=!0,e=process.env.LOGNAME;return b.auto&&(d=!1),b.debug&&(d=!0),e||(e=cmd.run('whoami',{status:!!b.debug}).output),_.isString(e)&&fs.existsSync(a)?void(e=e.replace('\n',''),cmd.sudo(`chown -R ${e} ${a}`,{name:'Envtools',status:d},function(a,d){a&&d&&(a=d),c(a,b)})):c(null,b)}function _installNpmPackages(a,b,c,d){let e;const f=_.isString(a)?[a]:a,g=config.getKey(config.FEDTOOLSRCKEYS.yarnvsnpm)||'yarn';e='yarn'===g&&b?`${c} global add `:'npm install -g ',waterfall([function(a){const b={type:'list',name:'action',message:'Please choose one of the following options',choices:[{value:TYPE_PREFIX,short:'prefix',name:'Change the default location for global npm installation (preferable)'},{value:TYPE_CHOWN,short:'chown',name:'Change ownership of the default destination folder to YOUR user (preferable)'},{value:TYPE_SUDO,short:'sudo',name:'Install package(s) with sudo to overcome permission issue (not advised)'}]},c=[],d=utilities.getGlobalNodeModulesPath();c.push(d),_.each(f,function(a){c.push(path.join(d,a))}),utilities.isFolderWritable(c,function(c){return c?void(log.warning('Uhoh, destination folder is not writable...'),inquirer.prompt(b).then(function(b){return a(null,d,f,b.action)})):a(null,null,f,!1)})},function(a,b,c,d){const f=_.map(b,function(a){return function(b){const c=a.value?a.value:a,d=cmd.run(e+c,{status:!0});0!==d.code&&d.stderr&&log.rainbow(d.stderr),b()}});if(!1===c)waterfall(f,d);else if(c===TYPE_SUDO)cmd.sudo(e+b.join(' '),{name:'Envtools'},function(a,b){return log.debug(b),a&&log.error('Something went wrong or you did not grant admin access...'),d(a)});else if(c===TYPE_CHOWN)_chownFolder(a,{debug:!1},function(a){log.debug(a),a?log.error('Something went wrong or you did not grant admin access...'):waterfall(f,d)});else if(c===TYPE_PREFIX)cmd.run('npm config set prefix ~/npm',{status:!0},function(a,b){log.debug(a),a?(log.error('Something went wrong...'),b?log.rainbow(b):log.rainbow(a)):waterfall(f,d)});else return d(USER_INTERRUPT)}],function(a){d(a)})}function defaultSortFn(c,a){return c.localeCompare(a)}function _sortObject(a,b){let c;return _.isArray(a)?a.map(function(a){return _sortObject(a,b)}):_.isObject(a)?(c={},Object.keys(a).sort(b||defaultSortFn).forEach(function(d){c[d]=_sortObject(a[d],b)}),c):a}function _displayConfirmation(a,b){log.echo(),inquirer.prompt({type:'confirm',name:'goodToGo',message:a,default:!0}).then(function(a){b(!a.goodToGo)})}function _displayPromptWithInput(a,b){const c={type:'input',name:'input',message:a,validate(a){return!!a||'Entry cannot be empty...'}};log.echo(),inquirer.prompt(c).then(function(a){b(null,a.input)})}function _displayListOfOptions(a,b,c){const d={type:'list',name:'selection',message:a};d.choices=b,log.echo(),inquirer.prompt(d).then(function(a){c(null,a.selection)})}function _getExistingNpmrcProfiles(){try{return JSON.parse(fs.readFileSync(ENVTOOLS.NPMRC_CONFIG))}catch(a){return{available:[]}}}function _unsetActiveNpmrcProfile(){const a=_getExistingNpmrcProfiles();!_.isEmpty(a)&&a.enabled&&(delete a.enabled,fs.writeFileSync(ENVTOOLS.NPMRC_CONFIG,JSON.stringify(a,null,NB_SPACES_FOR_TAB)))}function _updateProfileConfigurationData(a,b){a.enabled=b,a.available=_.union(a.available,[b]),fs.writeFileSync(ENVTOOLS.NPMRC_CONFIG,JSON.stringify(a,null,NB_SPACES_FOR_TAB))}function _createNpmrcProfile(a,b){const c=path.join(ENVTOOLS.NPMRC_PROFILES,a),d=path.join(c,NPMRC_PROFILE_FILE),e=path.join(c,YARNRC_PROFILE_FILE),f=_getExistingNpmrcProfiles();b=b||NOOP,a=a.trim().toLowerCase(),waterfall([function(b){return!_.isEmpty(f)&&f.available&&-1<f.available.indexOf(a)?void(log.warning(`\nProfile "${a}" already exists...`),_displayConfirmation('Do you want to overide it?',b)):b()}],function(g){return g?b(g):(_updateProfileConfigurationData(f,a),fs.ensureDirSync(c),fs.copySync(NPM_CONFIG,d),fs.copySync(YARN_CONFIG,e),b())})}function _fuzzySearch(a,b,c){const d=_.defaults(c,{shouldSort:!0,includeScore:!0,includeMatches:!0,threshold:0.4,location:0,distance:100,maxPatternLength:32,minMatchCharLength:1}),e=new Fuse(b,d),f=e.search(a);return d.closestMatch&&!_.isEmpty(f)&&f.length&&!_.isEmpty(f[0].matches)&&f[0].matches.length?f[0].matches[0].value:f}function _switchToNpmrcProfile(a,b){const c=path.join(ENVTOOLS.NPMRC_PROFILES,a),d=path.join(c,NPMRC_PROFILE_FILE),e=path.join(c,YARNRC_PROFILE_FILE),f=_getExistingNpmrcProfiles();let g;b=b||NOOP,waterfall([function(b){return _.isEmpty(f)||(g=_fuzzySearch(a,f.available,{closestMatch:!0})),_.isString(g)?void _displayConfirmation(`About to switch to profile "${g}", continue?`,b):(log.warning(`\nProfile "${a}" does not exists...`),b(-1))}],function(g){return g?b(g,a):(_updateProfileConfigurationData(f,a),fs.ensureDirSync(c),fs.copySync(d,NPM_CONFIG),fs.copySync(e,YARN_CONFIG),b(g,a))})}exports.NB_SPACES_FOR_TAB=NB_SPACES_FOR_TAB,exports.DOT_PROFILE=DOT_PROFILE,exports.DOT_BASH_PROFILE=DOT_BASH_PROFILE,exports.DOT_ZSH_PROFILE=DOT_ZSH_PROFILE,exports.TYPE_AUTO='t_auto',exports.TYPE_MANUAL='t_manual',exports.TYPE_EXTRA='t_extra',exports.RUNTIME_DIR=RUNTIME_DIR,exports.ENVTOOLS=ENVTOOLS,exports.USER_INTERRUPT=USER_INTERRUPT,exports.USER_WARNING=USER_WARNING,exports.USER_FATAL=USER_FATAL,exports.USER_IGNORE=USER_IGNORE,exports.CUSTOM_PROMPT_DEFAULT=1,exports.CUSTOM_PROMPT_WITH_SINOPIA=2,exports.CUSTOM_PROMPT_WITH_SINOPIA_AND_NODE=3,exports.CUSTOM_PROMPT_WITH_NODE=4,exports.LOG_COLORS={SUCCESS:'green',FAILURE:'red',WARNING:'yellow',DEFAULT_BOX:'cyan',focusBg:chalk.bgYellow.black,gray:chalk.gray,blue:chalk.blue,reset:chalk.reset},exports.ON=ON,exports.OFF=OFF,exports.NA=NA,exports.isWindows=_isWindows,exports.isMac=_isMac,exports.isLinux=_isLinux,exports.isZsh=_isZsh,exports.createRuntimeDir=_createRuntimeDir,exports.chownFolder=_chownFolder,exports.installNpmPackages=_installNpmPackages,exports.sortObject=_sortObject,exports.displayConfirmation=_displayConfirmation,exports.displayPromptWithInput=_displayPromptWithInput,exports.displayListOfOptions=_displayListOfOptions,exports.getExistingNpmrcProfiles=_getExistingNpmrcProfiles,exports.unsetActiveNpmrcProfile=_unsetActiveNpmrcProfile,exports.updateProfileConfigurationData=_updateProfileConfigurationData,exports.createNpmrcProfile=_createNpmrcProfile,exports.switchToNpmrcProfile=_switchToNpmrcProfile;