"use strict";const _=require("lodash"),inquirer=require("inquirer"),waterfall=require("async/waterfall"),isAppInstalled=require("../../utilities/isAppInstalled"),cmd=require("fedtools-commands"),log=require("fedtools-logs"),common=require("../../common"),ATOM_PACKAGES=[{value:"atom-beautify",short:"atom-beautify",name:" [atom-beautify] .... Code beautifier (better for html, css, svg)."},{value:"autoclose-html",short:"autoclose-html",name:" [autoclose-html] ... Automates closing of HTML Tags."},{value:"docblockr",short:"docblockr",name:" [docblockr] ........ A helper package for writing documentation."},{value:"highlight-line",short:"highlight-line",name:" [highlight-line] ... Highlights the current line in the editor."},{value:"file-icons",short:"file-icons",name:" [file-icons] ....... Assign file extension icons and colors."},{value:"layout-control",short:"layout-control",name:" [layout-control] ... Layout pane manager."},{value:"language-babel",short:"language-babel",name:" [language-babel] ... React (JSX) language support, indentation, snippets, auto completion, reformatting."},{value:"language-postcss",short:"language-postcss",name:" [language-postcss] ..... PostCSS language support."},{value:"language-soy",short:"language-soy",name:" [language-soy] ..... Soy Template language support."},{value:"language-svg",short:"language-svg",name:" [language-svg] ..... SVG language support."},{value:["linter","linter-eslint","linter-ui-default","busy-signal","intentions"],short:"linter-eslint",name:" [linter-eslint] .... Lint JavaScript on the fly, using ESLint."},{value:"minimap",short:"minimap",name:" [minimap] .......... A preview of the full source code."},{value:"minimap-linter",short:"minimap-linter",name:" [minimap-linter] ... Display linter markers in the minimap."},{value:"open-in-browser",short:"open-in-browser",name:" [open-in-browser] .. Open file in default Browser."},{value:"prettier-atom",short:"prettier",name:" [prettier] ......... Another code beautifier (better for js, jsx)."},{value:"Sublime-Style-Column-Selection",short:"sublime-col",name:" [sublime-col] ...... Enable Sublime style 'Column Selection'."},{value:"platformio-ide-terminal",short:"platformio-ide-terminal",name:" [terminal] ......... Terminal emulation within Atom."}];module.exports=function(a,b){waterfall([function(a){const b=isAppInstalled("apm");return!0===b?a():(log.error("Atom package manager is not installed on this machine..."),a(common.USER_FATAL))},function(b){cmd.run("apm config set strict-ssl false",{status:!a.auto},function(){b()})},function(b){return a.auto?b(null,ATOM_PACKAGES):void inquirer.prompt([{type:"checkbox",message:"Select all packages you want to install",name:"atoms",choices:ATOM_PACKAGES,pageSize:ATOM_PACKAGES.length+1,validate(a){return!!a.length||"Press <space> to select one or more packages, or <ctrl-c> to quit..."}}]).then(function(a){return b(null,_.flatten(a.atoms))})},function(a,b){const c=_.map(a,function(a){return function(b){cmd.run(`apm install ${a}`,{status:!0},function(a){b(a)})}});return a&&a.length?void waterfall(c,function(a){a||(log.echo(),log.printMessagesInBox(["Restart Atom to take the changes into effect."],common.LOG_COLORS.DEFAULT_BOX),a=common.USER_IGNORE),b(a)}):b(common.USER_INTERRUPT)}],function(c){b(c,a)})};