/*eslint indent:0 */

var
  path = require('path'),
  common = require('./common');


exports.USER_FATAL = common.USER_FATAL;
exports.USER_WARNING = common.USER_WARNING;
exports.USER_INTERRUPT = common.USER_INTERRUPT;
exports.USER_IGNORE = common.USER_IGNORE;


// -- C O M M A N D  E N T R Y  P O I N T
exports.manual = function (options, done) {
  options.needToCheckForMaven = true;
  require('./routing').routeCLIRequest(common.TYPE_MANUAL, options, done);
};

exports.extra = function (options, done) {
  require('./routing').routeCLIRequest(common.TYPE_EXTRA, options, done);
};

exports.auto = function (options, done) {
  options.needToCheckForMaven = true;
  require('./routing').routeCLIRequest(common.TYPE_AUTO, options, done);
};

exports.getHelp = function (debug, options) {
  var
    i = 0,
    MAX_OPTIONS = 10,
    namespace = 'bootstrap.help.' + options.type,
    _options = [];

  options.i18n.loadPhrases(path.resolve(__dirname, '..', '..', 'data', 'i18n', 'bootstrap'));

  for (i = 0; i < MAX_OPTIONS; i += 1) {
    _options.push({
      option: options.i18n.t(namespace + '.options.' + i + '.option'),
      desc: options.i18n.t(namespace + '.options.' + i + '.desc')
    });
  }
  return {
    namespace: namespace,
    synopsis: options.i18n.t(namespace + '.synopsis'),
    command: options.i18n.t(namespace + '.command'),
    description: options.i18n.t(namespace + '.description'),
    options: _options,
    examples: options.i18n.t(namespace + '.examples')
  };
};
