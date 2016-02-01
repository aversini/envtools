#!/usr/bin/env node

var
  program = require('commander'),
  inquirer = require('inquirer'),
  async = require('async'),
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
  diffLeft, diffRight;

program
  .version('0.0.1')
  .usage('[options] [path1|file1] [path2|file2]')
  .option('-a, --axdiff', 'runs comparison using Araxis Merge')
  .option('-k, --ksdiff', 'runs comparison using Kaleidoscope (default)');

program.on('--help', function () {
  log.echo('  Parameters:');
  log.echo('');
  log.echo('    path1    Optional path to perform diff on (left side)');
  log.echo('    file1    Optional file to perform diff on (left side)');
  log.echo('    path2    Optional path to perform diff on (right side)');
  log.echo('    file2    Optional file to perform diff on (right side)');
  log.echo('');
  log.echo('  Description:');
  log.echo('');
  log.echo('    This script is a diff helper for Kaleidoscope and Araxis.');
  log.echo('    It can perform diffs between path or files.');
  log.echo('');
  log.echo('  Examples:');
  log.echo('');
  log.echo('');
  log.echo('    Compare two files:');
  log.blue('    $ diff.js file1.ext path/file2.ext');
  log.echo('');
  log.echo('    Compare two paths:');
  log.blue('    $ diff.js path1/ path2/');
  log.echo('');
  log.echo('');


});

program.parse(process.argv);

/*******************/
/* Parsing options */
/*******************/
if (program.args.length > 2) {
  // too many arguments
  program.help();
} else {
  switch (program.args.length) {
  case 0:
    program.help();
    break;
  case 1:
    diffLeft = path.resolve(cwd, program.args[0]);
    break;
  case 2:
    diffLeft = path.resolve(cwd, program.args[0]);
    diffRight = path.resolve(cwd, program.args[1]);
    break;
  }
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
  log.echo();
  log.blue('About to run a diff with the following options:');
  log.blue('Tool  : ' + diffTool.name);
  log.blue('Left  : ' + diffLeft);
  log.blue('Right : ' + diffRight);
  log.echo();

  var
    questions = [{
      type: 'confirm',
      name: 'continueFlow',
      message: 'Continue',
      default: true
    }];

  inquirer.prompt(questions, function (answers) {
    if (answers.continueFlow) {
      callback();
    } else {
      log.echo('Bye then...');
      callback(-1);
    }
  });
}

/*******************/
/* Geronimo!       */
/*******************/
async.series([
  function (callback) {
    if (!fs.existsSync(diffLeft)) {
      log.echo();
      log.error('Ooops! The left file|path doesn\'t exist...');
      callback(-1);
    } else {
      callback();
    }
  },
  function (callback) {
    if (!fs.existsSync(diffRight)) {
      log.echo();
      log.error('Ooops! The right file|path doesn\'t exist...');
      callback(-1);
    } else {
      callback();
    }
  },
  function (callback) {
    displayInfoAndPrompt(callback);
  }
], function (err) {
  if (err && err === -1) {
    log.echo('Bye!');
  } else if (err) {
    log.error(err);
  } else {
    var cmdline = diffTool.command + ' "' + diffLeft + '" "' + diffRight + '"';
    cmd.run(cmdline, {
      status: false
    });
  }
});
