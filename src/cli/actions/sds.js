const log = require("fedtools-logs");
const cmd = require("fedtools-commands");

module.exports = function(self, program) {
  const command = program._[1];

  if (command) {
    cmd.sudo(
      command,
      {
        status: true
      },
      function(err, stderr, stdout) {
        if (err) {
          if (stderr) {
            log.error(stderr);
          } else {
            log.red(err);
          }
        } else {
          log.success(` ${command}`);
          if (stdout) {
            log.rainbow(stdout);
          }
        }
      }
    );
  } else {
    log.error("Usage: envtools sds 'some command'");
  }
};
