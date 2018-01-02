var
  waterfall = require('async/waterfall'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),

  common = require('../../common');


module.exports = function (options, callback) {
  var
    cmdON = [
      'defaults write com.apple.PowerChime ChimeOnAllHardware -bool true',
      'open /System/Library/CoreServices/PowerChime.app'
    ],
    cmdOFF = [
      'defaults write com.apple.PowerChime ChimeOnAllHardware -bool false',
      'killall PowerChime'
    ],

    questions = {
      type: 'confirm',
      name: 'change',
      message: 'Play a power charging sound effect when plugged in?',
      default: true
    };

  function _toggle(flag, done) {
    waterfall([
      function (goodToGo) {
        if (flag) {
          cmd.run(cmdON, {
            status: true
          }); // array of commands, not async
        } else {
          cmd.run(cmdOFF, {
            status: true
          }); // array of commands, not async
        }
        goodToGo();
      }
    ], function (err) {
      done(err, options);
    });
  }

  if (options.auto) {
    _toggle(true, function () {
      return callback(common.USER_IGNORE, options);
    });
  } else {
    inquirer.prompt(questions).then(function (answers) {
      _toggle(answers.change, function () {
        return callback(common.USER_IGNORE, options);
      });
    });
  }
};
