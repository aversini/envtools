module.exports = function (grunt) {
  grunt.registerTask('diffd', 'Runs a diffd', function () {
    var done = this.async();
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    grunt.util.spawn({
      cmd: 'diff',
      args: ['-b', '-q', '-r', 'local', 'registry'],
      opts: {
        cwd: 'tmp'
      }
    }, function (err, data) {
      if (data.stdout) {
        console.log('\n', data.stdout);
      }
      done(err);
    });
  });
};
