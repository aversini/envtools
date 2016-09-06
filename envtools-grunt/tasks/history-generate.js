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
      commitTemplate: '- %s',
      ignore: [g.PUBLISH_COMMIT_MSG, g.UPDATING_HISTORY_COMMIT_MSG, g.WIP]
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
