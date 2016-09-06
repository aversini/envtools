module.exports = function (grunt) {
  grunt.registerTask('history-generate', 'Generating history files', function () {
    var
      g = require('../globals'),
      noWrite = grunt.option('no-write') || false,
      done = this.async();

    if (noWrite) {
      grunt.log.writeln('history-generate dry run');
    }
    require('fedtools-utilities').git.getChangeLog({
      commitTemplate: '- %s ([%h](https://github.com/aversini/envtools/commit/%H))',
      ignore: [
        g.PUBLISH_COMMIT_MSG,
        g.UPDATING_HISTORY_COMMIT_MSG,
        g.WIP_COMMIT_MSG,
        g.MERGE1_COMMIT_MSG,
        g.MERGE2_COMMIT_MSG
      ]
    }, function (err, log) {
      if (!err) {
        if (!noWrite) {
          grunt.file.write(g.historyFile, log);
          grunt.task.run('markdown:history');
        } else {
          grunt.log.ok('history-generate: fedtools-utilities.git.getChangeLog');
          grunt.log.ok('history-generate: markdown:history');
        }
      }
      done(err);
    });
  });
};
