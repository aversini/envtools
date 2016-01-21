module.exports = function (grunt) {
  var
    g = require('../globals');

  grunt.registerTask('history-add-commit-push', 'Git add/commit/push ' + g.historyFile, function () {
    var
      done = this.async(),
      commitMsg = g.UPDATING_HISTORY_COMMIT_MSG + ' [skip ci]',
      noWrite = grunt.option('no-write') || false;

    if (noWrite) {
      grunt.log.writeln('history-add-commit-push dry run');
      grunt.log.ok('git add ' + g.historyFile + ' ' + g.historyFileHTML + ' ' + g.bashVersionFile);
      grunt.log.ok('git commit -m ' + commitMsg);
      grunt.log.ok('git push');
      done();
    } else {
      grunt.util.spawn({
        cmd: 'git',
        args: ['add',
          g.historyFile,
          g.historyFileHTML,
          g.bashVersionFile
        ]
      }, function (err) {
        if (err) {
          grunt.fail.fatal('Unable to run "git add" ' + err);
          done();
        } else {
          grunt.util.spawn({
            cmd: 'git',
            args: ['commit', '-m', commitMsg]
          }, function (err) {
            if (err) {
              grunt.fail.fatal('Unable to run "git commit" ' + err);
              done();
            } else {
              grunt.util.spawn({
                cmd: 'git',
                args: ['push']
              }, function (err) {
                if (err) {
                  grunt.fail.fatal('Unable to run "git push" ' + err);
                }
                done();
              });
            }
          });
        }
      });
    }
  });
};
