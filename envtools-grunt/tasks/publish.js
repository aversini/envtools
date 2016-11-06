var
  fs = require('fs-extra'),
  semver = require('semver'),
  async = require('async');

module.exports = function (grunt) {
  grunt.registerTask('publish', 'bump, tag, push, publish', function (type) {
    var
      tagName,
      tagMessage,
      commitMessage,
      templateOptions,
      config,
      options,
      noWrite = grunt.option('no-write'),
      force = grunt.option('force'),
      done = this.async(),

      NB_SPACES_FOR_TAB = 2,
      PACKAGE_JSON = 'package.json';

    //
    //-- H E L P E R   F U N C T I O N S
    //
    function setup(file, type) {
      var
        pkg = grunt.file.readJSON(file),
        newVersion = pkg.version;

      if (options.bump) {
        if (semver.valid(type)) {
          newVersion = type;
        } else {
          newVersion = semver.inc(pkg.version, type || 'patch');
        }
      }
      return {
        newVersion: newVersion,
        pkg: pkg
      };
    }

    function ifEnabled(option, task, callback) {
      if (options[option]) {
        if (options[option] === true) {
          // boolean, it's a built-in task
          return task(callback);
        } else {
          // not a boolean, it's an in between task like preflightTasks...
          return task(option, callback);
        }
      } else {
        return callback();
      }
    }

    function runTasks(taskName, callback) {
      var
        log,
        tasks = options[taskName];

      if (Array.isArray(tasks) && tasks.length) {
        log = taskName + ' (' + tasks.join(', ') + ')';
        if (noWrite) {
          log = '[dry-run]: ' + log;
          tasks.push('--no-write');
        }
        if (force) {
          tasks.push('--force');
        }
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'grunt',
          args: tasks
        }, function (err, data) {
          if (err) {
            if (data && data.stderr) {
              grunt.fail.warn(data.stderr);
            }
            if (data && data.stdout) {
              grunt.fail.warn(data.stdout);
            }
          }
          callback(err);
        });
      } else {
        return callback();
      }
    }

    //
    //-- P U B L I S H   T A S K S   F U N C T I O N S
    //
    function bump(callback) {
      var
        log = 'bump to ' + config.newVersion,
        pkg = grunt.file.readJSON(PACKAGE_JSON);

      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        pkg.version = config.newVersion;
        fs.writeFile(PACKAGE_JSON,
          JSON.stringify(pkg, null, NB_SPACES_FOR_TAB) + '\n',
        function (err) {
          callback(err);
        });
      }
    }

    function add(callback) {
      var
        log = 'git add package.json';

      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'git',
          args: ['add', PACKAGE_JSON]
        }, function (err) {
          callback(err);
        });
      }
    }

    function commit(callback) {
      var
        log,
        args,
        msg;

      if (typeof commitMessage === 'string') {
        commitMessage = [commitMessage];
      }
      msg = commitMessage.map(function (el) {
        return '"' + grunt.template.process(el, templateOptions) + '"';
      }).join(' ');

      args = ['commit', '-m', msg];
      log = 'git ' + args.join(' ');
      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'git',
          args: ['commit', '-m', msg]
        }, function (err) {
          callback(err);
        });
      }
    }

    function tag(callback) {
      var
        log,
        args = ['tag', tagName, '-m', '"' + tagMessage + '"'];

      log = 'git ' + args.join(' ');
      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'git',
          args: args
        }, function(err) {
          callback(err);
        });
      }
    }

    function push(callback) {
      var
        log,
        args = ['push', options.remote, 'HEAD'];

      log = 'git ' + args.join(' ');
      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'git',
          args: args
        }, function(err) {
          callback(err);
        });
      }
    }

    function pushTags(callback) {
      var
        log,
        args = ['push', options.remote, tagName];

      log = 'git ' + args.join(' ');
      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'git',
          args: args
        }, function(err) {
          callback(err);
        });
      }
    }

    function npmPublish(callback) {
      var
        args = ['publish'],
        log = 'npm ' + args.join(' ');

      if (noWrite) {
        grunt.log.ok('[dry-run]: ' + log);
        return callback();
      } else {
        grunt.log.ok(log);
        grunt.util.spawn({
          cmd: 'npm',
          args: args
        }, function(err) {
          callback(err);
        });
      }
    }

    //
    //-- A C T U A L   E X E C U T I O N
    //
    options = grunt.util._.extend({
      remote: 'origin',
      preflightTasks: [],
      beforeBump: [],
      bump: false,
      afterBump: [],
      beforeAdd: [],
      add: false,
      afterAdd: [],
      beforeCommit: [],
      commit: false,
      afterCommit: [],
      beforeTag: [],
      tag: false,
      afterTag: [],
      beforePush: [],
      push: false,
      afterPush: [],
      beforePushTags: [],
      pushTags: false,
      afterPushTags: [],
      beforePublish: [],
      publish: false,
      afterPublish: []
    }, (grunt.config.data[this.name] || {}).options);

    config = setup(PACKAGE_JSON, type);
    templateOptions = {
      data: {
        name: config.name || '',
        version: config.newVersion
      }
    };

    tagName = grunt.template.process(grunt.config.getRaw(this.name + '.options.tagName') || '<%= version %>', templateOptions);

    commitMessage = grunt.template.process(grunt.config.getRaw(this.name + '.options.commitMessage') || 'release <%= version %>', templateOptions);

    tagMessage = grunt.template.process(grunt.config.getRaw(this.name + '.options.tagMessage') || 'version <%= version %>', templateOptions);

    if (!config.newVersion) {
      grunt.fail.fatal('Resulting version number is empty.');
      return done();
    }

    if (noWrite) {
      grunt.log.ok('publish dry run');
    }

    async.waterfall([
      function (callback) {
        ifEnabled('preflightTasks', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforeBump', runTasks, callback);
      },
      function (callback) {
        ifEnabled('bump', bump, callback);
      },
      function (callback) {
        ifEnabled('afterBump', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforeAdd', runTasks, callback);
      },
      function (callback) {
        ifEnabled('add', add, callback);
      },
      function (callback) {
        ifEnabled('afterAdd', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforeCommit', runTasks, callback);
      },
      function (callback) {
        ifEnabled('commit', commit, callback);
      },
      function (callback) {
        ifEnabled('afterCommit', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforeTag', runTasks, callback);
      },
      function (callback) {
        ifEnabled('tag', tag, callback);
      },
      function (callback) {
        ifEnabled('afterTag', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforePush', runTasks, callback);
      },
      function (callback) {
        ifEnabled('push', push, callback);
      },
      function (callback) {
        ifEnabled('afterPush', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforePushTags', runTasks, callback);
      },
      function (callback) {
        ifEnabled('pushTags', pushTags, callback);
      },
      function (callback) {
        ifEnabled('afterPushTags', runTasks, callback);
      },
      function (callback) {
        ifEnabled('beforePublish', runTasks, callback);
      },
      function (callback) {
        ifEnabled('publish', npmPublish, callback);
      },
      function (callback) {
        ifEnabled('afterPublish', runTasks, callback);
      }
    ], function (err) {
      done(err);
    });
  });
};
