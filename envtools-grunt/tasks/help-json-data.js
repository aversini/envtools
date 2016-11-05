module.exports = function (grunt) {
  grunt.registerTask('help-json-data', 'Generating json data for help file', function () {
    var
      g = require('../globals'),
      noWrite = grunt.option('no-write') || false,
      version = grunt.config.get('pkg').version,
      done = this.async();

    if (noWrite) {
      grunt.log.writeln('help-json-data dry run ' + version);
    }
    if (!noWrite) {
      grunt.file.write(g.helpJsonDataFile,
        '<script id="envtools-data" type="json/application-data">{' +
          '"version": "' + version + '"' +
        '}</script>');
    } else {
      grunt.log.ok('help-json-data: write file');
    }
    done();
  });
};
