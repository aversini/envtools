module.exports = function (grunt) {
  grunt.registerTask('bash-version', 'Generating version for bash', function () {
    var
      g = require('../globals'),
      noWrite = grunt.option('no-write') || false,
      version = grunt.config.get('pkg').version,
      done = this.async();

    if (noWrite) {
      grunt.log.writeln('bash-version dry run');
    }
    if (!noWrite) {
      grunt.file.write(g.bashVersionFile, version);
    } else {
      grunt.log.ok('bash-version: write file');
    }
    done();
  });
};
