'use strict';const version=require('./version'),inquirer=require('inquirer'),common=require('../../common');module.exports=function(a,b){inquirer.prompt([{type:'confirm',name:'goodToGo',message:'Do you want Envtools to periodically check for update?'}]).then(function(c){a.actionsPending++,a.toggleOptions[common.ENVTOOLS.CFG_AUTOCHECK]=c.goodToGo?common.ON:common.OFF,version(a,function(){a.actionsDone++,b(null,a)})})};