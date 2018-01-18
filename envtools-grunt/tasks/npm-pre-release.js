/* eslint-disable */
module.exports = function (grunt) {
  var
    fs = require('fs-extra'),
    path = require('path'),
    g = require('../globals'),
    status,
    RUNTIME_DIR = process.env.RUNTIME_DIR || '';


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
        if (noWrite) {
          grunt.log.warn('[dry-run] It looks like it\'s been published already?');
        } else {
          grunt.fail.warn('It looks like it\'s been published already?');
        }
      }
      grunt.util.spawn({
        cmd: 'git',
        args: ['describe', '--dirty']
      }, function (err, data) {
        if (!err && data.stdout.match('-dirty')) {
          if (noWrite) {
            grunt.log.warn('[dry-run] Local repo is dirty. Go clean your room!');
          } else {
            grunt.fail.warn('Local repo is dirty. Go clean your room!');
          }
        }
        done(err);
      });
    });
  });
};
