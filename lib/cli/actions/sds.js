var
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands');

module.exports = function (self, program) {
  var
    command = program._[1];

  if (command) {
    cmd.sudo(command, {
      status: true
    }, function (err) {
      if (err) {
        log.red(err);
      } else {
        log.success(' ' + command);
      }
    });
  } else {
    log.error('Usage: envtools sds \'some command\'');
  }
};
