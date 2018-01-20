/**
 * Method that encrypt or decrypt a given file.
 *
 * @method  cryptographer
 * @async
 * @param  {Object}   options           Configuration object.
 * @param  {String}   options.file      The file to encrypt/decrypt.
 * @param  {String}   options.output    The output file - if not provided, writes to stdout.
 * @param  {Boolean}  options.status    Flag to show command status or not.
 * @param  {Boolean}  options.encrypt   True to encrypt, false to decrypt.
 * @param  {String}   options.password  The password used to encrypt/decrypt the file.
 *                                      If not provided, it will be prompted on the CLI.
 * @return  {Promise} done              Promise fulfilled.
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const log = require('fedtools-logs');
const CRYPTO_ALGO = 'aes-256-ctr';

function _encrypt(password, buffer) {
  const cipher = crypto.createCipher(CRYPTO_ALGO, password);
  const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return crypted;
}

function _decrypt(password, buffer) {
  const decipher = crypto.createDecipher(CRYPTO_ALGO, password);
  const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return dec;
}

function _getPassword(password, msg, cb) {
  const questions = {
    type: 'password',
    name: 'password',
    message: msg || 'Enter password:',
    validate(val) {
      if (!val) {
        return 'Password cannot be empty...';
      }
      return true;
    }
  };
  if (!password) {
    inquirer.prompt(questions).then(function (answers) {
      cb(null, answers.password);
    });
  } else {
    return cb(null, password);
  }
}

const _prompt = (options) => {
  let file, promptMsg;

  if (!options.file || !fs.existsSync(options.file)) {
    throw 'Invalid argument, file is missing';
  } else {
    file = path.resolve(options.file);
  }
  if (!options.output) {
    // no output, let's use stdout and disable status logging.
    options.status = false;
  }
  if (options.encrypt) {
    promptMsg = 'Enter password to encrypt file:';
  } else {
    promptMsg = 'Enter password to decrypt file:';
  }

  _getPassword(options.password, promptMsg, function (err, pass) {
    if (err) {
      throw err;
    }
    if (options.encrypt) {
      if (options.status) {
        log.info('Encrypting file...');
      }
      fs.readFile(file, function (err, data) {
        if (err) {
          throw err;
        }
        if (!options.output) {
          process.stdout.write(_encrypt(pass, data));
          // return done(null, options);
          return new Promise((resolve) => {
            resolve(options);
          });
        } else {
          fs.writeFile(options.output, _encrypt(pass, data), function (err) {
            if (err) {
              throw err;
            }
            if (options.status) {
              log.success(`${path.basename(file)} was successfully encrypted.`);
              log.echo('Encrypted file is ', options.output);
            }
            // return done(null, options);
            return new Promise((resolve) => {
              resolve(options);
            });
          });
        }
      });
    } else {
      if (options.status) {
        log.info('Decrypting file...');
      }
      fs.readFile(file, function (err, data) {
        if (err) {
          throw err;
        }
        if (!options.output) {
          process.stdout.write(_decrypt(pass, data));
          // return done(null, options);
          return new Promise((resolve) => {
            resolve(options);
          });
        } else {
          fs.writeFile(options.output, _decrypt(pass, data), function (err) {
            if (err) {
              throw err;
            }
            if (options.status) {
              log.success(`${path.basename(file)} was successfully decrypted.`);
              log.echo('Decrypted file is ', options.output);
            }
            // return done(null, options);
            return new Promise((resolve) => {
              resolve(options);
            });
          });
        }
      });
    }
  });
};

exports.prompt = _prompt;
exports.encrypt = _encrypt;
exports.decrypt = _decrypt;
