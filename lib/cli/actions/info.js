/*eslint no-console:0, complexity:0 */
var
  _ = require('lodash'),
  moment = require('moment'),
  fs = require('fs-extra'),
  common = require('../../common'),

  DOWNLOAD_URL_TIMEOUT = 3000,
  MAX_DIGITS = 2,
  MILLISECONDS_IN_SECOND = 1000,
  BYTES_IN_MEGABYTES = 1024,
  BYTES_IN_GIGABYTES = BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES;

//-- P R I V A T E  M E T H O D S
function getInternalIp(interfaces, defaultRoute) {
  var
    defaultInterface = (defaultRoute) ? _.keys(defaultRoute) : null,
    v4Options,
    v6Options,
    _getIp;

  v4Options = {
    def: '127.0.0.1',
    family: 'IPv4'
  };
  v6Options = {
    def: '::1',
    family: 'IPv6'
  };

  if (!interfaces) {
    return {
      v4: null,
      v6: null
    };
  }

  if (defaultInterface.length === 1) {
    defaultInterface = defaultInterface[0];
  }

  _getIp = function (options, network) {
    var
      ret = options.def;

    if (network && network.length === 1) {
      interfaces[network].forEach(function (el2) {
        if (el2.family === options.family) {
          ret = el2.address;
        }
      });
    } else {
      Object.keys(interfaces).forEach(function (el) {
        interfaces[el].forEach(function (el2) {
          if (el2.family === options.family) {
            ret = el2.address;
          }
        });
      });
    }
    return ret;
  };

  return {
    v4: _getIp(v4Options, defaultInterface),
    v6: _getIp(v6Options, defaultInterface)
  };
}

function getPublicIp(callback) {
  var
    download = require('download'),
    res = {},
    url = 'https://api.ipify.org';

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  download(url, {
    timeout: (process.env.https_proxy) ? null : DOWNLOAD_URL_TIMEOUT,
    retries: 0
  }).then(function (body) {
    if (body) {
      res = body.toString();
    }
    return callback(null, res);
  }).catch(function (err) {
    return callback(err, res);
  });
}

function parseMavenInformation(data) {
  var
    res = {};

  _.forEach(data.split('\n'), function (line) {
    if (line.match('Apache Maven ')) {
      res.mavenVersion = line.slice(0, line.indexOf(' (')).trim();
    }
    if (line.match('Maven home:')) {
      res.mavenHome = line
        .replace('Maven home:', '')
        .trim();
    }
    if (line.match('Java version:')) {
      res.javaVersion = line
        .replace('Java version:', '')
        .trim();
    }
    if (line.match('Java home:')) {
      res.javaHome = line
        .replace('Java home:', '')
        .trim();
    }
  });
  return res;
}

function getMacVersion(release) {
  var
    semver = require('semver'),
    macRelease = require('macos-release'),
    major = macRelease().version,
    minor = semver.minor(release);

  if (minor) {
    return major + '.' + minor;
  } else {
    return major;
  }
}

function getSystemInfo(self, options, callback) {
  var
    os = require('os'),
    osName = require('os-name'),
    async = require('async'),
    route = require('default-network'),
    cmd = require('fedtools-commands'),
    utilities = require('fedtools-utilities'),

    osVersion,
    uptime,
    cpuModel,
    loadAverage,
    totalMemory,
    freeMemory,
    hostname,
    localIp,
    publicIp,
    diskSpace,
    nodeVersions,
    npmVersion,
    npmGlobalRootLocation,
    gitVersion,
    rubyVersion,
    mavenData,
    envtoolsVersion;

  //-- S Y S T E M
  if (common.isMac() && options.os) {
    osVersion = getMacVersion(os.release());
  }
  if (options.uptime) {
    uptime = utilities.formatMillisecondsToHuman(os.uptime() * MILLISECONDS_IN_SECOND);
  }
  if (options.cpu) {
    cpuModel = os.cpus()[0].model;
  }
  if (options.load) {
    loadAverage = (common.isWindows()) ? null : os.loadavg();
  }
  if (options.memory) {
    totalMemory = os.totalmem() / BYTES_IN_GIGABYTES;
    freeMemory = os.freemem() / BYTES_IN_GIGABYTES;
  }
  if (options.hostname) {
    hostname = os.hostname();
  }
  if (options.disk) {
    diskSpace = (common.isMac()) ? cmd.run('df -PlH', {
      status: false
    }).stdout.replace(/\n$/, '') : null;
  }


  //-- E N V I R O N M E N T
  nodeVersions = process.versions;
  nodeVersions.arch = os.arch();
  npmVersion = cmd.run('npm -v', {
    status: false
  }).stdout.replace(/\n$/, '');
  npmGlobalRootLocation = cmd.run('npm root -g', {
    status: false
  }).stdout.replace(/\n$/, '');
  envtoolsVersion = self.version.currentVersion;
  gitVersion = cmd.run('git --version', {
    status: false
  }).stdout.replace(/\n$/, '');
  rubyVersion = cmd.run('ruby -v', {
    status: false
  }).stdout.replace(/\n$/, '');
  mavenData = parseMavenInformation(cmd.run('mvn -v', {
    status: false
  }).stdout.replace(/\n$/, ''));

  async.waterfall([
    function (done) {
      if (options.localIp) {
        route.collect(function (error, defaultRoute) {
          localIp = getInternalIp(os.networkInterfaces(), defaultRoute);
          done();
        });
      } else {
        return done();
      }
    },
    function (done) {
      if (options.publicIp) {
        getPublicIp(function (err, data) {
          if (!err && data) {
            publicIp = data;
          }
          done();
        });
      } else {
        return done();
      }
    }
  ], function (err) {
    callback(err, {
      osName: (options.os) ? osName() : null,
      osVersion: osVersion,
      uptime: uptime,
      cpuModel: cpuModel,
      loadAverage: loadAverage,
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      hostname: hostname,
      localIp: localIp,
      publicIp: publicIp,
      diskSpace: diskSpace,
      nodeVersions: nodeVersions,
      npmVersion: npmVersion,
      npmGlobalRootLocation: npmGlobalRootLocation,
      gitVersion: gitVersion,
      rubyVersion: rubyVersion,
      mavenData: mavenData,
      envtoolsVersion: envtoolsVersion
    });
  });
}

function displayResults(data) {
  var
    nextUpdate,
    log = require('fedtools-logs'),
    msg = [];

  msg.push('');
  msg.push(log.strToColor('cyan', 'S Y S T E M'));
  if (data.osName) {
    if (data.osVersion) {
      msg.push('Operating System  : ' +
        data.osName + ' (' + data.osVersion + ')');
    } else {
      msg.push('Operating System  : ' + data.osName);
    }
  }
  if (data.hostname) {
    msg.push('Hostname          : ' + data.hostname);
  }
  if (data.cpuModel) {
    msg.push('Processor         : ' + data.cpuModel);
  }
  if (data.totalMemory >= 0) {
    msg.push('Memory            : ' + data.totalMemory.toFixed(MAX_DIGITS) + ' GB');
  }


  msg.push('');
  msg.push(log.strToColor('cyan', 'E N V I R O N M E N T'));
  if (data.uptime) {
    msg.push('Uptime            : ' + data.uptime);
  }
  if (data.loadAverage) {
    msg.push('Load average      : ' + data.loadAverage.map(function (item) {
      return item.toFixed(MAX_DIGITS);
    }).join(', '));
  }
  if (data.freeMemory >= 0) {
    msg.push('Memory used       : ' +
      (data.totalMemory - data.freeMemory).toFixed(MAX_DIGITS) + ' GB (' +
      data.freeMemory.toFixed(MAX_DIGITS) + ' GB free)');
  }
  if (data.localIp) {
    msg.push('Local IP address  : ' + data.localIp.v4);
  }
  if (data.publicIp) {
    msg.push('Public IP address : ' + data.publicIp);
  } else {
    msg.push('Public IP address : use --publicIp flag to show');
  }

  if (common.isMac() && data.diskSpace) {
    msg.push('');
    msg.push(log.strToColor('cyan', 'F I L E  S Y S T E M'));
    msg.push(data.diskSpace);
  }


  msg.push('');
  msg.push(log.strToColor('cyan', 'V E R S I O N S'));
  msg.push('Node              : ' + data.nodeVersions.node + ' (' +
    data.nodeVersions.arch + ', v8 ' + data.nodeVersions.v8 +
    ', module ' + data.nodeVersions.modules + ')');
  msg.push('Npm               : ' + data.npmVersion);
  if (data.gitVersion) {
    msg.push('Git               : ' +
      data.gitVersion.replace('git version ', '').trim());
  }
  if (data.rubyVersion) {
    msg.push('Ruby              : ' +
      data.rubyVersion
      .slice(0, data.rubyVersion.indexOf(' ['))
      .replace('ruby', '')
      .trim());
  }
  if (data.mavenData && data.mavenData.mavenVersion) {
    msg.push('Maven             : ' +
      data.mavenData.mavenVersion.replace('Apache Maven', '').trim());
  }
  if (data.mavenData && data.mavenData.javaVersion) {
    msg.push('Java              : ' + data.mavenData.javaVersion);
  }
  msg.push('Envtools          : ' + data.envtoolsVersion);


  msg.push('');
  msg.push(log.strToColor('cyan', 'L O C A T I O N S'));
  if (data.npmGlobalRootLocation) {
    msg.push('Npm root location : ' +
      data.npmGlobalRootLocation.replace(process.env.HOME, '~'));
  }
  if (data.mavenData && data.mavenData.mavenHome) {
    msg.push('Maven location    : ' +
      data.mavenData.mavenHome.replace(process.env.HOME, '~'));
  }

  msg.push('');
  if (data.expiration) {
    nextUpdate = moment(data.expiration).diff(moment()) / MILLISECONDS_IN_SECOND;
    msg.push('');
    log.printMessagesInBox(msg, null,
      'Next update in ' + nextUpdate.toFixed(0) + 's');
  } else {
    log.printMessagesInBox(msg);
  }
}

//-- E X P O R T S
module.exports = function (self, program) {
  var
    existingData = {},
    options = {
      all: _.isBoolean(program.all) ? program.all : false,
      os: _.isBoolean(program.os) ? program.os : true,
      uptime: _.isBoolean(program.uptime) ? program.uptime : true,
      cpu: _.isBoolean(program.cpu) ? program.cpu : true,
      load: _.isBoolean(program.load) ? program.load : true,
      memory: _.isBoolean(program.memory) ? program.memory : true,
      hostname: _.isBoolean(program.hostname) ? program.hostname : true,
      localIp: _.isBoolean(program.localIp) ? program.localIp : true,
      publicIp: _.isBoolean(program.publicIp) ? program.publicIp : false,
      disk: _.isBoolean(program.disk) ? program.disk : true,
      nodeVersions: true,
      npmVersion: true,
      npmGlobalRootLocation: true,
      gitVersion: true,
      rubyVersion: true,
      mavenData: true,
      envtoolsVersion: true
    };

  if (options.all) {
    _.each(options, function (item, key) {
      options[key] = true;
    });
  }

  if (options.publicIp) {
    // user specificaly asks for publicIp, we need to refresh
    // all, even if there is a cached file data by artificially
    // forcing cache expiration
    existingData.expiration = moment().subtract(1, 'd');
  } else {
    try {
      existingData = JSON.parse(fs.readFileSync(common.ENVTOOLS.SYSTEM_INFO));
    } catch (e) {
      // forcing cache expiration
      existingData.expiration = moment().subtract(1, 'd');
    }
  }

  if (moment().isAfter(existingData.expiration)) {
    // expired, need to refetch
    getSystemInfo(self, options, function (err, data) {
      if (err) {
        throw err;
      } else {
        data.expiration = moment().add(1, 'm');
        displayResults(data);
        // caching data to disk for 1 minute
        fs.writeFileSync(common.ENVTOOLS.SYSTEM_INFO,
          JSON.stringify(data, null, common.NB_SPACES_FOR_TAB));
      }
    });
  } else {
    // display disk data
    displayResults(existingData);
  }
};
