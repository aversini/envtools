'use strict';var _=require('lodash'),log=require('fedtools-logs'),common=require('../../common');function listProfiles(a){var b,c=[],d=a||{},e=common.getExistingNpmrcProfiles();_.isEmpty(e)?!d.silent&&log.echo('There are no existing profiles.'):(e.enabled&&(b=e.enabled,c.push('* '+b)),!_.isEmpty(e.available)&&_.each(_.without(e.available.sort(),b),function(a){c.push('  '+a)}),_.isEmpty(c)?!d.silent&&log.echo('There are no existing profiles.'):(c.unshift('\nAvailable npm/yarn profiles:\n'),_.each(c,function(a){log.echo(a)})))}module.exports=function(a,b){var c=!!_.isBoolean(b.l)&&b.l,d=_.isString(b.c)?b.c:null,e=_.isString(b._[1])?b._[1]:null;return c?listProfiles():d?common.createNpmrcProfile(d,function(){log.success('\nProfile created and active')}):e?common.switchToNpmrcProfile(e,function(a,b){a||log.success('\nProfile "'+b+'" activated!')}):function(){var a=[];log.echo(),a.push(''),a.push(log.strToColor('yellow','Description:')),a.push('Envtools npmrc is a simple command line tool that allows you to'),a.push('switch between different npm/yarn configuration files with ease.'),a.push(''),a.push(log.strToColor('yellow','Usage:')),a.push('envtools npmrc -l .......... List all profiles'),a.push('envtools npmrc -c [name] ... Create a profile'),a.push('envtools npmrc [name] ...... Switch to an existing profile'),a.push(''),a.push(log.strToColor('yellow','Examples:')),a.push('$ envtools npmrc -c public'),a.push('$ envtools npmrc -c local'),a.push('$ envtools npmrc public'),a.push(''),log.printMessagesInBox(a,common.LOG_COLORS.DEFAULT_BOX),log.echo(),process.exit(1)}()};