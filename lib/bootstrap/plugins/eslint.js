var
  _ = require('lodash'),
  fs = require('fs-extra'),
  async = require('async'),
  path = require('path'),
  inquirer = require('inquirer'),
  log = require('fedtools-logs'),

  backup = require('../../backup'),
  common = require('../../common'),

  CURRENT_FOLDER = process.cwd(),
  HOME_FOLDER = process.env.HOME,
  SRC_ESLINT_JSON = {
    BASE: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'base.js')),
    POSSIBLE_ERRORS: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'possible-errors.js')),
    BEST_PRACTICES: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'best-practices.js')),
    VARIABLES: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'variables.js')),
    NODEJS: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'node.js')),
    STYLE: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'style.js')),
    ES6: require(path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'rules', 'es6.js'))
  },

  ESLINT_CHOICES = [{
    checked: true,
    value: 'BEST_PRACTICES',
    short: 'best practices',
    name: 'Best Practices .... Better ways of doing things to help avoid problems'
  }, {
    checked: true,
    value: 'POSSIBLE_ERRORS',
    short: 'possible errors',
    name: 'Possible Errors ... Possible syntax or logic errors in JavaScript code'
  }, {
    checked: true,
    value: 'VARIABLES',
    short: 'variables',
    name: 'Variables ......... Variable declarations'
  }, {
    checked: true,
    value: 'NODEJS',
    short: 'nodejs',
    name: 'Node.js ........... Code running in Node.js or in browsers with CommonJS'
  }, {
    checked: true,
    value: 'STYLE',
    short: 'style',
    name: 'Stylistic Issues .. Recommended style guidelines'
  }, {
    checked: false,
    value: 'ES6',
    short: 'es6',
    name: 'ECMAScript 6 ...... Rules that only apply to ES6'
  }];

module.exports = function (options, callback) {
  async.waterfall([
    function (done) {
      var
        questions = [{
          type: 'list',
          name: 'custom',
          message: 'Please choose from the following options:',
          choices: [{
            value: common.ON,
            short: 'some rules on',
            name: 'Pick and choose group of rules to turn ON'
          }, {
            value: common.OFF,
            short: 'all rules off',
            name: 'Generate a configuration file with all rules turned OFF'
          }],
          validate: function (val) {
            if (!val.length) {
              return 'Press <space> to select one or more rules, or <ctrl-c> to quit...';
            }
            return true;
          }
        }];
      inquirer.prompt(questions).then(function (answers) {
        done(null, answers.custom);
      });
    },
    function (custom, done) {
      var
        questions = [{
          type: 'checkbox',
          name: 'rules',
          message: 'Please choose which ESLint rules you need',
          choices: ESLINT_CHOICES,
          pageSize: ESLINT_CHOICES.length + 1,
          validate: function (val) {
            if (!val.length) {
              return 'Press <space> to select one or more rules, or <ctrl-c> to quit...';
            }
            return true;
          }
        }];
      if (custom === common.ON) {
        inquirer.prompt(questions).then(function (answers) {
          done(null, answers.rules);
        });
      } else {
        return done(null, []);
      }
    },
    function (rules, done) {
      return done(null,
        _.defaultsDeep(
          (_.indexOf(rules, 'ES6') >= 0) ? SRC_ESLINT_JSON.ES6 : '',
          (_.indexOf(rules, 'STYLE') >= 0) ? SRC_ESLINT_JSON.STYLE : '',
          (_.indexOf(rules, 'NODEJS') >= 0) ? SRC_ESLINT_JSON.NODEJS : '',
          (_.indexOf(rules, 'VARIABLES') >= 0) ? SRC_ESLINT_JSON.VARIABLES : '',
          (_.indexOf(rules, 'BEST_PRACTICES') >= 0) ? SRC_ESLINT_JSON.BEST_PRACTICES : '',
          (_.indexOf(rules, 'POSSIBLE_ERRORS') >= 0) ? SRC_ESLINT_JSON.POSSIBLE_ERRORS : '',
          SRC_ESLINT_JSON.BASE
        ));
    },
    function (data, done) {
      return done(null, common.sortObject(data));
    },
    function (data, done) {
      var
        questions = [{
          type: 'list',
          name: 'filename',
          message: 'Choose the name of the file to be created',
          choices: [{
            name: '.eslintrc.json',
            value: '.eslintrc.json'
          }, {
            name: '.eslintrc',
            value: '.eslintrc'
          }]
        }];
      inquirer.prompt(questions).then(function (answers) {
        done(null, data, answers.filename);
      });
    },
    function (data, filename, done) {
      var
        questions = [{
          type: 'list',
          name: 'location',
          message: 'Where do you want the file to be created?',
          choices: [{
            name: 'At the root of the HOME folder',
            short: 'home folder',
            value: HOME_FOLDER
          }, {
            name: 'In the current folder',
            short: 'current folder',
            value: CURRENT_FOLDER
          }]
        }];
      inquirer.prompt(questions).then(function (answers) {
        done(null, data, filename, answers.location);
      });
    },
    function (data, filename, location, done) {
      var
        DEST_ESLINT_CFG = path.join(location, filename);

      if (fs.existsSync(DEST_ESLINT_CFG)) {
        backup(DEST_ESLINT_CFG);
      }
      fs.writeFile(DEST_ESLINT_CFG,
        JSON.stringify(data, null, common.NB_SPACES_FOR_TAB),
        function (err) {
          if (!err) {
            return done(common.USER_IGNORE,
              filename + ' has been created under ' + location);
          } else {
            log.error('Unable to create ' + filename);
            log.echo(err);
            return done(err);
          }
        });
    }
  ], function (err, msg) {
    if (err && (err === common.USER_INTERRUPT || err === common.USER_IGNORE)) {
      if (options.auto) {
        err = null;
      }
    }
    callback(err, options, msg);
  });
};
