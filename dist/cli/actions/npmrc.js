"use strict";const _=require("lodash"),log=require("fedtools-logs"),common=require("../../common");function listProfiles(a){const b=[],c=a||{},d=common.getExistingNpmrcProfiles();let e;_.isEmpty(d)?!c.silent&&log.echo("There are no existing profiles."):(d.enabled&&(e=d.enabled,b.push(`* ${e}`)),!_.isEmpty(d.available)&&_.each(_.without(d.available.sort(),e),function(a){b.push(`  ${a}`)}),_.isEmpty(b)?!c.silent&&log.echo("There are no existing profiles."):(b.unshift("\nAvailable npm/yarn profiles:\n"),_.each(b,function(a){log.echo(a)})))}module.exports=function(a,b){const c=!!_.isBoolean(b.l)&&b.l,d=_.isString(b.c)?b.c:null,e=_.isString(b._[1])?b._[1]:null;return c?listProfiles():d?common.createNpmrcProfile(d,function(){log.success("\nProfile created and active")}):e?common.switchToNpmrcProfile(e,function(a,b){a||log.success(`\nProfile "${b}" activated!`)}):function(){const a=[];log.echo(),a.push(""),a.push(log.strToColor("yellow","Description:")),a.push("Envtools npmrc is a simple command line tool that allows you to"),a.push("switch between different npm/yarn configuration files with ease."),a.push(""),a.push(log.strToColor("yellow","Usage:")),a.push("envtools npmrc -l .......... List all profiles"),a.push("envtools npmrc -c [name] ... Create a profile"),a.push("envtools npmrc [name] ...... Switch to an existing profile"),a.push(""),a.push(log.strToColor("yellow","Examples:")),a.push("$ envtools npmrc -c public"),a.push("$ envtools npmrc -c local"),a.push("$ envtools npmrc public"),a.push(""),log.printMessagesInBox(a,common.LOG_COLORS.DEFAULT_BOX),log.echo(),process.exit(1)}()};