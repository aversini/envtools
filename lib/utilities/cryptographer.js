const crypto = require("crypto");

const CRYPTO_ALGO = "aes-256-ctr";
const BYTES_FOR_IV = 16;
const HEX = "hex";
const UTF8 = "utf8";

/**
 * Create an hexadecimal hash from a given string. The default
 * algorithm is md5 but it can be changed to anything that
 * crypto.createHash allows.
 * @param  {String} string            the string to hash
 * @param  {String} [algorithm='md5'] the algorithm to use or hashing
 * @return {String}                   the hashed string in hexa format
 */
const _createHash = (string, algorithm = "md5") =>
  crypto
    .createHash(algorithm)
    .update(string, "utf8")
    .digest(HEX);

/**
 * Encrypts a string or a buffer using AES-256-CTR algorithm.
 * @param  {String}        password a unique password
 * @param  {String|Buffer} data     a string or a buffer to encrypt
 * @return {String|Buffer} the encrypted data in hexa encoding, followed
 *                         by a dollar sign ($) and by a unique
 *                         random initialization vector used
 */
const _encrypt = (password, data) => {
  // Ensure that the initialization vector (IV) is random.
  const iv = new Buffer(crypto.randomBytes(BYTES_FOR_IV));
  // Hash the given password (result should always be the same).
  const key = _createHash(password);
  // Create a cipher.
  const cipher = crypto.createCipheriv(CRYPTO_ALGO, key, iv);
  // Encrypt the data using the newly created cipher.
  const crypted = cipher.update(data, "utf8", HEX) + cipher.final(HEX);
  // Append the IV at the end of the encrypted data to reuse it for
  // decryption (IV is not a key, it can be public).
  return `${crypted}$${iv.toString(HEX)}`;
};

/**
 * Decrypts a string or a buffer that was encrypted using
 * AES-256-CRT algorithm. It expects the encrypted string|buffer to
 * have the corresponding initialization vector appended at the
 * end, after a dollar sign ($) - which is done via the
 * `encrypt` method.
 * @param  {String}        password a unique password
 * @param  {String|Buffer} data     a string or buffer to decrypt
 * @return {String|Buffer}          the decrypted data
 */
const _decrypt = (password, data) => {
  // Extract encrypted data and initialization vector (IV).
  const [crypted, ivHex] = data.split("$");
  // Create a buffer out of the raw hex IV
  const iv = new Buffer(ivHex, HEX);
  // Hash the given password (result should always be the same).
  const hash = _createHash(password);
  // Create a cipher.
  const decryptor = crypto.createDecipheriv(CRYPTO_ALGO, hash, iv);
  // Return the decrypted data using the newly created cipher.
  return decryptor.update(crypted, HEX, UTF8) + decryptor.final("utf8");
};

exports.encrypt = _encrypt;
exports.decrypt = _decrypt;
exports.createHash = _createHash;
