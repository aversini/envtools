module.exports = function (grunt) {
  var
    g = require('../globals');

  grunt.registerTask('npm-pre-release', 'Checking if we can release', function () {
    var
      done = this.async(),
      noWrite = grunt.option('no-write') || false;

    if (noWrite) {
      grunt.log.writeln('npm-pre-release dry run');
    }
    grunt.util.spawn({
      cmd: 'git',
      args: ['log', '-2', '--pretty=format:"%s"']
    }, function (err, data) {
      if (!err && data.stdout.match(g.PUBLISH_COMMIT_MSG)) {
        grunt.fail.warn('It looks like it\'s been published already?');
      }
      grunt.util.spawn({
        cmd: 'git',
        args: ['describe', '--dirty']
      }, function (err, data) {
        if (!err && data.stdout.match('-dirty')) {
          grunt.fail.warn('Local repo is dirty. Go clean your room!');
        }
        done(err);
      });
    });
  });
};
