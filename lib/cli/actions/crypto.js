const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const log = require('fedtools-logs');
const utilities = require('fedtools-utilities');
const common = require('../../common');

module.exports = function (self, program) {
  const status = _.isBoolean(program.status) ? program.status : true;
  const password = _.isString(program.p) ? program.p : null;
  const encrypt = program.encrypt;
  const output = _.isString(program.o) ? program.o : null;

  let file = _.isString(program.f) ? program.f : null;

  function _usage() {
    const msg = [];
    log.echo();
    msg.push('');
    msg.push(log.strToColor('yellow', 'Description:'));
    msg.push('Envtools encrypt|decrypt is a simple command line tool that');
    msg.push('allows you to encrypt or decrypt a file with a password.');
    msg.push('The encryption algorithm used is AES-256-CTR.');
    msg.push(
      'If the password (-p) is not provided, you will be prompted for one.'
    );
    msg.push('');
    msg.push(log.strToColor('yellow', 'Usage:'));
    msg.push('envtools encrypt [-f input] [-o output] [-p password]');
    msg.push('envtools decrypt [-f input] [-o output] [-p password]');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Examples:'));
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

  utilities.cryptographer(
    {
      file,
      output,
      status,
      password,
      encrypt
    },
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
};
