'use strict';const _=require('lodash'),inquirer=require('inquirer'),waterfall=require('async/waterfall'),isAppInstalled=require('../../utilities/isAppInstalled'),cmd=require('fedtools-commands'),log=require('fedtools-logs'),common=require('../../common'),VSCODE_PACKAGES=[{value:'shurelia.base16-tomorrow-dark-vscode',short:'Base16 Tomorrow Dark+',name:`[Base16 Tomorrow Dark+] .... A base16 color theme styled to look like Atom's base16-tomorrow-dark-theme.`},{value:'alefragnani.bookmarks',short:'Bookmarks',name:'[Bookmarks] ................ Mark lines and jump to them.'},{value:'streetsidesoftware.code-spell-checker',short:'Code Spell Checker',name:'[Code Spell Checker] ....... Spelling checker for source code.'},{value:'dbaeumer.vscode-eslint',short:'ESLint',name:'[ESLint] ................... Integrates ESLint JavaScript into VS Code.'},{value:'file-icons.file-icons',short:'file-icons',name:'[file-icons] ............... File-specific icons in VSCode for improved visual grepping.'},{value:'cpylua.language-postcss',short:'language-postcss',name:'[language-postcss] ......... PostCSS language support.'},{value:'bierner.markdown-preview-github-styles',short:'Md Preview for Github',name:`[Md Preview for Github] .... Changes VS Code's built-in markdown preview to match Github's style.`},{value:'esbenp.prettier-vscode',short:'Prettier-Code formatter',name:'[Prettier-Code] ............ VS Code plugin for prettier/prettier.'},{value:'mrmlnc.vscode-duplicate',short:'Duplicate action',name:'[Duplicate action] ......... Ability to duplicate files and folders in VS Code.'},{value:'vscjava.vscode-java-pack',short:'Java Extension Pack',name:'[Java Extension Pack] ...... VS Code extensions for Java development.'}];module.exports=function(a,b){waterfall([function(a){const b=isAppInstalled('code');return!0===b?a():(log.error('VS Code CLI is not installed on this machine...'),a(common.USER_FATAL))},function(b){return a.auto?b(null,VSCODE_PACKAGES):void inquirer.prompt([{type:'checkbox',message:'Select all packages you want to install',name:'vscode',choices:VSCODE_PACKAGES,pageSize:VSCODE_PACKAGES.length+1,validate(a){return!!a.length||'Press <space> to select one or more packages, or <ctrl-c> to quit...'}}]).then(function(a){return b(null,_.flatten(a.vscode))})},function(a,b){const c=_.map(a,function(a){return function(b){cmd.run(`code --install-extension ${a}`,{status:!0},function(a){b(a)})}});return a&&a.length?void waterfall(c,function(a){a||(log.echo(),log.printMessagesInBox(['Restart Visual Studio Code to take the changes into effect.'],common.LOG_COLORS.DEFAULT_BOX),a=common.USER_IGNORE),b(a)}):b(common.USER_INTERRUPT)}],function(c){b(c,a)})};