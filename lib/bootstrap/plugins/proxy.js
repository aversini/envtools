var
  fs = require('fs-extra'),
  async = require('async'),
  url = require('url'),
  log = require('fedtools-logs'),
  inquirer = require('inquirer'),

  common = require('../common');

module.exports = function (options, callback) {
  var
    msg = [],
    proxy = '',
    questions;

  // in auto mode, no setting proxy if it's already set!
  if (options.auto && fs.existsSync(common.ENVTOOLS.PROXY_FILE)) {
    return callback(null, options);
  }

  function _setProxy(proxy, done) {
    var
      questions = {
        type: 'input',
        name: 'proxy',
        message: 'Enter proxy',
        validate: function (val) {
          var parsed;
          if (!val) {
            return 'Proxy cannot be empty...';
          }
          parsed = url.parse(val);
          if (!parsed.protocol || !parsed.hostname ||
            (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
            parsed.hostname.match(/\./) === null) {
            return 'Invalid proxy';
          }
          if (val.match('http://') || val.match('https://')) {
            return true;
          } else {
            return 'Invalid proxy, protocol is required (http or https)...';
          }
        }
      };
    if (proxy) {
      questions.default = proxy;
      questions.message = questions.message + ' or press ENTER for default';
    }
    inquirer.prompt(questions).then(function (answers) {
      if (answers.proxy) {
        fs.writeFileSync(common.ENVTOOLS.PROXY_FILE, answers.proxy);
        log.echo();
        msg.push('To take your proxy into account, you need to restart your session.');
        if (process.env.ENVTOOLS_VERSION) {
          msg.push('');
          msg.push(log.strToColor('cyan', 'Hint #1:') + ' type r ENTER or just restart your terminal...');
          msg.push(log.strToColor('cyan', 'Hint #2:') + ' type pon ENTER to turn the proxy ON.');
          msg.push(log.strToColor('cyan', 'Hint #3:') + ' type poff ENTER to turn the proxy OFF.');
        }
        if (options.auto) {
          fs.writeFileSync(common.ENVTOOLS.RESUME_AUTO, '');
        }
        options.msg = msg;
        return done(common.USER_WARNING, options);
      } else {
        if (options.auto) {
          return done(null, options);
        }
        return done(common.USER_INTERRUPT, options);
      }
    });
  }

  async.waterfall([
    function (done) {
      questions = [{
        type: 'confirm',
        name: 'goForIt',
        message: 'Do you need to setup a proxy?',
        default: true
      }];
      inquirer.prompt(questions).then(function (answers) {
        if (answers.goForIt) {
          return done();
        } else {
          return done(common.USER_INTERRUPT);
        }
      });
    },
    function (done) {
      if (fs.existsSync(common.ENVTOOLS.PROXY_FILE)) {
        proxy = fs.readFileSync(common.ENVTOOLS.PROXY_FILE, 'utf8');
        if (proxy && proxy !== '') {
          questions = [{
            type: 'confirm',
            name: 'change',
            message: 'Proxy already set... Do you want to change it?',
            default: false
          }];
        }
        inquirer.prompt(questions).then(function (answers) {
          if (answers.change) {
            _setProxy(proxy, done);
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      } else {
        common.createRuntimeDir(function () {
          _setProxy(null, done);
        });
      }
    }
  ], function (err, data) {
    if (err && err === common.USER_WARNING && data && data.msg) {
      log.printMessagesInBox(data.msg);
    }
    if (options.auto && err === common.USER_INTERRUPT) {
      err = null;
    }
    callback(err, options);
  });
};
