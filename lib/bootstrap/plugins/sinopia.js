var
  _ = require('lodash'),
  fs = require('fs-extra'),
  waterfall = require('async/waterfall'),
  inquirer = require('inquirer'),
  path = require('path'),
  log = require('fedtools-logs'),
  cmd = require('fedtools-commands'),

  node = require('./node'),
  backup = require('../../backup'),
  common = require('../../common');

function _installConfiguration(options, callback) {
  var
    compiledTpl, buff,
    srcFile = path.join(__dirname, '..', '..', '..', 'data', 'third', 'sinopia', 'config.yaml'),
    destFile = path.join(process.env.RUNTIME_DIR, 'config.yaml');

  if (!fs.existsSync(destFile)) {
    fs.readFile(srcFile, function (err, data) {
      if (!err) {
        compiledTpl = _.template(data.toString());
        buff = compiledTpl({
          dir: process.env.RUNTIME_DIR
        });
        if (buff) {
          fs.writeFile(destFile, buff, function () {
            callback(null, options);
          });
        } else {
          return callback(null, options);
        }
      } else {
        return callback(null, options);
      }
    });
  } else {
    return callback(null, options);
  }
}

function _setupSinopia(options, callback) {
  waterfall([
    function (done) {
      var
        questions = {
          type: 'list',
          name: 'sinopia',
          message: 'Please choose one of the following options',
          choices: [{
            name: 'Activate Sinopia',
            value: common.ON
          }, {
            name: 'Deactivate Sinopia',
            value: common.OFF
          }]
        };
      inquirer.prompt(questions).then(function (answers) {
        done(null, answers.sinopia);
      });
    },
    function (toggleSinopia, done) {
      fs.writeFile(common.ENVTOOLS.SINOPIA_STATUS, toggleSinopia, function () {
        done(null, toggleSinopia);
      });
    },
    function (toggleSinopia, done) {
      var
        cmdline,
        proxy,
        proxyStatus;

      backup(node.NPM_CONFIG);
      if (toggleSinopia === common.ON) {
        log.notice('Activating Sinopia...');
        cmdline = 'npm config set registry http://localhost:4873/';
        cmd.run(cmdline, {
          status: true
        }, function () {
          // need to remove the proxy entry no matter what
          cmdline = 'npm config delete proxy';
          cmd.run(cmdline, {
            status: true
          }, function () {
            log.echo();
            log.notice('Please restart your session and Sinopia');
            done(common.USER_IGNORE);
          });
        });
      } else {
        log.notice('De-activating Sinopia...');
        cmdline = 'npm config set registry http://registry.npmjs.org/';
        cmd.run(cmdline, {
          status: true
        }, function () {
          // if proxy is set, need to reset proxy too
          if (fs.existsSync(common.ENVTOOLS.PROXY_FILE) &&
            fs.existsSync(common.ENVTOOLS.PROXY_STATUS_FILE)
          ) {
            proxyStatus = fs.readFileSync(common.ENVTOOLS.PROXY_STATUS_FILE, 'utf8');
            proxy = fs.readFileSync(common.ENVTOOLS.PROXY_FILE, 'utf8');
            if (proxy !== '' &&
              proxyStatus && proxyStatus.replace(/\n$/, '') === common.ON) {
              cmdline = 'npm config set proxy ' + proxy;
              cmd.run(cmdline, {
                status: true
              }, function () {
                cmdline = 'npm config set https-proxy ' + proxy;
                cmd.run(cmdline, {
                  status: true
                }, function () {
                  done();
                });
              });
            } else {
              return done();
            }
          } else {
            return done();
          }
        });
      }
    }
  ], function (err) {
    callback(err, options);
  });
}

module.exports = {
  installConfiguration: _installConfiguration,
  setupSinopia: _setupSinopia
};
