/* eslint no-console:0*/
module.exports = function (grunt) {
  var
    path = require('path'),
    g = require('./envtools-grunt/globals');

  // load plugins
  require('load-grunt-tasks')(grunt);

  // load envtools tasks
  grunt.loadTasks('envtools-grunt/tasks');

  // project configuration
  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),

    'clean': ['./tmp/*'],

    'publish': {
      options: {
        preflightTasks: ['npm-pre-release'],
        bump: true,
        add: true,
        commit: true,
        tag: true,
        beforePush: [
          'bash-version',
          'history-generate',
          'history-add-commit'
        ],
        push: true,
        pushTags: true,
        publish: true,
        commitMessage: g.PUBLISH_COMMIT_MSG + ' <%= version %> [skip ci]'
      }
    }
  });

  // register multi-tasks aliases
  grunt.registerTask('default', ['help']);

  grunt.registerTask('help', 'Display help usage', function () {
    grunt.log.subhead('Grunt [ ' + this.name.cyan + ' ]');
    console.log();
    console.log('Type "grunt publish" to:');
    console.log(' - bump the version in package.json file.');
    console.log(' - stage the package.json file\'s change.');
    console.log(' - commit that change.');
    console.log(' - create a new git tag for the release.');
    console.log(' - push the changes out to github.');
    console.log(' - push the new tag out to github.');
    console.log(' - publish the new version to npm.');
    console.log();
  });
};
