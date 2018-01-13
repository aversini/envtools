'use strict';var vBoxManageBinary,exec=require('child_process').exec,hostPlatform=process.platform,logging=require('fedtools-logs'),knownOSTypes={WINDOWS:'windows',MAC:'mac',LINUX:'linux'};if(/^win/.test(hostPlatform)){var vBoxInstallPath=process.env.VBOX_INSTALL_PATH||process.env.VBOX_MSI_INSTALL_PATH;vBoxManageBinary='"'+vBoxInstallPath+'\\VBoxManage.exe" '}else vBoxManageBinary=/^darwin/.test(hostPlatform)||/^linux/.test(hostPlatform)?'vboxmanage ':'vboxmanage ';function command(a,b){exec(a,function(c,d,e){!c&&e&&-1!==a.indexOf('pause')&&-1!==a.indexOf('savestate')&&(c=new Error(e)),b(c,d)})}function vboxcontrol(a,b){command('VBoxControl '+a,b)}function vboxmanage(a,b){command(vBoxManageBinary+a,b)}function pause(a,b){logging.info('Pausing VM "%s"',a),vboxmanage('controlvm "'+a+'" pause',function(a){b(a)})}function parseListData(a){var b=a.split(/\r?\n/g),c={};if(0<b.length)for(var d,e=0;e<b.length;e+=1)if(d=b[e],''!==d){var f=/^"(.+)" \{(.+)\}$/,g=d.match(f);g&&3===g.length&&(c[g[2].toString()]={name:g[1].toString()})}return c}function list(a){vboxmanage('list "runningvms"',function(b,c){var d=parseListData(c);vboxmanage('list "vms"',function(b,c){for(var e,f=parseListData(c),g=Object.keys(f),h=0;h<g.length;h+=1)e=g[h],f[e].running=!!d[e];a(b,f)})})}function reset(a,b){logging.info('Resetting VM "%s"',a),vboxmanage('controlvm "'+a+'" reset',function(a){b(a)})}function resume(a,b){logging.info('Resuming VM "%s"',a),vboxmanage('controlvm "'+a+'" resume',function(a){b(a)})}function start(a,b,c){var d=' --type ';'function'==typeof b&&(c=b,b=!0),d+=b?'gui':'headless',vboxmanage('-nologo startvm "'+a+'"'+d,function(a){a&&/VBOX_E_INVALID_OBJECT_STATE/.test(a.message)&&(a=void 0),c(a)})}function stop(a,b){vboxmanage('controlvm "'+a+'" savestate',function(a){b(a)})}function savestate(a,b){logging.info('Saving State (alias to stop) VM "%s"',a),stop(a,b)}function poweroff(a,b){logging.info('Powering off VM "%s"',a),vboxmanage('controlvm "'+a+'" poweroff',function(a){b(a)})}function acpipowerbutton(a,b){logging.info('ACPI power button VM "%s"',a),vboxmanage('controlvm "'+a+'" acpipowerbutton',function(a){b(a)})}function acpisleepbutton(a,b){logging.info('ACPI sleep button VM "%s"',a),vboxmanage('controlvm "'+a+'" acpisleepbutton',function(a){b(a)})}function vmExec(a,b){var c=a.vm||a.name||a.vmname||a.title,d=a.user||a.username||'Guest',e=a.pass||a.passwd||a.password,f=a.path||a.cmd||a.command||a.exec||a.execute||a.run,g=a.params||a.parameters||a.args;Array.isArray(g)&&(g=g.join(' ')),g===void 0&&(g=''),guestproperty.os(c,function(a){var h='guestcontrol "'+c+'"';switch(a){case knownOSTypes.WINDOWS:f=f.replace(/\\/g,'\\\\'),h+=' execute  --image "cmd.exe" --username '+d+(e?' --password '+e:'')+' -- "/c" "'+f+'" "'+g+'"';break;case knownOSTypes.MAC:h+=' execute  --image "/usr/bin/open -a" --username '+d+(e?' --password '+e:'')+' -- "/c" "'+f+'" "'+g+'"';break;case knownOSTypes.LINUX:h+=' execute  --image "/bin/sh" --username '+d+(e?' --password '+e:'')+' -- "/c" "'+f+'" "'+g+'"';break;default:}logging.info('Executing command "vboxmanage %s" on VM "%s" detected OS type "%s"',h,c,a),vboxmanage(h,function(a){b(a)})})}function vmKill(a,b){a=a||{};var c=a.vm||a.name||a.vmname||a.title,d=a.path||a.cmd||a.command||a.exec||a.execute||a.run,e=a.imageName||d;guestproperty.os(c,function(d){d===knownOSTypes.WINDOWS?vmExec({vm:c,user:a.user,password:a.password,path:'C:\\Windows\\System32\\taskkill.exe /im ',params:e},b):d===knownOSTypes.MAC||d===knownOSTypes.LINUX?vmExec({vm:c,user:a.user,password:a.password,path:'sudo killall ',params:e},b):void 0})}var guestproperty={get:function get(a,b){var c=a.vm||a.name||a.vmname||a.title,d=a.key,e=a.defaultValue||a.value;guestproperty.os(c,function(){vboxmanage('guestproperty get "'+c+'" '+d,function(a,c){if(a)throw a;var d=c.substr(c.indexOf(':')+1).trim();'No value set!'===d&&(d=void 0),b(d)})})},OSType:null,os:function os(a,b){function c(a,c){if(a)throw a;guestproperty.OSType=-1===c.indexOf('ostype="Windows')?-1===c.indexOf('ostype="MacOS')?knownOSTypes.LINUX:knownOSTypes.MAC:knownOSTypes.WINDOWS,logging.debug('Detected guest OS as: '+guestproperty.OSType),b(guestproperty.OSType)}if(guestproperty.OSType)return b(guestproperty.OSType);try{exec(vBoxManageBinary+'showvminfo -machinereadable "'+a+'"',c)}catch(b){logging.info('Could not showvminfo for %s',a)}}};module.exports={exec:vmExec,kill:vmKill,list:list,pause:pause,reset:reset,resume:resume,start:start,stop:stop,savestate:savestate,poweroff:poweroff,acpisleepbutton:acpisleepbutton,acpipowerbutton:acpipowerbutton,guestproperty:guestproperty};