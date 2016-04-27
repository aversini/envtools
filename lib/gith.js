#!/usr/bin/env node

/*eslint indent:0, handle-callback-err:0*/
var
  USER_ABORT = -2,

  _ = require('underscore'),
  async = require('async'),
  inquirer = require('inquirer'),
  optimist = require('optimist'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  cmd = require('fedtools-commands'),

  STR_NO_TAGS = 'No tags found in the current repository',

  program,
  cwd = process.cwd(),
  parameter,
  prop,
  commandList = [],
  gitCommands = {
    'info': {
      'description': ' .............. Extract some information about the current repository.'
    },
    'addTag': {
      'description': ' ............ Add a tag to the current commit.'
    },
    'removeTag': {
      'description': ' ......... Remove the most recent tag from the repository.'
    },
    'listTag': {
      'description': ' ........... List the current tag (if any) of the current commit.\n' +
        '                     Use --all to list all tags in chronological order.'
    }
  };

for (prop in gitCommands) {
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
  var i, len;
  log.rainbow(optimist.help().replace('\n', ''));
  log.rainbow(log.strToColor('cyan', 'Commands:'));
  log.echo('');

  len = commandList.length;
  for (i = 0; i < len; i += 1) {
    log.rainbow(' ' + log.strToColor('yellow', commandList[i]) + gitCommands[commandList[i]].description);
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

function gitAddTag(done) {
  async.waterfall([

    function (callback) {
      utilities.git.getLatestTag({}, function (err, res) {
        if (!err && res.stdout) {
          log.info('The most recent tag is (%s)...', res.stdout);
        }
        callback();
      });
    },
    function (callback) {
      var
        questions = [{
          type: 'input',
          name: 'tagName',
          message: 'Please type a tag number to add (ex: 2.9.0rc1):'
        }];

      inquirer.prompt(questions, function (answers) {
        if (answers.tagName) {
          return callback(null, answers.tagName);
        } else {
          return callback(-1);
        }
      });
    },
    function (tag, callback) {
      cmd.run('git tag -a ' + tag + ' -m tagging-' + tag, {
        pwd: cwd
      }, function (err, stderr) {
        if (err && stderr) {
          log.echo(stderr);
        }
        return callback(err);
      });
    }
  ], function (err, data) {
    return done(err, data);
  });
}

function gitRemoveTag(done) {
  async.waterfall([

    function (callback) {
      utilities.git.getLatestTag({}, function (err, res) {
        if (!err && res.stdout) {
          log.info('The most recent tag (%s) will be removed...', res.stdout);
          return callback(null, res.stdout);
        }
        callback(-1);
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
          return callback(null, tag);
        } else {
          return callback(USER_ABORT);
        }
      });
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
          var remotes;
          if (stdout) {
            remotes = _.compact(stdout.split('\n')).sort();
            return callback(null, remotes);
          } else {
            return callback(-1);
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
          return callback();
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

//-- E N T R Y  P O I N T

isGitRepository(function (err) {
  if (err) {
    log.error('The current directory is not a git repository...');
    return;
  }

  switch (parameter) {
  case 'list':
  case 'listTag':
    if (program.all) {
      utilities.git.getAllTags({}, function (err, res) {
        if (res && res.stdout) {
          log.echo(res.stdout);
        } else {
          log.notice(STR_NO_TAGS);
        }
      });
    } else {
      utilities.git.getLatestTag({}, function (err, res) {
        if (res && res.stdout) {
          log.echo(res.stdout);
        } else {
          log.notice(STR_NO_TAGS);
        }
      });
    }
    break;
  case 'add':
  case 'addTag':
    gitAddTag(function (err) {
      if (err && err === -1) {
        log.echo('Bye then!');
      }
    });
    break;
  case 'remove':
    gitRemoveTag(function (err) {
      if (err) {
        if (err === -1) {
          log.notice(STR_NO_TAGS);
        }
        if (err === USER_ABORT) {
          log.echo('Bye then!');
        }
      }
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
  case 'test':
  case 'wt':
    utilities.git.getAllTags({}, function (err, res) {
      if (res) {
        console.log('==> stdout: ', res.stdout);
      }
    });
    break;
  default:
    log.echo();
    showHelp();
    process.exit(0);
    break;
  }
});
