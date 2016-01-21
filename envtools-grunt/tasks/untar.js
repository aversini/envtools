module.exports = function (grunt) {
  grunt.registerTask('untar', 'Untar packages', function () {
    var done = this.async(),
      version = grunt.config.get('pkg').version,
      name = grunt.config.get('pkg').name,
      localName = 'local-' + name + '-' + version + '.tgz',
      regName = 'registry-' + name + '-' + version + '.tgz';
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    grunt.util.spawn({
      cmd: 'tar',
      args: ['xzf', regName, '-C', 'registry'],
      opts: {
        cwd: 'tmp'
      }
    }, function () {
      grunt.util.spawn({
        cmd: 'tar',
        args: ['xzf', localName, '-C', 'local'],
        opts: {
          cwd: 'tmp'
        }
      }, function (err) {
        done(err);
      });

    });
  });
};
