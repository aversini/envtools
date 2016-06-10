var
  fs = require('fs-extra'),
  async = require('async'),
  inquirer = require('inquirer'),
  path = require('path'),
  rimraf = require('rimraf'),

  common = require('../common');

module.exports = function (options, callback) {
  var
    envtoolsBanner = path.join(common.RUNTIME_DIR, 'envtools-banner'),
    questions = [{
      type: 'confirm',
      name: 'change',
      message: 'Do you want to add a welcome banner to all sessions?',
      default: true
    }];

  function _enableEnvtoolsBanner(flag, done) {
    async.waterfall([
      function (goodToGo) {
        if (flag) {
          fs.writeFile(envtoolsBanner, 'true', goodToGo);
        } else {
          rimraf(envtoolsBanner, {}, goodToGo);
        }
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _enableEnvtoolsBanner(true, callback);
  } else {
    inquirer.prompt(questions).then(function (answers) {
      _enableEnvtoolsBanner(answers.change, callback);
    });
  }
};
