"use strict";const fs=require("fs-extra"),_=require("lodash"),waterfall=require("async/waterfall"),inquirer=require("inquirer"),common=require("../common");module.exports=function(a,b,c){let d,e;const f=function(){a.auto=!0,fs.removeSync(common.ENVTOOLS.RESUME_AUTO),d=_.map(b[common.TYPE_AUTO],function(a){return a.fct}),d.unshift(function(b){return b(null,a)}),waterfall(d,function(a){a||fs.ensureFileSync(common.ENVTOOLS.AUTO_DONE),c(a)})};return fs.existsSync(common.ENVTOOLS.AUTO_DONE)?void(e={type:"confirm",name:"goodToGo",message:"About to run in auto-mode, do you want to continue?",default:!1},inquirer.prompt(e).then(function(a){return a.goodToGo?f():c(common.USER_INTERRUPT)})):f()};