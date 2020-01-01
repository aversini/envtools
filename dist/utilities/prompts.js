"use strict";const log=require("fedtools-logs"),inquirer=require("inquirer"),_displayConfirmation=(a,b)=>{log.echo(),inquirer.prompt({type:"confirm",name:"goodToGo",message:a,default:!0}).then(function(a){b(!a.goodToGo)})},_displayPromptWithInput=(a,b)=>{const c={type:"input",name:"input",message:a,validate(a){return!!a||"Entry cannot be empty..."}};log.echo(),inquirer.prompt(c).then(function(a){b(null,a.input)})},_displayPromptWithPassword=(a,b)=>{const c={type:"password",name:"password",message:a,validate(a){return!!a||"Password cannot be empty..."}};log.echo(),inquirer.prompt(c).then(function(a){b(null,a.password)})},_displayListOfOptions=(a,b,c)=>{const d={type:"list",name:"selection",message:a};d.choices=b,log.echo(),inquirer.prompt(d).then(function(a){c(null,a.selection)})};exports.displayConfirmation=_displayConfirmation,exports.displayPromptWithInput=_displayPromptWithInput,exports.displayPromptWithPassword=_displayPromptWithPassword,exports.displayListOfOptions=_displayListOfOptions;