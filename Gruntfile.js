module.exports = function (grunt) {

  var
    path = require('path'),
    g = require('./envtools-grunt/globals');

  // show fancy time for grunt tasks
  require('time-grunt')(grunt);

  // load plugins
  require('load-grunt-tasks')(grunt);

  // load envtools tasks
  grunt.loadTasks('envtools-grunt/tasks');

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['./tmp/*'],

    curl: {
      proxy: {
        src: [{
          url: 'http://registry.npmjs.org/<%=pkg.name%>/-/<%=pkg.name%>-<%=pkg.version%>.tgz',
          proxy: 'http://proxy.wellsfargo.com'
        }],
        dest: './tmp/registry-<%=pkg.name%>-<%=pkg.version%>.tgz'
      },
      noproxy: {
        src: [{
          url: 'http://registry.npmjs.org/<%=pkg.name%>/-/<%=pkg.name%>-<%=pkg.version%>.tgz'
        }],
        dest: './tmp/registry-<%=pkg.name%>-<%=pkg.version%>.tgz'
      }
    },

    copy: {
      main: {
        files: [{
          src: '<%=pkg.name%>-<%=pkg.version%>.tgz',
          dest: 'tmp/local-<%=pkg.name%>-<%=pkg.version%>.tgz'
        }]
      }
    },

    mkdir: {
      all: {
        options: {
          create: ['tmp/local', 'tmp/registry']
        },
      },
    },

    coveralls: {
      options: {
        src: 'coverage-results/lcov.info',
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: true
      }
    },

    release: {
      options: {
        bump: true,
        add: true,
        commit: true,
        tag: true,
        push: true,
        pushTags: true,
        npm: true,
        commitMessage: g.PUBLISH_COMMIT_MSG + ' <%= version %> [skip ci]',
        beforeRelease: ['history']
      }
    },

    markdown: {
      envtools: {
        files: [{
          expand: false,
          src: g.historyFile,
          dest: g.historyFileHTML,
        }],
        options: {
          template: path.join('data', 'templates', 'history', 'envtools-history.jst'),
          templateContext: {
            pageTitle: 'Envtools History',
            headerTitle: 'Envtools commit history'
          }
        }
      }
    }

  });

  // register multi-tasks aliases
  grunt.registerTask('default', ['help']);
  grunt.registerTask('history', [
    'history-generate',
    'history-add-commit-push'
  ]);
  grunt.registerTask('publish', [
    'npm-pre-release',
    'test',
    'bash-version',
    'release'
  ]);


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
    console.log('Type "grunt check" to:');
    console.log(' - check if the newly published package is valid.');
  });
};
