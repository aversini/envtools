const log = require('fedtools-logs');

module.exports = function (self, program, optimist) {
  if (
    program._.length === 0 ||
    (program._.length > 1 && program._[0] !== 'help')
  ) {
    if (program.version || program.V) {
      self.version.printCurrentVersion(program.boring, function () {
        // nothing to declare
      });
    } else {
      log.debug('command not found');
      self.help.printUsage(optimist.help(), program, self.version);
    }
  } else if (program.version || program.V) {
    self.version.printCurrentVersion(program.boring, function () {
      // nothing to declare
    });
  } else {
    self.help.printUsage(optimist.help(), program, self.version);
  }
};
