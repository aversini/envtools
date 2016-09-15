var
  fs = require('fs-extra'),
  async = require('async'),
  path = require('path'),
  inquirer = require('inquirer'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),

  common = require('../common');

module.exports = function (options, callback) {
  async.waterfall([
    function (done) {
      var
        questions = {
          type: 'confirm',
          name: 'goForIt',
          message: 'About to install a custom Terminal theme, continue?',
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
      var
        msg = [],
        filename = 'Envtools.terminal',
        destFile = path.join(process.env.HOME, 'Desktop', filename),
        srcFile = path.join(common.ENVTOOLS.THIRDDIR, 'terminal', filename);

      cmd.run('open ' + srcFile, {
        status: false
      }, function (err) {
        if (err) {
          // unable to install it, let's copy the file to the desktop
          fs.copy(srcFile, destFile, function () {
            msg.push(log.strToColor('yellow', '                      I N S T R U C T I O N S\n'));
            msg.push('A customized Terminal theme provided by Envtools has been dropped');
            msg.push('on your desktop. You need to install it manually, but it\'s a very');
            msg.push('simple process.\n');
            msg.push('Open the Terminal, hit <CMD ,> (or just open the Preferences).\n');
            msg.push('Click on the tab called ' +
              log.strToColor('yellow', '"Profiles"') + '. At the bottom left, there is a');
            msg.push('cog icon next to a + and - icons. Click on it and choose');
            msg.push(log.strToColor('yellow', '"Import..."') + '. Choose the Envtools Theme file on your desktop: the');
            msg.push('file name is ' + log.strToColor('cyan', filename) + '.\n');
            msg.push('Scroll to the top of the list of themes and select Envtools. Click');
            msg.push('on ' + log.strToColor('yellow', '"Default"') + ' - next to the previous cog button, and you are set!\n');
            msg.push('Open a new terminal window and enjoy!');
            log.printMessagesInBox(msg);
            return done(common.USER_IGNORE);
          });
        } else {
          msg.push(log.strToColor('yellow', '                      I N S T R U C T I O N S\n'));
          msg.push('A customized Terminal theme provided by Envtools has been automatically');
          msg.push('installed. To make it a default is a very simple process.\n');
          msg.push('Open the Terminal preferences and click on the tab called ' + log.strToColor('yellow', '"Profiles"') + '.\n');
          msg.push('Scroll to the top of the list of themes and select Envtools. Click');
          msg.push('on ' + log.strToColor('yellow', '"Default"') + ' - next to the bottom left cog button, and you are set!\n');
          msg.push('Open a new terminal window and enjoy!');
          log.printMessagesInBox(msg);
          return done(common.USER_IGNORE);
        }
      });
    }
  ], function (err) {
    callback(err, options);
  });
};
