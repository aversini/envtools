'use strict';const fs=require('fs-extra'),waterfall=require('async/waterfall'),path=require('path'),inquirer=require('inquirer'),cmd=require('fedtools-commands'),log=require('fedtools-logs'),common=require('../../common');module.exports=function(a,b){waterfall([function(b){return a.auto?b():void inquirer.prompt({type:'confirm',name:'goForIt',message:'About to install a custom Terminal profile, continue?',default:!0}).then(function(c){return a.actionsPending++,c.goForIt?(a.actionsDone++,b()):b(common.USER_INTERRUPT)})},function(b){const c=[],d='Envtools.terminal',e=path.join(process.env.HOME,'Desktop',d),f=path.join(common.ENVTOOLS.THIRDDIR,'terminal',d);let g=`open ${f}`;cmd.run(g,{status:!1},function(h){if(h){if(a.auto)return b(common.USER_IGNORE);fs.copy(f,e,function(){return c.push(log.strToColor('yellow','                      I N S T R U C T I O N S\n')),c.push('A customized Terminal profile provided by Envtools has been dropped'),c.push('on your desktop. You need to install it manually, but it\'s a very'),c.push('simple process.\n'),c.push('Open the Terminal, hit <CMD ,> (or just open the Preferences).\n'),c.push(`Click on the tab called ${log.strToColor('yellow','"Profiles"')}. At the bottom left, there is a`),c.push('cog icon next to a + and - icons. Click on it and choose'),c.push(`${log.strToColor('yellow','"Import..."')}. Choose the Envtools Theme file on your desktop: the`),c.push(`file name is ${log.strToColor('cyan',d)}.\n`),c.push('Scroll to the top of the list of profiles and select Envtools. Click'),c.push(`on ${log.strToColor('yellow','"Default"')} - next to the previous cog button, and you are set!\n`),c.push('Open a new terminal window and enjoy!'),log.printMessagesInBox(c),b(common.USER_IGNORE)})}else g='osascript -e \'tell application "Terminal"\nset default settings to settings set "Envtools"\nend tell\'',cmd.run(g,{status:!1},function(d){return a.auto?b(common.USER_IGNORE):(d?(c.push(log.strToColor('yellow','                      I N S T R U C T I O N S\n')),c.push('A customized Terminal profile provided by Envtools has been automatically'),c.push('installed. To make it a default is a very simple process.\n'),c.push(`Open the Terminal preferences and click on the tab called ${log.strToColor('yellow','"Profiles"')}.\n`),c.push('Scroll to the top of the list of profiles and select Envtools. Click'),c.push(`on ${log.strToColor('yellow','"Default"')} - next to the bottom left cog button, and you are set!\n`),c.push('Open a new terminal window and enjoy!'),log.printMessagesInBox(c)):log.success('Terminal profile successfully installed!'),b(common.USER_IGNORE))})})}],function(c){b(c,a)})};