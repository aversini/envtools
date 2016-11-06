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

    function ifEnabled(option, fn, callback) {
      if (options[option]) {
        return fn;
      } else {
        return callback;
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
          JSON.stringify(pkg, null, NB_SPACES_FOR_TAB) + '\n', callback);
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
        }, callback);
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
        }, callback);
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
        }, callback);
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
        }, callback);
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
        }, callback);
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
        }, callback);
      }
    }

    //
    //-- A C T U A L   E X E C U T I O N
    //
    options = grunt.util._.extend({
      remote: 'origin',
      preflightTasks: [],
      bump: true,
      add: true,
      commit: true,
      tag: true,
      beforePush: [],
      push: true,
      pushTags: true,
      publish: true
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
        ifEnabled('preflightTasks', runTasks('preflightTasks', callback), callback);
      },
      function (callback) {
        ifEnabled('bump', bump(callback), callback);
      },
      function (callback) {
        ifEnabled('add', add(callback), callback);
      },
      function (callback) {
        ifEnabled('commit', commit(callback), callback);
      },
      function (callback) {
        ifEnabled('tag', tag(callback), callback);
      },
      function (callback) {
        ifEnabled('beforePush', runTasks('beforePush', callback), callback);
      },
      function (callback) {
        ifEnabled('push', push(callback), callback);
      },
      function (callback) {
        ifEnabled('pushTags', pushTags(callback), callback);
      },
      function(callback) {
        ifEnabled('npm', npmPublish(callback), callback);
      },
      function (callback) {
        callback();
      }
    ], function (err) {
      done(err);
    });
  });
};
