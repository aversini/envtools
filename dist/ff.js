"use strict";const STR_TYPE_DIRECTORY="d",STR_TYPE_FILE="f",BYTE_CHUNKS=1e3,MODE_OWNER_POS=0,MODE_GROUP_POS=1,MODE_WORD_POS=2,OCTAL=8,DECIMAL=10,LAST_THREE_ENTRIES=-3,path=require("path"),join=path.join,basename=path.basename,fs=require("fs"),moment=require("moment"),childProcess=require("child_process"),utilities=require("fedtools-utilities"),cmd=require("fedtools-commands"),log=require("fedtools-logs"),common=require("./common"),cwd=process.cwd(),dirBlacklist=/node_modules|(^|\/)\.[^/.]/gi,dirsList=[],filesList=[],groupNames={},ownerNames={0:"root"};let rePattern,command,perf,totalDirScanned=0,totalFileScanned=0,type=STR_TYPE_FILE,longListing=!1,debug=!1,stats=!1,boring=!1,ignoreBlacklists=!1;const optimist=require("optimist").usage("\nDescription:\n List files or directories under the current directory that match\n the given pattern or all of them if no pattern is given. If the\n type is omitted, the default behavior is to look for files.\n\nUsage: ff [options] -p <search pattern> ").options("p",{demand:!0,alias:"pattern",describe:"a regular expression to match"}).options("t",{alias:"type",describe:"choose to list either files or directories"}).options("l",{alias:"long",describe:"long listing format (equivalent to ls -l)"}).options("H",{alias:"hidden",describe:"show hidden files and directories"}).options("c",{alias:"command",describe:"command to execute over each node (ex: chmod +x)"}).options("b",{alias:"boring",describe:"do not use color output"}).options("d",{alias:"debug",describe:"display debbuging information"}).options("r",{alias:"rainbow",describe:"do not ignore any files or folders"}).options("s",{alias:"stats",describe:"display some statistics"}).boolean(["l","H","b","d","s","r"]),program=optimist.argv;program._.length&&(optimist.showHelp(),process.exit(1)),"string"==typeof program.pattern&&(rePattern=new RegExp(program.pattern)),"string"==typeof program.type&&(program.type===STR_TYPE_FILE||program.type===STR_TYPE_DIRECTORY?type=program.type:(optimist.showHelp(),process.exit(1))),program.long&&(longListing=!0),"string"==typeof program.command&&(command=program.command.trim().split(" ")),program.stats&&(stats=!0),program.boring&&(boring=!0),program.rainbow&&(ignoreBlacklists=!0),program.debug&&(debug=!0,stats=!0,boring=!1);function hidden(a){return!!program.hidden||"."!==a[0]}function checkPattern(a,b){return rePattern&&(b===STR_TYPE_FILE||b===STR_TYPE_DIRECTORY)?(debug&&(log.echo("==> looking for: [%s]",rePattern),log.echo("==> str to check: ",a)),rePattern.lastIndex=0,rePattern.exec(a)):!0}function runCommand(a){let b,c,d;command&&(c=command[0],d=command.slice(0),d.shift(),d.push(a),b=childProcess.spawn(c,d),b.stdout.on("data",function(a){a&&log.echo(a.toString())}),b.stderr.on("data",function(a){a&&log.echo(a.toString())}))}function ignoreFolders(a){return!ignoreBlacklists&&dirBlacklist.exec(basename(a))}function findNodes(a,b){a.forEach(function(a){let c,d,e;const f=fs.lstatSync(a);if(f.isDirectory()&&!ignoreFolders(a)){totalDirScanned++,b.type===STR_TYPE_DIRECTORY&&(c=checkPattern(a,b.type))&&(dirsList.push({match:c,name:a,stat:f}),runCommand(a));try{d=fs.readdirSync(a),findNodes(d.filter(hidden).map(function(b){return join(a,b)}),b)}catch(a){}}else f.isFile()&&(totalFileScanned++,b.type===STR_TYPE_FILE&&(e=basename(a),(c=checkPattern(e,b.type))&&(filesList.push({match:c[0],name:a,shortname:e,stat:f}),runCommand(a))))})}function extractMode(a){const b=parseInt(a.toString(OCTAL),DECIMAL).toString().slice(LAST_THREE_ENTRIES),c=b.charAt(MODE_OWNER_POS),d=b.charAt(MODE_GROUP_POS),e=b.charAt(MODE_WORD_POS),f={0:"---",1:"--x",2:"-w-",3:"-wx",4:"r--",5:"r-x",6:"rw-",7:"rwx"};return f[c]+f[d]+f[e]}function convertSize(a){let b=0;for(;a>=BYTE_CHUNKS;)++b,a/=BYTE_CHUNKS;const c=parseInt(a,DECIMAL).toFixed(0)+["B","K","M","G","T"][b];return Array(5+1-c.length).join(" ")+c}function convertDate(a){return moment(a).format("MMM DD HH:mm")}function getOwnerNameFromId(a){let b;return ownerNames[a]||(ownerNames[a]=a,b=cmd.run(`id -nu ${a}`,{status:!1}),0===b.code&&""!==b.stdout&&(ownerNames[a]=b.stdout.replace(/\n$/g,""))),ownerNames[a]}function getGroupNameFromId(a){let b,c;return groupNames[a]||(groupNames[a]=a,c=cmd.run(`grep ':*:${a}:' /etc/group`,{status:!1}),0===c.code&&""!==c.stdout&&(b=c.stdout.split(":"),b&&b.length&&(groupNames[a]=b[0]))),groupNames[a]}function formatLongListings(a,b){const c=b===STR_TYPE_FILE?"-":"d",d={mode:c+extractMode(a.mode),size:` ${convertSize(a.size)}`,mdate:` ${convertDate(a.mtime)} `};return common.isWindows()?(d.owner=`  ${a.uid}`,d.group=`  ${a.gid}`):(d.owner=`  ${getOwnerNameFromId(a.uid)}`,d.group=`  ${getGroupNameFromId(a.gid)}`),d}stats&&utilities.performance.mark("ff-1"),findNodes([cwd],{type}),boring||log.echo(""),utilities.performance.mark("ff-2"),0<filesList.length?(filesList.forEach(function(a){const b=a.stat;let c,d={mode:"",size:"",owner:"",group:"",mdate:""};longListing&&(d=formatLongListings(b,STR_TYPE_FILE)),c=`./${path.relative(cwd,a.name)}`,boring?log.rainbow("%s%s%s%s%s%s",d.mode,d.owner,d.group,d.size,d.mdate,c):(a&&a.match&&a.shortname&&(c=common.LOG_COLORS.gray(c.replace(a.shortname,a.shortname.replace(a.match,common.LOG_COLORS.focusBg(a.match))))),log.rainbow("  %s%s%s%s%s%s",d.mode,d.owner,d.group,d.size,d.mdate,c))}),utilities.performance.mark("ff-file")):0<dirsList.length&&(dirsList.forEach(function(a){const b=a.stat;let c,d={mode:"",size:"",owner:"",group:"",mdate:""};longListing&&(d=formatLongListings(b,STR_TYPE_DIRECTORY)),c=path.relative(cwd,a.name),c=""===c?".":`./${c}`,boring?log.rainbow("%s%s%s%s%s",d.mode,d.owner,d.group,d.mdate,c):(a&&a.match&&(c=common.LOG_COLORS.blue(c.replace(a.match,common.LOG_COLORS.focusBg(a.match)))),log.rainbow("  %s%s%s%s%s",d.mode,d.owner,d.group,d.mdate,c))}),utilities.performance.mark("ff-dir")),stats?(log.echo(""),dirsList.length&&(log.echo(`  Total dirs matching     : ${dirsList.length}`),log.echo(`  Total dirs scanned      : ${totalDirScanned}`),utilities.performance.measure("dir-list","ff-1","ff-dir"),perf=utilities.performance.getEntriesByName("dir-list"),perf&&perf[0].duration&&log.echo(`  Elapsed time            : ${utilities.formatMillisecondsToHuman(perf[0].duration)}`)),filesList.length&&(log.echo(`  Total files matching    : ${filesList.length}`),log.echo(`  Total files scanned     : ${totalFileScanned}`),utilities.performance.measure("file-list","ff-1","ff-file"),perf=utilities.performance.getEntriesByName("file-list"),perf&&perf[0].duration&&log.echo(`  Elapsed time            : ${utilities.formatMillisecondsToHuman(perf[0].duration)}`)),log.echo("")):!boring&&log.echo("");