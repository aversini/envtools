/*jshint unused:false*/

// @todo use a promise library instead of so many callbacks

var
  exec = require('child_process').exec,
  hostPlatform = process.platform,
  logging = require('fedtools-logs'),
  vBoxManageBinary,
  knownOSTypes = {
    WINDOWS: 'windows',
    MAC: 'mac',
    LINUX: 'linux'
  };

// Host operating system
if (/^win/.test(hostPlatform)) {

  // Path may not contain VBoxManage.exe but it provides this environment variable
  var vBoxInstallPath = process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH;
  vBoxManageBinary = '"' + vBoxInstallPath + '\\VBoxManage.exe' + '" ';

} else if (/^darwin/.test(hostPlatform) || /^linux/.test(hostPlatform)) {

  // Mac OS X and most Linux use the same binary name, in the path
  vBoxManageBinary = 'vboxmanage ';

} else {

  // Otherwise (e.g., SunOS) hope it's in the path
  vBoxManageBinary = 'vboxmanage ';

}

function command(cmd, callback) {
  exec(cmd, function (err, stdout, stderr) {

    if (!err && stderr && cmd.indexOf('pause') !== -1 && cmd.indexOf('savestate') !== -1) {
      err = new Error(stderr);
    }

    callback(err, stdout);
  });
}

function vboxcontrol(cmd, callback) {
  command('VBoxControl ' + cmd, callback);
}

function vboxmanage(cmd, callback) {
  command(vBoxManageBinary + cmd, callback);
}

function pause(vmname, callback) {
  logging.info('Pausing VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" pause', function (error, stdout) {
    callback(error);
  });
}

function parseListData(rawData) {
  var _raw = rawData.split(/\r?\n/g);
  var _data = {};
  if (_raw.length > 0) {
    for (var _i = 0; _i < _raw.length; _i += 1) {
      var _line = _raw[_i];
      if (_line === '') {
        continue;
      }
      // "centos6" {64ec13bb-5889-4352-aee9-0f1c2a17923d}
      var rePattern = /^"(.+)" \{(.+)\}$/;
      var arrMatches = _line.match(rePattern);
      // {'64ec13bb-5889-4352-aee9-0f1c2a17923d': 'centos6'}
      if (arrMatches && arrMatches.length === 3) {
        _data[arrMatches[2].toString()] = {
          name: arrMatches[1].toString()
        };
      }
    }
  }
  return _data;
}

function list(callback) {
  vboxmanage('list "runningvms"', function (error, stdout) {
    var _list = {};
    var _runningvms = parseListData(stdout);
    vboxmanage('list "vms"', function (error, fullStdout) {
      var _all = parseListData(fullStdout);
      var _keys = Object.keys(_all);
      for (var _i = 0; _i < _keys.length; _i += 1) {
        var _key = _keys[_i];
        if (_runningvms[_key]) {
          _all[_key].running = true;
        } else {
          _all[_key].running = false;
        }
      }
      callback(error, _all);
    });
  });
}

function reset(vmname, callback) {
  logging.info('Resetting VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" reset', function (error, stdout) {
    callback(error);
  });
}

function resume(vmname, callback) {
  logging.info('Resuming VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" resume', function (error, stdout) {
    callback(error);
  });
}

function start(vmname, useGui, callback) {
  var startOpts = ' --type ';
  if ((typeof useGui) === 'function') {
    callback = useGui;
    useGui = true;
  }
  startOpts += (useGui ? 'gui' : 'headless');

  // logging.info('Starting VM "%s" with options: ', vmname, startOpts);

  vboxmanage('-nologo startvm "' + vmname + '"' + startOpts, function (error, stdout) {
    if (error && /VBOX_E_INVALID_OBJECT_STATE/.test(error.message)) {
      error = undefined;
    }
    callback(error);
  });
}

function stop(vmname, callback) {
  // logging.info('Stopping VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" savestate', function (error, stdout) {
    callback(error);
  });
}

function savestate(vmname, callback) {
  logging.info('Saving State (alias to stop) VM "%s"', vmname);
  stop(vmname, callback);
}

function poweroff(vmname, callback) {
  logging.info('Powering off VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" poweroff', function (error, stdout) {
    callback(error);
  });
}

function acpipowerbutton(vmname, callback) {
  logging.info('ACPI power button VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" acpipowerbutton', function (error, stdout) {
    callback(error);
  });
}

function acpisleepbutton(vmname, callback) {
  logging.info('ACPI sleep button VM "%s"', vmname);
  vboxmanage('controlvm "' + vmname + '" acpisleepbutton', function (error, stdout) {
    callback(error);
  });
}

function vmExec(options, callback) {
  var vm = options.vm || options.name || options.vmname || options.title,
    username = options.user || options.username || 'Guest',
    password = options.pass || options.passwd || options.password,
    path = options.path || options.cmd || options.command || options.exec || options.execute ||
    options.run,
    cmd,
    params = options.params || options.parameters || options.args;

  if (Array.isArray(params)) {
    params = params.join(' ');
  }

  if (params === undefined) {
    params = '';
  }

  function getOSTypeCb(OSType) {
    var cmd = 'guestcontrol "' + vm + '"';

    switch (OSType) {
    case knownOSTypes.WINDOWS:
      path = path.replace(/\\/g, '\\\\');
      cmd += ' execute  --image "cmd.exe" --username ' + username + (password ?
        ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
      break;
    case knownOSTypes.MAC:
      cmd += ' execute  --image "/usr/bin/open -a" --username ' + username + (password ?
        ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
      break;
    case knownOSTypes.LINUX:
      cmd += ' execute  --image "/bin/sh" --username ' + username + (password ?
        ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
      break;
    default:
      break;
    }

    logging.info('Executing command "vboxmanage %s" on VM "%s" detected OS type "%s"', cmd,
      vm, OSType);

    vboxmanage(cmd, function (error, stdout) {
      callback(error);
    });
  }

  guestproperty.os(vm, getOSTypeCb);

}

function vmKill(options, callback) {
  options = options || {};
  var vm = options.vm || options.name || options.vmname || options.title,
    path = options.path || options.cmd || options.command || options.exec || options.execute ||
    options.run,
    imageName = options.imageName || path,
    cmd = 'guestcontrol "' + vm + '" process kill';

  guestproperty.os(vm, function (OSType) {
    switch (OSType) {
    case knownOSTypes.WINDOWS:
      vmExec({
        vm: vm,
        user: options.user,
        password: options.password,
        path: 'C:\\Windows\\System32\\taskkill.exe /im ',
        params: imageName
      }, callback);
      break;
    case knownOSTypes.MAC:
    case knownOSTypes.LINUX:
      vmExec({
        vm: vm,
        user: options.user,
        password: options.password,
        path: 'sudo killall ',
        params: imageName
      }, callback);
      break;
    }
  });

}

var guestproperty = {
  get: function (options, callback) {
    var vm = options.vm || options.name || options.vmname || options.title,
      key = options.key,
      value = options.defaultValue || options.value;

    guestproperty.os(vm, getOSTypeCallback);

    function getOSTypeCallback(OSType) {
      var cmd = 'guestproperty get "' + vm + '" ' + key;
      vboxmanage(cmd, function (error, stdout) {
        if (error) {
          throw error;
        }
        var value = stdout.substr(stdout.indexOf(':') + 1).trim();
        if (value === 'No value set!') {
          value = undefined;
        }
        callback(value);
      });
    }

  },

  OSType: null, // cached

  os: function (vmname, callback) {
    function getOSTypeCallback(error, stdout, stderr) {
      if (error) {
        throw error;
      }

      // The ostype is matched against the ID attribute of 'vboxmanage list ostypes'
      if (stdout.indexOf('ostype="Windows') !== -1) {
        guestproperty.OSType = knownOSTypes.WINDOWS;
      } else if (stdout.indexOf('ostype="MacOS') !== -1) {
        guestproperty.OSType = knownOSTypes.MAC;
      } else {
        guestproperty.OSType = knownOSTypes.LINUX;
      }
      logging.debug('Detected guest OS as: ' + guestproperty.OSType);
      callback(guestproperty.OSType);
    }

    if (guestproperty.OSType) {
      return callback(guestproperty.OSType);
    }

    try {
      exec(vBoxManageBinary + 'showvminfo -machinereadable "' + vmname + '"',
        getOSTypeCallback);
    } catch (e) {
      logging.info('Could not showvminfo for %s', vmname);
    }
  }

};

module.exports = {
  'exec': vmExec,
  'kill': vmKill,
  'list': list,
  'pause': pause,
  'reset': reset,
  'resume': resume,
  'start': start,
  'stop': stop,
  'savestate': savestate,
  'poweroff': poweroff,
  'acpisleepbutton': acpisleepbutton,
  'acpipowerbutton': acpipowerbutton,
  'guestproperty': guestproperty
};
