#!/usr/bin/env node

const inquirer = require('inquirer');
const series = require('async/series');
const fs = require('fs');
const path = require('path');
const log = require('fedtools-logs');
const cmd = require('fedtools-commands');
const cwd = process.cwd();
const diffTool = {
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
};
const MAX_ARGS = 2;

let
  diffLeft,
  diffRight;

const optimist = require('optimist')
  .usage(
    '\nDescription:\n' +
      ' This script is a diff helper for Kaleidoscope and Araxis.\n' +
      ' It can perform diffs between path or files.\n\n' +
      'Usage: diff [options] <path1|file1> <path2|file2>'
  )
  .options('a', {
    alias: 'axdiff',
    describe: 'runs comparison using Araxis Merge'
  })
  .options('k', {
    alias: 'ksdiff',
    describe: 'runs comparison using Kaleidoscope (default)'
  })
  .boolean(['a', 'k']);

const program = optimist.argv;

/** **************** */
/* Parsing options */
/** **************** */
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

/** **************** */
/* Functions       */
/** **************** */

function displayInfoAndPrompt(callback) {
  log.echo();
  log.blue('About to run a diff with the following options:');
  log.blue(`Tool  : ${diffTool.name}`);
  log.blue(`Left  : ${diffLeft}`);
  log.blue(`Right : ${diffRight}`);
  log.echo();

  const questions = [
    {
      type: 'confirm',
      name: 'continueFlow',
      message: 'Continue',
      default: true
    }
  ];

  inquirer.prompt(questions).then(function (answers) {
    if (answers.continueFlow) {
      return callback();
    } else {
      log.echo('Bye then...');
      return callback(-1);
    }
  });
}

/** **************** */
/* Geronimo!       */
/** **************** */
series(
  [
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
  ],
  function (err) {
    let cmdline;
    if (err && err === -1) {
      log.echo('Bye!');
    } else if (err) {
      log.error(err);
    } else {
      cmdline = `${diffTool.command} "${diffLeft}" "${diffRight}"`;
      cmd.run(cmdline, {
        status: false
      });
    }
  }
);
