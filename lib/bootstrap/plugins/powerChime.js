const waterfall = require('async/waterfall');
const inquirer = require('inquirer');
const cmd = require('fedtools-commands');
const common = require('../../common');

module.exports = function (options, callback) {
  const cmdON = [
    'defaults write com.apple.PowerChime ChimeOnAllHardware -bool true',
    'open /System/Library/CoreServices/PowerChime.app'
  ];
  const cmdOFF = [
    'defaults write com.apple.PowerChime ChimeOnAllHardware -bool false',
    'killall PowerChime'
  ];
  const questions = {
    type: 'confirm',
    name: 'change',
    message: 'Play a power charging sound effect when plugged in?',
    default: true
  };

  function _toggle(flag, done) {
    waterfall(
      [
        function (goodToGo) {
          if (flag) {
            // array of commands, not async
            cmd.run(cmdON, {
              status: true
            });
          } else {
            // array of commands, not async
            cmd.run(cmdOFF, {
              status: true
            });
          }
          goodToGo();
        }
      ],
      function (err) {
        done(err, options);
      }
    );
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
