/* eslint no-console:0, complexity:0 */
const _ = require('lodash');
const execa = require('execa');
const moment = require('moment');
const fs = require('fs-extra');
const cmd = require('fedtools-commands');
const common = require('../../common');
const DOWNLOAD_URL_TIMEOUT = 3000;
const MAX_DIGITS = 2;
const MILLISECONDS_IN_SECOND = 1000;
const BYTES_IN_MEGABYTES = 1024;
const BYTES_IN_GIGABYTES =
  BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES * BYTES_IN_MEGABYTES;

// -- P R I V A T E  M E T H O D S

function getDefaultRoute() {
  let res;
  if (common.isMac()) {
    res = cmd.run('route -n get default | grep interface | awk \'{print $2}\'', {
      status: false
    });
    if (res && res.stdout) {
      res = res.stdout.replace(/\n$/, '');
    }
  }
  return res;
}

function getInternalIp() {
  let route, res;
  if (common.isMac()) {
    route = getDefaultRoute();
    if (route) {
      res = cmd.run(`ifconfig ${route} inet | grep inet | awk '{print $2}'`, {
        status: false
      });
      if (res && res.stdout) {
        res = res.stdout.replace(/\n$/, '');
      }
    }
  }
  return res;
}

function getPublicIp(callback) {
  const download = require('download');
  const url = 'https://api.ipify.org';
  let res = {};

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  download(url, {
    timeout: process.env.https_proxy ? null : DOWNLOAD_URL_TIMEOUT,
    retries: 0
  })
    .then(function (body) {
      if (body) {
        res = body.toString();
      }
      return callback(null, res);
    })
    .catch(function (err) {
      return callback(err, res);
    });
}

function parseMavenInformation(data) {
  const res = {};

  _.forEach(data.split('\n'), function (line) {
    if (line.match('Apache Maven ')) {
      res.mavenVersion = line.slice(0, line.indexOf(' (')).trim();
    }
    if (line.match('Maven home:')) {
      res.mavenHome = line.replace('Maven home:', '').trim();
    }
    if (line.match('Java version:')) {
      res.javaVersion = line.replace('Java version:', '').trim();
    }
    if (line.match('Java home:')) {
      res.javaHome = line.replace('Java home:', '').trim();
    }
  });
  return res;
}

function getMacVersion(release) {
  const semver = require('semver');
  const macRelease = require('macos-release');
  const major = macRelease().version;
  const minor = semver.minor(release);

  if (minor) {
    return `${major}.${minor}`;
  } else {
    return major;
  }
}

function getDiskSpace(callback) {
  let cmdline;

  if (common.isMac()) {
    cmdline = 'df -PlH';
  }
  if (common.isLinux()) {
    cmdline = 'df -Plh';
  }

  if (cmdline) {
    cmd.run(
      cmdline,
      {
        status: false
      },
      function (err, stderr, stdout) {
        callback(err, stdout ? stdout.replace(/\n$/, '') : null);
      }
    );
  } else {
    return callback(1);
  }
}

function getProxyStatus(callback) {
  const localProxyStatus = process.env.PROXY_STATUS === common.ON;
  let proxy = common.NA,
    globalProxyStatus = false,
    npmRegistry,
    yarnRegistry;

  fs.readFile(common.ENVTOOLS.PROXY_STATUS_FILE, function (err, data) {
    if (!err && data) {
      data = data.toString().replace(/\n$/, '');
      globalProxyStatus = data === common.ON;
    }
    fs.readFile(common.ENVTOOLS.PROXY_FILE, function (err, data) {
      if (!err && data) {
        data = data.toString().replace(/\n$/, '');
        proxy = data;
      }
      cmd.run(
        'npm config get registry',
        {
          status: false
        },
        function (err, stderr, stdout) {
          if (!err && stdout) {
            npmRegistry = stdout.replace(/\n$/, '');
          }
          cmd.run(
            'yarn config get registry',
            {
              status: false
            },
            function (err, stderr, stdout) {
              if (!err && stdout) {
                yarnRegistry = stdout.replace(/\n$/, '');
              }
              return callback(null, {
                proxy,
                localProxyStatus,
                globalProxyStatus,
                npmRegistry,
                yarnRegistry
              });
            }
          );
        }
      );
    });
  });
}

const getRegistryInfo = async (callback) => {
  try {
    const {stdout: npmRegistry} = await execa('npm', [
      'config',
      'get',
      'registry'
    ]);
    const {stdout: yarnRegistry} = await execa('yarn', [
      'config',
      'get',
      'registry'
    ]);
    return callback(null, {
      npmRegistry,
      yarnRegistry
    });
  } catch (err) {
    return callback(err);
  }
};

function getSystemInfo(self, options, callback) {
  const os = require('os');
  const osName = require('os-name');
  const parallel = require('async/parallel');
  const utilities = require('fedtools-utilities');
  let osVersion,
    uptime,
    cpuModel,
    loadAverage,
    totalMemory,
    freeMemory,
    hostname,
    localIp,
    publicIp,
    diskSpace,
    proxyData,
    registryData,
    npmVersion,
    npmGlobalRootLocation,
    yarnVersion,
    gitVersion,
    rubyVersion,
    mavenData;

  // -- S Y S T E M
  if (common.isMac() && options.os) {
    osVersion = getMacVersion(os.release());
  }
  if (options.uptime) {
    uptime = utilities.formatMillisecondsToHuman(
      os.uptime() * MILLISECONDS_IN_SECOND
    );
  }
  if (options.cpu) {
    cpuModel = os.cpus()[0].model;
  }
  if (options.load) {
    loadAverage = common.isWindows() ? null : os.loadavg();
  }
  if (options.memory) {
    totalMemory = os.totalmem() / BYTES_IN_GIGABYTES;
    freeMemory = os.freemem() / BYTES_IN_GIGABYTES;
  }
  if (options.hostname) {
    hostname = os.hostname();
  }

  // -- E N V I R O N M E N T
  const nodeVersions = process.versions;
  nodeVersions.arch = os.arch();
  const envtoolsVersion = self.version.currentVersion;

  parallel(
    [
      function (done) {
        if (options.localIp) {
          localIp = getInternalIp();
          return done();
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
      },
      function (done) {
        if (options.proxy) {
          getProxyStatus(function (err, data) {
            if (!err) {
              proxyData = data;
            }
            done();
          });
        } else {
          return done();
        }
      },
      function (done) {
        getRegistryInfo(function (err, data) {
          if (!err) {
            registryData = data;
          }
          done();
        });
      },
      function (done) {
        if (options.disk) {
          getDiskSpace(function (err, data) {
            if (!err) {
              diskSpace = data;
            }
            done();
          });
        } else {
          return done();
        }
      },
      function (done) {
        cmd.run(
          'npm -v',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              npmVersion = stdout.replace(/\n$/, '');
            }
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'npm root -g',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              npmGlobalRootLocation = stdout.replace(/\n$/, '');
            }
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'yarn --version',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              yarnVersion = stdout.replace(/\n$/, '');
            }
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'git --version',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              gitVersion = stdout.replace(/\n$/, '');
            }
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'ruby -v',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              rubyVersion = stdout.replace(/\n$/, '');
            }
            done(null);
          }
        );
      },
      function (done) {
        cmd.run(
          'mvn -v',
          {
            status: false
          },
          function (err, stderr, stdout) {
            if (!err && stdout) {
              mavenData = parseMavenInformation(stdout.replace(/\n$/, ''));
            }
            done(null);
          }
        );
      }
    ],
    function (err) {
      callback(err, {
        osName: options.os ? osName() : null,
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
        proxyData,
        registryData,
        nodeVersions,
        npmVersion,
        npmGlobalRootLocation,
        yarnVersion,
        gitVersion,
        rubyVersion,
        mavenData,
        envtoolsVersion
      });
    }
  );
}

function displayResults(data) {
  const log = require('fedtools-logs');
  const msg = [];
  let status, nextUpdate;

  msg.push('');
  msg.push(log.strToColor('yellow', 'S Y S T E M'));
  if (data.osName) {
    if (data.osVersion) {
      msg.push(`Operating System  : ${data.osName} (${data.osVersion})`);
    } else {
      msg.push(`Operating System  : ${data.osName}`);
    }
  }
  if (data.hostname) {
    msg.push(`Hostname          : ${data.hostname}`);
  }
  if (data.cpuModel) {
    msg.push(`Processor         : ${data.cpuModel}`);
  }
  if (data.totalMemory >= 0) {
    msg.push(`Memory            : ${data.totalMemory.toFixed(MAX_DIGITS)} GB`);
  }

  msg.push('');
  msg.push(log.strToColor('yellow', 'E N V I R O N M E N T'));
  if (data.uptime) {
    msg.push(`Uptime            : ${data.uptime}`);
  }
  if (data.loadAverage) {
    msg.push(
      `Load average      : ${data.loadAverage
        .map(function (item) {
          return item.toFixed(MAX_DIGITS);
        })
        .join(', ')}`
    );
  }
  if (data.freeMemory >= 0) {
    msg.push(
      `Memory used       : ${(data.totalMemory - data.freeMemory).toFixed(
        MAX_DIGITS
      )} GB (${data.freeMemory.toFixed(MAX_DIGITS)} GB free)`
    );
  }
  if (data.localIp) {
    msg.push(`Local IP address  : ${data.localIp}`);
  }
  if (data.publicIp) {
    msg.push(`Public IP address : ${data.publicIp}`);
  } else {
    msg.push('Public IP address : use --publicIp flag to show');
  }

  if (data.proxyData) {
    msg.push('');
    msg.push(log.strToColor('yellow', 'P R O X Y'));
    if (data.proxyData.localProxyStatus === data.proxyData.globalProxyStatus) {
      status = data.proxyData.localProxyStatus ? 'enabled' : 'disabled';
    } else {
      status = data.proxyData.localProxyStatus
        ? 'enabled, but only in current window'
        : 'disabled, but only in current window';
    }
    msg.push(`Proxy             : ${data.proxyData.proxy}`);
    if (data.proxyData.proxy !== common.NA) {
      msg.push(`Proxy status      : ${status}`);
    }
  }

  if (data.registryData) {
    msg.push('');
    msg.push(log.strToColor('yellow', 'N P M  R E G I S T R Y'));
    if (data.registryData.npmRegistry) {
      msg.push(`Npm registry      : ${data.proxyData.npmRegistry}`);
    }
    if (data.registryData.yarnRegistry) {
      msg.push(`Yarn registry     : ${data.proxyData.yarnRegistry}`);
    }
  }

  if (common.isMac() && data.diskSpace) {
    msg.push('');
    msg.push(log.strToColor('yellow', 'F I L E  S Y S T E M'));
    msg.push(data.diskSpace);
  }

  msg.push('');
  msg.push(log.strToColor('yellow', 'V E R S I O N S'));
  msg.push(
    `Node              : ${data.nodeVersions.node} (${
      data.nodeVersions.arch
    }, v8 ${data.nodeVersions.v8}, module ${data.nodeVersions.modules})`
  );
  msg.push(`Npm               : ${data.npmVersion}`);
  if (data.yarnVersion) {
    msg.push(`Yarn              : ${data.yarnVersion}`);
  }
  if (data.gitVersion) {
    msg.push(
      `Git               : ${data.gitVersion
        .replace('git version ', '')
        .trim()}`
    );
  }
  if (data.rubyVersion) {
    msg.push(
      `Ruby              : ${data.rubyVersion
        .slice(0, data.rubyVersion.indexOf(' ['))
        .replace('ruby', '')
        .trim()}`
    );
  }
  if (data.mavenData && data.mavenData.mavenVersion) {
    msg.push(
      `Maven             : ${data.mavenData.mavenVersion
        .replace('Apache Maven', '')
        .trim()}`
    );
  }
  if (data.mavenData && data.mavenData.javaVersion) {
    msg.push(`Java              : ${data.mavenData.javaVersion}`);
  }
  msg.push(`Envtools          : ${data.envtoolsVersion}`);

  msg.push('');
  msg.push(log.strToColor('yellow', 'L O C A T I O N S'));
  if (data.npmGlobalRootLocation) {
    msg.push(
      `Npm root location : ${data.npmGlobalRootLocation.replace(
        process.env.HOME,
        '~'
      )}`
    );
  }
  if (data.mavenData && data.mavenData.mavenHome) {
    msg.push(
      `Maven location    : ${data.mavenData.mavenHome.replace(
        process.env.HOME,
        '~'
      )}`
    );
  }

  msg.push('');
  if (data.expiration) {
    nextUpdate =
      moment(data.expiration).diff(moment()) / MILLISECONDS_IN_SECOND;
    msg.push('');
    log.printMessagesInBox(
      msg,
      common.LOG_COLORS.DEFAULT_BOX,
      `Last update: ${moment(data.lastUpdate).format(
        'hh:mm:ssa'
      )} (next update in ${nextUpdate.toFixed(0)}s)`
    );
  } else {
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
  }
}

// -- E X P O R T S
module.exports = function (self, program) {
  const options = {
    force: _.isBoolean(program.force) ? program.force : false,
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
    proxy: _.isBoolean(program.proxy) ? program.proxy : true,
    nodeVersions: true,
    npmVersion: true,
    npmGlobalRootLocation: true,
    yarnVersion: true,
    gitVersion: true,
    rubyVersion: true,
    mavenData: true,
    envtoolsVersion: true
  };
  let existingData = {};

  if (options.all) {
    _.each(options, function (item, key) {
      options[key] = true;
    });
  }

  if (options.publicIp || options.force) {
    // user specificaly asks for publicIp, we need to refresh
    // all, even if there is a cached file data by artificially
    // forcing cache expiration
    existingData.expiration = moment().subtract(1, 'd');
  } else {
    try {
      // try/catch is not only trapping a missing file, but also
      // an invalid file that could not be JSON parsed correctly
      // win-win!
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
        data.lastUpdate = moment();
        data.expiration = moment().add(1, 'm');
        displayResults(data);
        // caching data to disk for 1 minute
        fs.writeFileSync(
          common.ENVTOOLS.SYSTEM_INFO,
          JSON.stringify(data, null, common.NB_SPACES_FOR_TAB)
        );
      }
    });
  } else {
    // display disk data
    displayResults(existingData);
  }
};
