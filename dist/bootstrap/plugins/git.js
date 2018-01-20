'use strict';const _=require('lodash'),waterfall=require('async/waterfall'),inquirer=require('inquirer'),path=require('path'),cmd=require('fedtools-commands'),log=require('fedtools-logs'),isAppInstalled=require('../../utilities/isAppInstalled'),backup=require('../../utilities/backup'),common=require('../../common'),DOT_GIT_CONFIG=path.join(process.env.HOME,'.gitconfig');module.exports=function(a,b){return isAppInstalled('git')?void(backup(DOT_GIT_CONFIG),waterfall([function(b){return a.auto?void inquirer.prompt({type:'confirm',name:'goForIt',message:'About to update git configuration, continue?',default:!0}).then(function(c){return a.actionsPending++,c.goForIt?(a.actionsDone++,b()):b(common.USER_INTERRUPT)}):b()},function(a){const b={type:'input',name:'fullname',message:'[git] Enter your full name',validate(a){return!!a||'Your full name cannot be empty...'}},c=cmd.run('git config --global --get user.name',{status:!1}).output;_.isString(c)&&(b.default=c.replace('\n',''),b.message=`${b.message} or press ENTER for default`),inquirer.prompt(b).then(function(b){return b.fullname?a(null,b.fullname):a(common.USER_INTERRUPT)})},function(a,b){const c={type:'input',name:'email',message:'[git] Enter your email address',validate(a){return!!a||'Your email address cannot be empty...'}},d=cmd.run('git config --global --get user.email',{status:!1}).output;_.isString(d)&&(c.default=d.replace('\n',''),c.message=`${c.message} or press ENTER for default`),inquirer.prompt(c).then(function(c){return c.email?b(null,a,c.email):b(common.USER_INTERRUPT)})},function(a,b,c){inquirer.prompt([{type:'input',name:'github',message:'[git] Enter your external github username (if you have one)'}]).then(function(d){c(null,a,b,d.github)})}],function(c,d,e,f){let g;return c?(a.auto&&c===common.USER_INTERRUPT&&(c=null),b(c,a)):(g=[`git config --global user.name "${d}"`,`git config --global user.email ${e}`,'git config --global color.diff auto','git config --global color.status auto','git config --global color.ui auto','git config --global url."https://github.com/".insteadOf "git://github.com/"','git config --global alias.st \'status --short --branch\'','git config --global alias.d diff','git config --global alias.br branch','git config --global alias.ci commit','git config --global alias.co checkout','git config --global push.default simple','git config --global http.sslVerify false'],f&&g.push(`git config --global github.user ${f}`),common.isMac()&&(g.push('git config --global alias.l \'log --graph --abbrev-commit --decorate --all --format=format:"%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(dim white) - %an%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n %C(white)%s%C(reset)"\''),g.push('git config --global diff.tool opendiff'),g.push('git config --global merge.tool opendiff'),g.push('git config --global credential.helper osxkeychain')),cmd.run(g,{status:!a.auto}),g=[],process.env.ALL_PROXY?(g.push(`git config --global http.proxy ${process.env.ALL_PROXY}`),g.push(`git config --global https.proxy ${process.env.ALL_PROXY}`)):(g.push('git config --global --remove-section http'),g.push('git config --global --remove-section https')),cmd.run(g,{status:!a.auto}),b(null,a))})):(log.error('Git is not installed on this machine...'),b(null,a))};