module.exports = function (options, callback) {
  options.version.setAutoCheck(options.answers.version);
  callback();
};
