module.exports = function (grunt) {
  grunt.registerTask('check', 'Check the npm release validity', function (env) {
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    grunt.task.run('clean');
    grunt.task.run('mkdir');
    if (env && env === 'noproxy') {
      grunt.task.run('curl:noproxy');
    } else {
      grunt.task.run('curl:proxy');
    }
    grunt.task.run('pack');
    grunt.task.run('copy');
    grunt.task.run('pack-remove');
    grunt.task.run('untar');
    grunt.task.run('diffd');
  });
};
