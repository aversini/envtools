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
      type: 'list',
      name: 'banner',
      message: 'Please choose one of the following options',
      choices: [{
        name: 'Enable Envtools Welcome Banner',
        value: common.ON
      }, {
        name: 'Disable Envtools Welcome Banner',
        value: common.OFF
      }]
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
      var
        res = (answers.banner === common.ON) ? true : false;
      _enableEnvtoolsBanner(res, callback);
    });
  }
};
