var
  _ = require('lodash'),
  os = require('os'),
  route = require('default-network'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  utilities = require('fedtools-utilities'),

  common = require('../../common'),

  MAX_DIGITS = 2,
  MILLISECONDS_IN_SECOND = 1000,
  BYTES_IN_MEGABYTES = 1024,
  BYTES_IN_GIGABYTES = BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES;

//-- P R I V A T E  M E T H O D S
function getInternalIp(defaultRoute) {
  var
    interfaces = os.networkInterfaces(),
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

  if (defaultInterface.length === 1) {
    defaultInterface = defaultInterface[0];
  }

  _getIp = function (options, network) {
    var
      ret = options.def;

    if (network) {
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

function displayResults(data) {
  var
    msg = [];

  msg.push(log.strToColor('cyan', 'S Y S T E M'));
  msg.push('Hostname  : ' + data.hostname);
  msg.push('Uptime    : ' + data.uptime);
  msg.push('Processor : ' + data.cpuModel);
  msg.push('Memory    : ' + data.totalMemory +
    ' GB (' + data.freeMemory.toFixed(MAX_DIGITS) + ' GB free)');
  msg.push('Local IP  : ' + data.localIp.v4 +
    ' (' + data.localIp.v6 + ')');

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
  msg.push('git       : ' + data.gitVersion);

  msg.push('Envtools  : ' + data.envtoolsVersion);

  log.printMessagesInBox(msg);
}

//-- E X P O R T S
module.exports = function (self) {
  var
    uptime,
    cpus,
    cpuModel,
    totalMemory,
    freeMemory,
    hostname,
    localIp,
    diskSpace,
    nodeVersions,
    npmVersion,
    gitVersion,
    envtoolsVersion;

  //-- S Y S T E M
  uptime = utilities.formatMillisecondsToHuman(os.uptime() * MILLISECONDS_IN_SECOND);
  cpus = os.cpus();
  cpuModel = cpus[0].model;
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


  //-- A S Y N C  C A L L S
  route.collect(function (error, defaultRoute) {
    localIp = getInternalIp(defaultRoute);

    displayResults({
      uptime: uptime,
      cpuModel: cpuModel,
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      hostname: hostname,
      localIp: localIp,
      diskSpace: diskSpace,
      nodeVersions: nodeVersions,
      npmVersion: npmVersion,
      gitVersion: gitVersion,
      envtoolsVersion: envtoolsVersion
    });
  });
};
