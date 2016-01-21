module.exports = function (grunt) {
  grunt.registerTask('pack', 'Create package', function () {
    var done = this.async();
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    grunt.util.spawn({
      cmd: 'npm',
      args: ['pack']
    }, function (err) {
      done(err);
    });
  });
};
