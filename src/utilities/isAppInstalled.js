/**
 * Checks if a program or a list of programs are available.
 *
 * @method isAppInstalled
 * @param {String} name The name of the program to check.
 * @return {Boolean} True on success (all programs are available).
 *
 */

module.exports = name => {
  const execPath = require("shelljs").which(name);
  return execPath !== null;
};
