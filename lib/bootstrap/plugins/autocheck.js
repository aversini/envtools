var
  version = require('./version'),
  inquirer = require('inquirer'),
  common = require('../../common');

module.exports = function (options, callback) {
  var
    questions = [{
      type: 'confirm',
      name: 'goodToGo',
      message: 'Do you want Envtools to periodically check for update?'
    }];

  inquirer.prompt(questions).then(function (answers) {
    options.actionsPending++;
    if (answers.goodToGo) {
      options.toggleOptions[common.ENVTOOLS.CFG_AUTOCHECK] = common.ON;
    } else {
      options.toggleOptions[common.ENVTOOLS.CFG_AUTOCHECK] = common.OFF;
    }
    version(options, function () {
      options.actionsDone++;
      callback(null, options);
    });
  });
};
