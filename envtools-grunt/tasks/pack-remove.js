module.exports = function (grunt) {
  grunt.registerTask('pack-remove', 'Remove package', function () {
    var version = grunt.config.get('pkg').version,
      name = grunt.config.get('pkg').name;
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    grunt.file.delete(name + '-' + version + '.tgz');
  });
};
