'use strict';const _=require('lodash'),path=require('path'),fs=require('fs-extra'),log=require('fedtools-logs'),cryptographer=require('../../utilities/cryptographer'),common=require('../../common'),prompts=require('../../utilities/prompts'),FILE_ENCODING='utf8',_getPassword=(a,b,c)=>a?c(null,a):void prompts.displayPromptWithPassword(b,c),_prompt=(a,b)=>{let c;if(!a.file||!fs.existsSync(a.file))throw'Invalid argument, file is missing';else c=path.resolve(a.file);a.output||(a.status=!1);const d=a.encrypt?'Enter password to encrypt file:':'Enter password to decrypt file:';_getPassword(a.password,d,function(d,e){if(d)throw d;a.encrypt?(a.status&&log.info('Encrypting file...'),fs.readFile(c,FILE_ENCODING,function(d,f){if(d)throw d;return a.output?void fs.writeFile(a.output,cryptographer.encrypt(e,f),'utf8',function(d){if(d)throw d;return a.status&&(log.success(`${path.basename(c)} was successfully encrypted.`),log.echo('Encrypted file is ',a.output)),b(null,a)}):(process.stdout.write(cryptographer.encrypt(e,f)),b(null,a))})):(a.status&&log.info('Decrypting file...'),fs.readFile(c,FILE_ENCODING,function(d,f){if(d)throw d;return a.output?void fs.writeFile(a.output,cryptographer.decrypt(e,f),FILE_ENCODING,function(d){if(d)throw d;return a.status&&(log.success(`${path.basename(c)} was successfully decrypted.`),log.echo('Decrypted file is ',a.output)),b(null,a)}):(process.stdout.write(cryptographer.decrypt(e,f)),b(null,a))}))})};module.exports=function(a,b){const c=!_.isBoolean(b.status)||b.status,d=_.isString(b.p)?b.p:null,e=b.encrypt,f=_.isString(b.o)?b.o:null;let g=_.isString(b.f)?b.f:null;g&&fs.existsSync(g)?g=path.resolve(g):function(){const a=[];log.echo(),a.push(''),a.push(log.strToColor('yellow','Description:')),a.push('Envtools encrypt|decrypt is a simple command line tool that'),a.push('allows you to encrypt or decrypt a file with a password.'),a.push('The encryption algorithm used is AES-256-CTR.'),a.push('If the password (-p) is not provided, you will be prompted for one.'),a.push(''),a.push(log.strToColor('yellow','Usage:')),a.push('envtools encrypt [-f input] [-o output] [-p password]'),a.push('envtools decrypt [-f input] [-o output] [-p password]'),a.push(''),a.push(log.strToColor('yellow','Examples:')),a.push('$ envtools encrypt -f plain-file.txt -o encrypted-file.txt'),a.push('$ envtools decrypt -f encrypted-file.txt -o plain-file.txt'),a.push(''),log.printMessagesInBox(a,common.LOG_COLORS.DEFAULT_BOX),log.echo(),process.exit(1)}('Invalid argument, file is missing (-f)'),_prompt({file:g,output:f,status:c,password:d,encrypt:e},function(a){if(a)throw a})};