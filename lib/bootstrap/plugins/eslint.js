const
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
  SRC_ESLINT_CFG = {
    CORE: path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'core.json'),
    ES6: path.join(common.ENVTOOLS.THIRDDIR,
      'eslint', 'es6-only.json')
  },
  DEST_ESLINT_CFG_NAME = '.eslintrc.json';

module.exports = function (options, callback) {
  async.waterfall([
    function (done) {
      const
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install ESLint configuration, continue?',
          default: true
        };
      inquirer.prompt(questions).then(function (answers) {
        options.actionsPending++;
        if (answers.goForIt) {
          options.actionsDone++;
          return done();
        } else {
          return done(common.USER_INTERRUPT);
        }
      });
    },
    function (done) {
      const
        questions = [{
          type: 'list',
          name: 'es6',
          message: 'Please choose which ESLint rules you need',
          choices: [{
            name: 'All the core rules',
            value: false
          }, {
            name: 'All the core rules plus ECMAScript 6 validation',
            value: true
          }]
        }];
      inquirer.prompt(questions).then(function (answers) {
        done(null, answers.es6);
      });
    },
    function (es6, done) {
      const
        coreJson = require(SRC_ESLINT_CFG.CORE),
        es6Json = require(SRC_ESLINT_CFG.ES6);

      if (es6) {
        return done(null, _.defaultsDeep(es6Json, coreJson));
      } else {
        return done(null, coreJson);
      }
    },
    function (data, done) {
      const
        questions = [{
          type: 'list',
          name: 'location',
          message: 'Where do you want the file to be created?',
          choices: [{
            name: 'At the root of the HOME folder',
            short: 'Home Folder',
            value: HOME_FOLDER
          }, {
            name: 'In the current folder',
            short: 'Current Folder',
            value: CURRENT_FOLDER
          }]
        }];
      inquirer.prompt(questions).then(function (answers) {
        done(null, data, answers.location);
      });
    },
    function (data, location, done) {
      const
        DEST_ESLINT_CFG = path.join(location, DEST_ESLINT_CFG_NAME);

      if (fs.existsSync(DEST_ESLINT_CFG)) {
        backup(DEST_ESLINT_CFG);
      }
      fs.writeFile(DEST_ESLINT_CFG,
        JSON.stringify(data, null, common.NB_SPACES_FOR_TAB),
        function (err) {
          if (!err) {
            return done(common.USER_IGNORE,
              `${DEST_ESLINT_CFG_NAME} has been created under ${location}`);
          } else {
            log.error(`Unable to create ${DEST_ESLINT_CFG_NAME}`);
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
