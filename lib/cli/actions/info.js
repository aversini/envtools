/*eslint no-console:0*/
var
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
    _ = require('lodash'),
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

function getSystemInfo(self, callback) {
  var
    os = require('os'),
    async = require('async'),
    route = require('default-network'),
    cmd = require('fedtools-commands'),
    utilities = require('fedtools-utilities'),

    uptime,
    cpuModel,
    totalMemory,
    freeMemory,
    hostname,
    localIp,
    publicIp,
    diskSpace,
    nodeVersions,
    npmVersion,
    gitVersion,
    envtoolsVersion;

  //-- S Y S T E M
  uptime = utilities.formatMillisecondsToHuman(os.uptime() * MILLISECONDS_IN_SECOND);
  cpuModel = os.cpus()[0].model;
  totalMemory = os.totalmem() / BYTES_IN_GIGABYTES;
  freeMemory = os.freemem() / BYTES_IN_GIGABYTES;
  hostname = os.hostname();
  diskSpace = (common.isMac()) ? cmd.run('df -lh', {
    status: false
  }).stdout.replace(/\n$/, '') : null;

  //-- E N V I R O N M E N T
  nodeVersions = process.versions;
  nodeVersions.arch = os.arch();
  npmVersion = cmd.run('npm -v', {
    status: false
  }).stdout.replace(/\n$/, '');
  envtoolsVersion = self.version.currentVersion;
  gitVersion = cmd.run('git --version', {
    status: false
  }).stdout.replace(/\n$/, '').replace('git version ', '');

  async.waterfall([
    function (done) {
      route.collect(function (error, defaultRoute) {
        localIp = getInternalIp(os.networkInterfaces(), defaultRoute);
        done();
      });
    },
    function (done) {
      getPublicIp(function (err, data) {
        if (!err && data) {
          publicIp = data;
        }
        done();
      });
    }
  ], function (err) {
    callback(err, {
      uptime: uptime,
      cpuModel: cpuModel,
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      hostname: hostname,
      localIp: localIp,
      publicIp: publicIp,
      diskSpace: diskSpace,
      nodeVersions: nodeVersions,
      npmVersion: npmVersion,
      gitVersion: gitVersion,
      envtoolsVersion: envtoolsVersion
    });
  });
}

function displayResults(data) {
  var
    log = require('fedtools-logs'),
    msg = [];

  msg.push(log.strToColor('cyan', 'S Y S T E M'));
  msg.push('Hostname  : ' + data.hostname);
  msg.push('Uptime    : ' + data.uptime);
  msg.push('Processor : ' + data.cpuModel);
  msg.push('Memory    : ' + data.totalMemory.toFixed(MAX_DIGITS) +
    ' GB (' + data.freeMemory.toFixed(MAX_DIGITS) + ' GB free)');

  if (data.localIp) {
    msg.push('Local IP  : ' + data.localIp.v4);
  }
  if (data.publicIp) {
    msg.push('Public IP : ' + data.publicIp);
  }

  if (common.isMac()) {
    msg.push('');
    msg.push(log.strToColor('cyan', 'F I L E  S Y S T E M'));
    msg.push(data.diskSpace);
  }


  msg.push('');
  msg.push(log.strToColor('cyan', 'E N V I R O N M E N T'));
  msg.push('Node      : ' + data.nodeVersions.node + ' (' +
    data.nodeVersions.arch + ', v8 ' + data.nodeVersions.v8 +
    ', module ' + data.nodeVersions.modules + ')');
  msg.push('Npm       : ' + data.npmVersion);
  msg.push('Git       : ' + data.gitVersion);

  msg.push('Envtools  : ' + data.envtoolsVersion);

  log.printMessagesInBox(msg);
}

//-- E X P O R T S
module.exports = function (self) {
  var
    existingData = {};

  try {
    existingData = JSON.parse(fs.readFileSync(common.ENVTOOLS.SYSTEM_INFO));
  } catch (e) {
    // forcing expiration
    existingData.expiration = moment().subtract(1, 'd');
  }

  if (moment().isAfter(existingData.expiration)) {
    // expired, need to refetch
    getSystemInfo(self, function (err, data) {
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
