#!/usr/bin/env node

var
  optimist,
  program,
  inquirer = require('inquirer'),
  series = require('async/series'),
  fs = require('fs'),
  path = require('path'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  cwd = process.cwd(),

  diffTool = {
    name: 'Kaleidoscope',
    command: '/usr/local/bin/ksdiff',
    axdiff: {
      name: 'Araxis Merge',
      command: process.env.ARAXIS_CLI
    },
    ksdiff: {
      name: 'Kaleidoscope',
      command: '/usr/local/bin/ksdiff'
    }
  },
  diffLeft, diffRight,

  MAX_ARGS = 2;

optimist = require('optimist')
  .usage('\nDescription:\n' +
    ' This script is a diff helper for Kaleidoscope and Araxis.\n' +
    ' It can perform diffs between path or files.\n\n' +
    'Usage: diff [options] <path1|file1> <path2|file2>')
  .options('a', {
    alias: 'axdiff',
    describe: 'runs comparison using Araxis Merge'
  })
  .options('k', {
    alias: 'ksdiff',
    describe: 'runs comparison using Kaleidoscope (default)'
  })
  .boolean(['a', 'k']);

program = optimist.argv;

/*******************/
/* Parsing options */
/*******************/
if (program._.length !== MAX_ARGS) {
  // too many or too few arguments
  optimist.showHelp();
  process.exit(1);
} else {
  diffLeft = path.resolve(cwd, program._[0]);
  diffRight = path.resolve(cwd, program._[1]);
}

if (program.axdiff) {
  diffTool.name = diffTool.axdiff.name;
  diffTool.command = diffTool.axdiff.command;
}
if (program.ksdiff) {
  diffTool.name = diffTool.ksdiff.name;
  diffTool.command = diffTool.ksdiff.command;
}

/*******************/
/* Functions       */
/*******************/

function displayInfoAndPrompt(callback) {
  var questions;

  log.echo();
  log.blue('About to run a diff with the following options:');
  log.blue('Tool  : ' + diffTool.name);
  log.blue('Left  : ' + diffLeft);
  log.blue('Right : ' + diffRight);
  log.echo();

  questions = [{
    type: 'confirm',
    name: 'continueFlow',
    message: 'Continue',
    default: true
  }];

  inquirer.prompt(questions).then(function (answers) {
    if (answers.continueFlow) {
      return callback();
    } else {
      log.echo('Bye then...');
      return callback(-1);
    }
  });
}

/*******************/
/* Geronimo!       */
/*******************/
series([
  function (callback) {
    if (!fs.existsSync(diffLeft)) {
      log.echo();
      log.error('Ooops! The left file|path doesn\'t exist...');
      return callback(-1);
    } else {
      return callback();
    }
  },
  function (callback) {
    if (!fs.existsSync(diffRight)) {
      log.echo();
      log.error('Ooops! The right file|path doesn\'t exist...');
      return callback(-1);
    } else {
      return callback();
    }
  },
  function (callback) {
    displayInfoAndPrompt(callback);
  }
], function (err) {
  var cmdline;
  if (err && err === -1) {
    log.echo('Bye!');
  } else if (err) {
    log.error(err);
  } else {
    cmdline = diffTool.command + ' "' + diffLeft + '" "' + diffRight + '"';
    cmd.run(cmdline, {
      status: false
    });
  }
});
