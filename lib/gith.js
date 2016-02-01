#!/usr/bin/env node

var
  _ = require('underscore'),
  async = require('async'),
  inquirer = require('inquirer'),
  mustache = require('mustache'),
  optimist = require('optimist'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  GIT_STATUS = 'status',
  STR_NO_TAGS = 'No tags found in the current repository',

  program,
  cwd = process.cwd(),
  parameter,
  commandList = [],
  gitCommands = {
    'reset': {
      'description': 'Discard all local changes in the current repository',
      'command': 'git reset --hard'
    },
    'status': {
      'description': 'Get some status about modified/updated files in the current repository',
      'command': 'git status'
    },
    'info': {
      'description': 'Extract some information about the current repository'
    },
    'pull': {
      'description': 'Pull origin to current branch (with tags)',
      'command': 'git pull origin {{branchName}} --tags'
    },
    'push': {
      'description': 'Push current branch to origin (with tags)',
      'command': 'git push origin {{branchName}} --tags'
    },
    'add': {
      'description': 'Add a tag to the current repository'
    },
    'remove': {
      'description': 'Remove a tag from the current repository'
    },
    'list': {
      'description': 'List the current tag (if any) of the current commit'
    }
  };

for (var prop in gitCommands) {
  if (gitCommands.hasOwnProperty(prop) && prop) {
    commandList.push(prop);
  }
}

commandList.sort();

optimist = require('optimist')
  .usage(log.strToColor('cyan', 'Usage: ') + 'gith ' + commandList.join('|'));

program = optimist.argv;

/*******************/
/* Parsing options */
/*******************/
if (program._ && program._.length === 1) {
  parameter = program._[0];
}

/*******************/
/* Functions       */
/*******************/

function showHelp() {
  log.rainbow(optimist.help().replace('\n', ''));
  log.rainbow(log.strToColor('cyan', 'Commands:'));
  log.echo('');
  var i, len = commandList.length;
  for (i = 0; i < len; i += 1) {
    log.rainbow(' ' + log.strToColor('yellow', commandList[i]) + '\t' + gitCommands[commandList[i]].description);
  }
  log.echo('');
  console.log(log.strToColor('cyan', 'Description:'));
  console.log('');
  console.log(' This script is a helper tool to run several git commands.');
  console.log('');
  console.log('');
}

function isGitRepository(done) {
  var cmdline = 'git symbolic-ref HEAD';
  cmd.run(cmdline, {
    pwd: cwd,
    status: false
  }, done);
}

function gitHelperStandard(cmdline, options, cb) {
  var silent = false;

  if (options && options.silent) {
    silent = true;
  }

  cmd.run(cmdline, {
    pwd: cwd,
    status: !silent,
    verbose: true
  }, function (err) {
    if (cb && typeof cb === 'function') {
      cb(err);
    }
    log.echo();
  });
}

function gitAddTag(done) {
  async.waterfall([

    function (callback) {
      cmd.run('git describe', {
        pwd: cwd,
        status: false
      }, function (err, stderr, stdout) {
        if (stdout) {
          log.info('The current tag is (%s)...',
            stdout.toString().replace(/\n$/, ''));
        }
        callback();
      });
    },
    function (callback) {
      var
        questions = [{
          type: 'input',
          name: 'tagName',
          message: 'Please type a tag number to add (ex: v1.1):'
        }];

      inquirer.prompt(questions, function (answers) {
        if (answers.tagName) {
          callback(null, answers.tagName);
        } else {
          callback(-1);
        }
      });
    },
    function (tag, callback) {
      cmd.run('git tag -a ' + tag + ' -m tagging-' + tag, {
        pwd: cwd
      }, callback);
      callback();
    }
  ], function (err, data) {
    done(err, data);
  });
}

function gitRemoveTag(done) {
  async.waterfall([

    function (callback) {
      cmd.run('git describe', {
        pwd: cwd,
        status: false
      }, function (err, stderr, stdout) {
        if (stdout) {
          var tag = stdout.toString().replace(/\n$/, '');
          log.info('The current tag (%s) will be removed...', tag);
          callback(null, tag);
        } else {
          callback(-1);
        }
      });
    },
    function (tag, callback) {
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
          callback(-2);
        }
      });
      // prompt.confirm('Continue? [y|N]', {
      //   default: false
      // }, function (err, answer) {
      //   if (err || answer === false) {
      //     callback(-2);
      //   } else {
      //     callback(null, tag);
      //   }
      // });
    },
    function (tag, callback) {
      cmd.run('git tag -d ' + tag, {
        pwd: cwd
      }, callback);
    }
  ], function (err, data) {
    done(err, data);
  });
}

function gitInfo(done) {
  var syncExecResult;

  log.title('Repository overview');
  async.waterfall([

      function (callback) {
        cmd.run('git remote show', {
          pwd: cwd,
          status: false
        }, function (err, stderr, stdout) {
          if (stdout) {
            var remotes = _.compact(stdout.split('\n')).sort();
            callback(null, remotes);
          } else {
            callback(-1);
          }
        });
      },
      function (remotes, callback) {
        remotes.forEach(function (remote) {
          log.echo();
          log.title('Remote (' + remote + '):');
          syncExecResult = cmd.run('git remote show ' + remote, {
            pwd: cwd,
            verbose: false,
            status: false
          });
          if (syncExecResult && syncExecResult.output) {
            console.log(syncExecResult.output);
            syncExecResult = null;
          }
        });
        callback();
      },
      function (callback) {
        cmd.run('git status -s', {
          pwd: cwd,
          status: false
        }, function (err, stderr, stdout) {
          callback(null, stdout);
        });
      },
      function (status, callback) {
        log.echo();
        log.title('Status:');
        if (status) {
          // need to display git status -s
          cmd.run('git status -s', {
            pwd: cwd,
            verbose: true,
            status: false
          }, function () {
            callback();
          });
        } else {
          log.echo('  Working directory is clean');
          callback();
        }
      },
      function (callback) {
        log.echo();
        log.title('Recent logs:');

        syncExecResult = cmd.run(
          'git log -10 --pretty=format:\'%ad [ %an ] %s\' --date=local', {
            pwd: cwd,
            status: false,
            verbose: false
          });
        if (syncExecResult && syncExecResult.output) {
          console.log(syncExecResult.output);
          syncExecResult = null;
        }
        callback();
      }
    ],
    function (err, data) {
      done(err, data);
    });
}

/*******************/
/* Geronimo!       */
/*******************/

function getCurrentBranch() {
  var res = cmd.run('git rev-parse --abbrev-ref HEAD', {
    status: false,
    verbose: false
  });
  if (res && res.output) {
    return res.output.toString().replace(/\n$/, '');
  }
}

isGitRepository(function (err) {
  if (err) {
    log.echo();
    log.error('The current directory is not a git repository...');
    log.echo();
    return;
  }

  log.echo();

  switch (parameter) {
  case 'list':
    gitHelperStandard('git describe --long', {
      silent: true
    }, function (err) {
      if (err) {
        log.notice(STR_NO_TAGS);
      }
    });
    break;
  case 'add':
    gitAddTag(function (err) {
      if (err && err === -1) {
        log.echo('Bye then!');
      }
      log.echo();
    });
    break;
  case 'remove':
    gitRemoveTag(function (err) {
      if (err) {
        if (err === -1) {
          log.notice(STR_NO_TAGS);
        }
        if (err === -2) {
          log.echo('Bye then!');
        }
      }
      log.echo();
    });
    break;
  case 'info':
    gitInfo(function (err) {
      if (err) {
        log.error(err);
      }
      log.echo();
    });
    break;
  case 'pull':
  case 'push':
    var branch = getCurrentBranch(),
      command;

    if (!branch || branch.length < 1) {
      log.error('Unable to get the name of the current branch!');
      log.echo();
    } else {
      command = mustache.render(gitCommands[parameter].command, {
        branchName: branch
      });
      log.echo('Running: ' + command);
      gitHelperStandard(command, {
        silent: true
      });
    }
    break;
  case 'reset':
    log.warning(
      'Do you really want to revert all local changes and reset your working tree?');
    log.warning('All uncommitted changes will be lost.');
    log.echo();

    var
      questions = [{
        type: 'confirm',
        name: 'continueFlow',
        message: 'Continue',
        default: false
      }];

    inquirer.prompt(questions, function (answers) {
      if (answers.continueFlow) {
        gitHelperStandard('git reset --hard');
      } else {
        log.echo('Bye then...');
        return;
      }
    });

    // prompt.confirm('Continue? [y|N]', {
    //     'default': false
    //   },
    //   function (err, answer) {
    //     if (!answer) {
    //       log.echo('Bye then!');
    //       return;
    //     } else {
    //       gitHelperStandard('git reset --hard');
    //     }
    //   }
    // );

    break;
  case 'test':
    log.echo('test test: ' + getCurrentBranch());
    break;
  default:
    showHelp();
    process.exit(0);
    break;
  }
});
