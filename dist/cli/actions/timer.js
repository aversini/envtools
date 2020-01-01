"use strict";const _=require("lodash"),moment=require("moment"),notifier=require("./notifier"),log=require("fedtools-logs"),common=require("../../common");function _timer(a){function b(a){let b,d=0;log.clearPreviousLine(),log.clearPreviousLine(),log.clearPreviousLine(),log.clearPreviousLine(),a?i=`${log.strToColor("yellow","Remaining time: ")}expired`:(d=parseInt((Date.now()-c)/1e3,10),b=moment.duration(1e3*(e-d)),i=`${log.strToColor("yellow","Remaining time: ")+b.hours()}h ${b.minutes()}m ${b.seconds()}s`),log.printMessagesInBox([h,i],common.LOG_COLORS.DEFAULT_BOX)}const c=Date.now(),d={title:"Envtools Notification",type:"TIMER",message:"Time is up!",sound:"Purr"};let e,f,g,h=log.strToColor("cyan","Timer: "),i=`${log.strToColor("yellow","Remaining time: ")}***`,j=0;const k=function(a){function b(a,b){const d=c[b];return d?a*d:0}const c={ms:1e3,s:1000000,m:60000000,h:3600000000,d:86400000000,w:604800000000};return _.isString(a)&&(f=a.toLowerCase().match(/[-+]?[0-9\.]+[a-z]+/g),null!==f&&f.forEach(function(a){const c=a.match(/[0-9\.]+/g)[0],d=a.match(/[a-z]+/g)[0];j+=b(c,d)})),moment.duration(j/c.ms)}(a.strings),l=k.asMilliseconds();return 0<l?(e=k.asSeconds(),h+=`${k.hours()}h ${k.minutes()}m ${k.seconds()}s`,log.echo(),log.printMessagesInBox([h,i],common.LOG_COLORS.DEFAULT_BOX),g=setInterval(b,1e3),setTimeout(function(){clearInterval(g),b(e),log.echo(),a.notification&&notifier(null,d)},l),l):-1}module.exports=function(a,b){const c=[],d=!_.isBoolean(b.quiet)||!b.quiet,e=_timer({strings:b._[1],notification:d});-1===e&&(log.echo(),c.push(""),c.push(log.strToColor("yellow","Description:")),c.push("Envtools timer is a simple command line timer"),c.push("with notification superpowers."),c.push(""),c.push(log.strToColor("yellow","Parameter:")),c.push("Envtools timer only takes one parameter with the"),c.push("following format: XhYmZs, e.g. 4h2m15s or 1m42s"),c.push(""),c.push(log.strToColor("yellow","Usage:")),c.push("$ envtools timer 1m3s"),c.push(""),log.printMessagesInBox(c,common.LOG_COLORS.DEFAULT_BOX),log.echo())};