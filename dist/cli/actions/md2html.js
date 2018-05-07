'use strict';const _=require('lodash'),fs=require('fs-extra'),path=require('path'),unified=require('unified'),markdown=require('remark-parse'),html=require('remark-html'),log=require('fedtools-logs'),common=require('../../common');module.exports=function(a,b){let c=_.isString(b.f)?b.f:null;c&&fs.existsSync(c)?c=path.resolve(c):function(){const a=[];log.echo(),a.push(''),a.push(log.strToColor('yellow','Description:')),a.push('Envtools md2html is a simple command line tool that'),a.push('allows you to convert a Markdown file to HTML.'),a.push('The resulting HTML is printed on the terminal screen.'),a.push(''),a.push(log.strToColor('yellow','Usage:')),a.push('envtools md2html [-f input]'),a.push(''),a.push(log.strToColor('yellow','Examples:')),a.push('$ envtools md2html -f file.md'),a.push('$ envtools md2html -f file.md > file.html'),a.push(''),log.printMessagesInBox(a,common.LOG_COLORS.DEFAULT_BOX),log.echo(),process.exit(1)}('Invalid argument, file is missing (-f)'),unified().use(markdown).use(html).process(fs.readFileSync(c),function(a,b){if(a)throw a;log.echo(b+'')})};