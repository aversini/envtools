module.exports = function (grunt) {
  var
    g = require('../globals');

  grunt.registerTask('history-help-add-commit', 'Git add/commit ' + g.historyFile, function () {
    var
      done = this.async(),
      commitMsg = g.UPDATING_HISTORY_COMMIT_MSG + ' [skip ci]',
      noWrite = grunt.option('no-write') || false,
      args = ['add',
        g.historyFile,
        g.bashVersionFile,
        g.helpFileHTML,
        g.bundleCSS,
        g.bundleJS
      ];

    if (noWrite) {
      grunt.log.writeln('history-help-add-commit dry run');
      grunt.log.ok('git ' + args.join(' '));
      grunt.log.ok('git commit -m ' + commitMsg);
      grunt.log.ok('git push');
      return done();
    } else {
      grunt.util.spawn({
        cmd: 'git',
        args: args
      }, function (err) {
        if (err) {
          grunt.fail.fatal('Unable to run "git add" ' + err);
          return done();
        } else {
          grunt.util.spawn({
            cmd: 'git',
            args: ['commit', '-m', commitMsg]
          }, function (err) {
            if (err) {
              grunt.fail.fatal('Unable to run "git commit" ' + err);
              return done();
            }
          });
        }
      });
    }
  });
};
