var
  common = require('../../common'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities');


function _checkForCoreApps(options, apps, callback) {
  var res;
  if (process.platform !== 'win32') {
    // Adding ruby to the list of core apps to check on anything but
    // Windows (user has to install ruby manually on Windows...)
    apps.push({
      'status': (options.auto) ? false : true,
      'name': 'ruby',
      'error': options.i18n.t('bootstrap.errors.ruby')
    });
  }
  res = utilities.isAppInstalled(apps);
  if (!res) {
    return callback(1, options);
  } else {
    return callback(null, options);
  }
}

module.exports = function (options, callback) {
  var applicationsList = {
    core: [{
      'status': (options.auto) ? false : true,
      'name': 'git',
      'error': options.i18n.t('bootstrap.errors.git')
    }, {
      'status': (options.auto) ? false : true,
      'name': 'java',
      'error': options.i18n.t('bootstrap.errors.java')
    }, {
      'status': (options.auto) ? false : true,
      'name': 'unicorn',
      'error': options.i18n.t('bootstrap.errors.unicorn')
    }],
    others: [{
      'status': (options.auto) ? false : true,
      'name': 'selleck',
      'error': options.i18n.t('bootstrap.errors.selleck')
    }, {
      'status': (options.auto) ? false : true,
      'name': 'yuidoc',
      'error': options.i18n.t('bootstrap.errors.yuidoc')
    }, {
      'status': (options.auto) ? false : true,
      'name': 'fedtools',
      'error': options.i18n.t('bootstrap.errors.fedtools')
    }, {
      'status': (options.auto) ? false : true,
      'name': 'yogi',
      'error': options.i18n.t('bootstrap.errors.yogi')
    }]
  };
  _checkForCoreApps(options, applicationsList.core, function (err) {
    var res;

    if (options.needToCheckForMaven) {
      applicationsList.others.push({
        'status': (options.auto) ? false : true,
        'name': 'mvn',
        'error': options.i18n.t('bootstrap.errors.mvn')
      });
    }
    res = utilities.isAppInstalled(applicationsList.others);
    if (!res || err) {
      log.warning('Some applications needed for the framework could not be found...');
    }
    if (!err && res && !options.auto) {
      log.success('All applications required for the framework have been found!');
      return callback(common.USER_IGNORE, options);
    } else {
      return callback(null, options);
    }
  });
};
