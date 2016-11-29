var
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs-extra'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),
  common = require('../../common');


module.exports = function (self, program) {
  var
    status = _.isBoolean(program.status) ? program.status : true,
    password = _.isString(program.p) ? program.p : null,
    encrypt = program.encrypt,
    file = _.isString(program.f) ? program.f : null,
    output = _.isString(program.o) ? program.o : null;

  function _usage() {
    var msg = [];
    log.echo();
    msg.push('');
    msg.push('Envtools encrypt|decrypt is a simple command line tool that');
    msg.push('allows you to encrypt or decrypt a file with a password.');
    msg.push('The encryption algorithm used is AES-256-CTR.');
    msg.push('If the password (-p) is not provided, you will be prompted for one.');
    msg.push('');
    msg.push(log.strToColor('cyan', 'Usage:'));
    msg.push('envtools encrypt [-f input] [-o output] [-p password]');
    msg.push('envtools decrypt [-f input] [-o output] [-p password]');
    msg.push('');
    msg.push(log.strToColor('cyan', 'Examples:'));
    msg.push('$ envtools encrypt -f plain-file.txt -o encrypted-file.txt');
    msg.push('$ envtools decrypt -f encrypted-file.txt -o plain-file.txt');
    msg.push('');
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
    log.echo();
    process.exit(1);
  }
  if (!file || !fs.existsSync(file)) {
    _usage('Invalid argument, file is missing (-f)');
  } else {
    file = path.resolve(file);
  }

  utilities.cryptographer({
    file: file,
    output: output,
    status: status,
    password: password,
    encrypt: encrypt
  }, function (err) {
    if (err) {
      throw err;
    }
  });
};
