module.exports = function (grunt) {
  grunt.registerTask('test', 'Run code coverage and unit tests', function () {
    var done = this.async();
    grunt.util.spawn({
      cmd: 'npm',
      args: ['test']
    }, function (err, data) {
      if (!err) {
        grunt.log.write(data);
      }
      done(err);
    });
  });
};
