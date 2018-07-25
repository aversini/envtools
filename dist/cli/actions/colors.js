'use strict';var _slicedToArray=function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{!d&&h['return']&&h['return']()}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}();const _=require('lodash'),chalk=require('chalk'),color=require('onecolor'),log=require('fedtools-logs'),ntc=require('../../utilities/ntc'),isHTMLColor=require('../../utilities/colorUtils').isHTMLColor;module.exports=function(a,b){let c,d=(b._[1]+'').toUpperCase().trim();d.startsWith('#')&&(d=d.replace('#',''),1===d.length&&(d=`${d.repeat(6)}`));try{c={hexa:color(d).hex()}}catch(a){return log.echo(),void log.error('Invalid color:',b._[1])}ntc.init();var e=ntc.name(c.hexa),f=_slicedToArray(e,3);const g=f[0],h=f[1],i=f[2],j=`rgba(${ntc.rgb(g).join(', ')}, 1)`,k=`Color data for ${chalk.cyan(c.hexa)}`,l=i?'(exact match)':chalk.yellow('(closest match)'),m=`--color-${_.kebabCase(h)}`,n=isHTMLColor(g)?'yes':'no';log.echo(),log.rainbow(`${k} ${l}:`),log.echo(),log.rainbow(`Color name      : ${chalk.cyan(h)}`),log.rainbow(`Color hexa code : ${chalk.cyan(g)}`),log.rainbow(`Color rgba code : ${chalk.cyan(j)}`),log.rainbow(`CSS variable    : ${chalk.cyan(m)}: ${chalk.cyan(g.toLowerCase())};`),log.rainbow(`HTML color      : ${chalk.cyan(n)}`)};