const fs = require("fs-extra");
const _ = require("lodash");
const waterfall = require("async/waterfall");
const inquirer = require("inquirer");
const common = require("../common");

module.exports = function(options, choices, callback) {
  let res, questions;

  const autoMode = function() {
    // Creating the first function for waterfall in TYPE_AUTO mode
    function _entryPoint(done) {
      return done(null, options);
    }
    // we are in auto mode, we need less confirmations
    options.auto = true;
    // we also need to cleanup the resume_auto file if any
    fs.removeSync(common.ENVTOOLS.RESUME_AUTO);
    // need to run each commands in waterfall,
    // so extracting all fct and putting them into
    // an array (for async.waterfall)
    res = _.map(choices[common.TYPE_AUTO], function(item) {
      return item.fct;
    });
    // adding the first function for waterfall on top of the list
    res.unshift(_entryPoint);
    // and finally running the show
    waterfall(res, function(err) {
      // marking the fact that auto mode has been
      // done at least once.
      if (!err) {
        fs.ensureFileSync(common.ENVTOOLS.AUTO_DONE);
      }
      callback(err);
    });
  };

  // if AUTO_DONE file exists, ask the user if he
  // really wants to run auto again.
  if (fs.existsSync(common.ENVTOOLS.AUTO_DONE)) {
    questions = {
      type: "confirm",
      name: "goodToGo",
      message: "About to run in auto-mode, do you want to continue?",
      default: false
    };
    inquirer.prompt(questions).then(function(answers) {
      if (answers.goodToGo) {
        return autoMode();
      } else {
        return callback(common.USER_INTERRUPT);
      }
    });
  } else {
    return autoMode();
  }
};
