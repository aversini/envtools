const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const log = require('fedtools-logs');
const cryptographer = require('../../utilities/cryptographer');
const common = require('../../common');
const prompts = require('../../utilities/prompts');

const FILE_ENCODING = 'utf8';

const _getPassword = (password, msg, cb) => {
  if (!password) {
    prompts.displayPromptWithPassword(msg, cb);
  } else {
    return cb(null, password);
  }
};

const _prompt = (options, done) => {
  let file;

  if (!options.file || !fs.existsSync(options.file)) {
    throw 'Invalid argument, file is missing';
  } else {
    file = path.resolve(options.file);
  }
  if (!options.output) {
    // no output, let's use stdout and disable status logging.
    options.status = false;
  }

  const promptMsg = options.encrypt
    ? 'Enter password to encrypt file:'
    : 'Enter password to decrypt file:';

  _getPassword(options.password, promptMsg, function (err, pass) {
    if (err) {
      throw err;
    }
    if (options.encrypt) {
      if (options.status) {
        log.info('Encrypting file...');
      }
      fs.readFile(file, FILE_ENCODING, function (err, data) {
        if (err) {
          throw err;
        }
        if (!options.output) {
          process.stdout.write(cryptographer.encrypt(pass, data));
          return done(null, options);
          // return new Promise((resolve) => {
          //   resolve(options);
          // });
        } else {
          fs.writeFile(options.output, cryptographer.encrypt(pass, data), 'utf8', function (
            err
          ) {
            if (err) {
              throw err;
            }
            if (options.status) {
              log.success(`${path.basename(file)} was successfully encrypted.`);
              log.echo('Encrypted file is ', options.output);
            }
            return done(null, options);
            // return new Promise((resolve) => {
            //   resolve(options);
            // });
          });
        }
      });
    } else {
      if (options.status) {
        log.info('Decrypting file...');
      }
      fs.readFile(file, FILE_ENCODING, function (err, data) {
        if (err) {
          throw err;
        }
        if (!options.output) {
          process.stdout.write(cryptographer.decrypt(pass, data));
          return done(null, options);
          // return new Promise((resolve) => {
          //   resolve(options);
          // });
        } else {
          fs.writeFile(
            options.output,
            cryptographer.decrypt(pass, data),
            FILE_ENCODING,
            function (err) {
              if (err) {
                throw err;
              }
              if (options.status) {
                log.success(
                  `${path.basename(file)} was successfully decrypted.`
                );
                log.echo('Decrypted file is ', options.output);
              }
              return done(null, options);
              // return new Promise((resolve) => {
              //   resolve(options);
              // });
            }
          );
        }
      });
    }
  });
};

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


  _prompt(
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
