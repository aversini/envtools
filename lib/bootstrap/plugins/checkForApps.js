var
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities');

function _checkForCoreApps(options, callback) {
  var
    res,
    appsList = [{
      'name': 'shifter',
      'error': options.i18n.t('bootstrap.errors.shifter')
    }, {
      'name': 'java',
      'error': options.i18n.t('bootstrap.errors.java')
    }, {
      'name': 'git',
      'error': options.i18n.t('bootstrap.errors.git')
    }, {
      'name': 'ruby',
      'error': options.i18n.t('bootstrap.errors.ruby')
    }];

  if (options.auto && process.platform === 'win32') {
    // removing ruby from the list of apps to check when in auto mode
    // on Windows (user has to install ruby manually...)
    appsList.pop();
  }
  res = utilities.isAppInstalled(appsList);
  if (!res) {
    return callback(1, options);
  } else {
    return callback(null, options);
  }
}

module.exports = function (options, callback) {
  _checkForCoreApps(options, function (err) {
    var
      apps = [{
        'name': 'selleck',
        'error': options.i18n.t('bootstrap.errors.selleck')
      }, {
        'name': 'yuidoc',
        'error': options.i18n.t('bootstrap.errors.yuidoc')
      }, {
        'name': 'fedtools',
        'error': options.i18n.t('bootstrap.errors.fedtools')
      }, {
        'name': 'yogi',
        'error': options.i18n.t('bootstrap.errors.yogi')
      }, {
        'name': 'phantomjs',
        'error': options.i18n.t('bootstrap.errors.phantomjs')
      }, {
        'name': 'unicorn',
        'error': options.i18n.t('bootstrap.errors.unicorn')
      }],
      res;

    if (options.needToCheckForMaven) {
      apps.push({
        'name': 'mvn',
        'error': options.i18n.t('bootstrap.errors.mvn')
      });
    }
    res = utilities.isAppInstalled(apps);
    if (!res || err) {
      log.warning('Some applications needed for the framework could not be found...');
    }
    if (!err && res && !options.auto) {
      log.success('All applications required for the framework have been found!');
    }
    callback(null, options);
  });
};
