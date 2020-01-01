#!/usr/bin/env node
"use strict";const inquirer=require("inquirer"),series=require("async/series"),fs=require("fs"),path=require("path"),log=require("fedtools-logs"),cmd=require("fedtools-commands"),cwd=process.cwd(),diffTool={name:"Kaleidoscope",command:"/usr/local/bin/ksdiff",axdiff:{name:"Araxis Merge",command:process.env.ARAXIS_CLI},ksdiff:{name:"Kaleidoscope",command:"/usr/local/bin/ksdiff"}},MAX_ARGS=2;let diffLeft,diffRight;const optimist=require("optimist").usage("\nDescription:\n This script is a diff helper for Kaleidoscope and Araxis.\n It can perform diffs between path or files.\n\nUsage: diff [options] <path1|file1> <path2|file2>").options("a",{alias:"axdiff",describe:"runs comparison using Araxis Merge"}).options("k",{alias:"ksdiff",describe:"runs comparison using Kaleidoscope (default)"}).boolean(["a","k"]),program=optimist.argv;program._.length===MAX_ARGS?(diffLeft=path.resolve(cwd,program._[0]),diffRight=path.resolve(cwd,program._[1])):(optimist.showHelp(),process.exit(1)),program.axdiff&&(diffTool.name=diffTool.axdiff.name,diffTool.command=diffTool.axdiff.command),program.ksdiff&&(diffTool.name=diffTool.ksdiff.name,diffTool.command=diffTool.ksdiff.command);function displayInfoAndPrompt(a){log.echo(),log.blue("About to run a diff with the following options:"),log.blue(`Tool  : ${diffTool.name}`),log.blue(`Left  : ${diffLeft}`),log.blue(`Right : ${diffRight}`),log.echo();inquirer.prompt([{type:"confirm",name:"continueFlow",message:"Continue",default:!0}]).then(function(b){return b.continueFlow?a():(log.echo("Bye then..."),a(-1))})}series([function(a){return fs.existsSync(diffLeft)?a():(log.echo(),log.error("Ooops! The left file|path doesn't exist..."),a(-1))},function(a){return fs.existsSync(diffRight)?a():(log.echo(),log.error("Ooops! The right file|path doesn't exist..."),a(-1))},function(a){displayInfoAndPrompt(a)}],function(a){let b;a&&-1===a?log.echo("Bye!"):a?log.error(a):(b=`${diffTool.command} "${diffLeft}" "${diffRight}"`,cmd.run(b,{status:!1}))});