'use strict';const waterfall=require('async/waterfall'),inquirer=require('inquirer'),cmd=require('fedtools-commands'),common=require('../../common');module.exports=function(a,b){function c(b,c){waterfall([function(a){b?cmd.run(d,{status:!0}):cmd.run(e,{status:!0}),a()}],function(b){c(b,a)})}const d=['defaults write com.apple.PowerChime ChimeOnAllHardware -bool true','open /System/Library/CoreServices/PowerChime.app'],e=['defaults write com.apple.PowerChime ChimeOnAllHardware -bool false','killall PowerChime'];a.auto?c(!0,function(){return b(common.USER_IGNORE,a)}):inquirer.prompt({type:'confirm',name:'change',message:'Play a power charging sound effect when plugged in?',default:!0}).then(function(d){c(d.change,function(){return b(common.USER_IGNORE,a)})})};