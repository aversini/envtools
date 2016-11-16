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

    'mkdir': {
      all: {
        options: {
          create: ['tmp/local', 'tmp/registry']
        }
      }
    },

    'coveralls': {
      options: {
        src: 'coverage-results/lcov.info',
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: true
      }
    },

    'htmlmin': {
      help: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.html': 'index.html'
        }
      }
    },

    'import': {
      options: {},
      help: {
        src: g.tmpHelpFileHTML,
        dest: g.helpFileHTML
      }
    },

    'copy': {
      help: {
        files: [{
          src: ['data/templates/help/envtools-help.html'],
          dest: 'tmp/help.html'
        }]
      },
      faq: {
        files: [{
          src: ['data/templates/help/envtools-faq.html'],
          dest: 'tmp/envtools-faq.html'
        }]
      },
      sinopia: {
        files: [{
          src: ['data/templates/help/envtools-sinopia.html'],
          dest: 'tmp/envtools-sinopia.html'
        }]
      },
      custom: {
        files: [{
          src: ['data/templates/help/envtools-custom.html'],
          dest: 'tmp/envtools-custom.html'
        }]
      },
      commands: {
        files: [{
          src: ['data/templates/help/envtools-commands.html'],
          dest: 'tmp/envtools-commands.html'
        }]
      },
      intro: {
        files: [{
          src: ['data/templates/help/envtools-intro.html'],
          dest: 'tmp/envtools-intro.html'
        }]
      },
      footer: {
        files: [{
          src: ['data/templates/help/envtools-footer.html'],
          dest: 'tmp/envtools-footer.html'
        }]
      },
      aliases: {
        files: [{
          src: ['data/templates/help/envtools-aliases.html'],
          dest: 'tmp/envtools-aliases.html'
        }]
      }
    },

    'markdown': {
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
    },

    'concat': {
      options: {
        separator: ';\n'
      },
      css: {
        src: [
          'tmp/envtools-min.css',
          'data/assets/css/bootstrap.min.css',
          'tmp/highlight-min.css'
        ],
        dest: 'data/assets/css/bundle.css'
      },
      js: {
        src: [
          'data/assets/js/jquery-3.1.1.slim.min.js',
          'data/assets/js/jquery.highlight.js',
          'data/assets/js/highlight.pack.js',
          'data/assets/js/bootstrap.min.js',
          'data/assets/js/lunr.min.js',
          'data/assets/js/envtools.js'
        ],
        dest: 'data/assets/js/bundle.js'
      }
    },

    'autoprefixer': {
      options: {
        browsers: ['last 2 versions']
      },
      all: {
        src: 'data/assets/css/envtools.css',
        dest: 'tmp/envtools-with-prefixes.css'
      }
    },

    'cssmin': {
      target: {
        files: {
          'tmp/envtools-min.css': ['tmp/envtools-with-prefixes.css'],
          'tmp/highlight-min.css': ['data/assets/css/highlight/default.css']
        }
      }
    },

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
          'help-generate',
          'history-help-add-commit'
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

  grunt.registerTask('help-generate', [
    'clean',
    'copy',
    'lunrjs-index',
    'help-json-data',
    'markdown:rawHistory',
    'import:help',
    'htmlmin:help',
    'autoprefixer',
    'cssmin',
    'concat:js',
    'concat:css'
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
