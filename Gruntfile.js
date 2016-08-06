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
    pkg: grunt.file.readJSON('package.json'),

    clean: ['./tmp/*'],

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
        }
      }
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

    htmlmin: { // Task
      help: { // Target
        options: { // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: { // Dictionary of files
          'envtools-help.html': 'envtools-help.html'
        }
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
        beforeRelease: [
          'bash-version',
          'history-generate',
          'help-generate',
          'history-help-add-commit-push'
        ]
      }
    },
    import: {
      options: {},
      help: {
        src: g.tmpHelpFileHTML,
        dest: g.helpFileHTML
      }
    },
    markdown: {
      aliases: {
        files: [{
          expand: false,
          src: g.aliasesFileMd,
          dest: g.tmpHelpFileHTML
        }],
        options: {
          gfm: true,
          template: path.join('data', 'templates', 'help', 'envtools-help.jst'),
          templateContext: {
            pageTitle: 'Envtools Help',
            headerTitle: 'Envtools Help'
          }
        }
      },
      rawHistory: {
        files: [{
          expand: false,
          src: g.historyFile,
          dest: g.historyRawFileHTML
        }],
        options: {
          gfm: true,
          template: path.join('data', 'templates', 'help', 'envtools-history-raw.jst')
        }
      },
      history: {
        files: [{
          expand: false,
          src: g.historyFile,
          dest: g.historyFileHTML
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

  grunt.registerTask('help-generate', [
    'markdown:rawHistory',
    'markdown:aliases',
    'import:help',
    'htmlmin:help'
  ]);

  grunt.registerTask('publish', [
    'npm-pre-release',
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
  });
};
