#!/usr/bin/env node

/*jshint unused:true*/

var program = require('commander'),
  fs = require('fs'),
  path = require('path'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),

  init = require('../lib/init'),

  debug = false,
  command = '',
  packageFileJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')),
  pkgVersion = packageFileJson.version,
  pkgConfig = packageFileJson.config,
  binaryName = path.basename(process.argv[1]),

  commandList = [],
  envtoolsCommands = {
    'i': {
      'full': 'init',
      'description': 'Install or upgrade and initialize a full set of bash scripts and tools.'
    }
  };

for (var prop in envtoolsCommands) {
  if (envtoolsCommands.hasOwnProperty(prop) && prop) {
    commandList.push(prop);
  }
}
commandList.sort();

program
  .version(pkgVersion)
  .usage('[options] ' + commandList.join('|'))
  .option('-b, --boring', 'do not use color output')
  .option('-d, --debug', 'display extra information');


program.on('--help', function () {
  console.log('  Parameters:');

  var cmdtmp, cmdtmplen, cmdt, cmdl, cmdd, cmddlen, i, j,
    len = commandList.length,
    descArray, descArrayLen,
    buffer = '',
    CMD_PRE_BUFFER = '    ',
    CMD_MAX_LEN = 22,
    CMD_DESC_MAX = 50;
  console.log(new Array(CMD_MAX_LEN + CMD_DESC_MAX + 1).join('─'));

  for (i = 0; i < len; i += 1) {
    cmdt = commandList[i];
    cmdl = envtoolsCommands[commandList[i]].full;
    cmdd = envtoolsCommands[commandList[i]].description;

    cmdtmp = CMD_PRE_BUFFER + cmdt + ' (' + cmdl + ')';
    cmdtmplen = cmdtmp.length;
    cmddlen = cmdd.length;

    buffer = cmdtmp + new Array(CMD_MAX_LEN - cmdtmplen + 1).join(' ');
    descArray = utilities.wordWrap(cmdd, CMD_DESC_MAX);

    console.log(log.strToColor('cyan', buffer) + descArray[0]);
    descArrayLen = descArray.length;
    for (j = 1; j < descArrayLen; j += 1) {
      console.log(new Array(CMD_MAX_LEN + 1).join(' ') + descArray[j]);
    }
    console.log(new Array(CMD_MAX_LEN + CMD_DESC_MAX + 1).join('─'));
  }
});

program.parse(process.argv);

/*******************/
/* Parsing options */
/*******************/
if (program.boring) {
  log.setBoring();
}

if (program.debug) {
  debug = true;
}

if (program.args.length !== 1) {
  program.help();
} else {
  command = program.args[0];
}

/*******************/
/* Geronimo!       */
/*******************/
switch (command) {
case 'install':
case 'i':
  log.echo();

  break;

  // case 'test':
case 'wt':
  log.blue('==> this is a b-b-blue test');
  break;

default:
  program.help();
  break;
}
