var
  fs = require('fs-extra'),
  async = require('async'),
  log = require('fedtools-logs'),
  inquirer = require('inquirer'),

  common = require('../../common');

module.exports = function (options, callback) {
  var
    msg = [],
    proxy = '',
    questions;

  // in auto mode, no setting proxy if it's already set!
  if (options.auto && fs.existsSync(common.ENVTOOLS.PROXY_FILE)) {
    return callback(null, options);
  }

  function _setProxy(done) {
    var
      questions = [{
        type: 'list',
        name: 'protocol',
        message: 'Select the proxy protocol:',
        choices: ['http', 'https', 'other']
      }, {
        type: 'input',
        name: 'protocol',
        message: 'Type the protocol you want to use: ',
        when: function (res) {
          return res.protocol === 'other';
        },
        validate: function (val) {
          if (!val) {
            return 'Protocol cannot be empty...';
          }
          return true;
        },
        filter: function (res) {
          return res.replace('://', '');
        }
      }, {
        type: 'list',
        name: 'port',
        message: 'Select the proxy port:',
        choices: ['8080', '80', {
          value: '',
          name: 'none'
        }, 'other']
      }, {
        type: 'input',
        name: 'port',
        message: 'Type the port you want to use (<enter> for none): ',
        when: function (res) {
          return res.port === 'other';
        }
      }, {
        type: 'input',
        name: 'url',
        message: 'Type the proxy URL: ',
        validate: function (val) {
          if (!val) {
            return 'URL cannot be empty...';
          }
          return true;
        }
      }];

    inquirer.prompt(questions).then(function (answers) {
      var
        proxy = answers.protocol + '://' + answers.url;

      if (answers.port && answers.port !== '') {
        proxy += ':' + answers.port;
      }
      if (proxy) {
        fs.writeFileSync(common.ENVTOOLS.PROXY_FILE, proxy);
        log.echo();
        log.success('proxy set to ' + proxy);
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
      if (!options.auto) {
        return done();
      } else {
        inquirer.prompt(questions).then(function (answers) {
          options.actionsPending++;
          if (answers.goForIt) {
            options.actionsDone++;
            return done();
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      }
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
          options.actionsPending++;
          if (answers.change) {
            options.actionsDone++;
            _setProxy(done);
          } else {
            return done(common.USER_INTERRUPT);
          }
        });
      } else {
        common.createRuntimeDir(function () {
          _setProxy(done);
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
