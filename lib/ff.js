var
  STR_TYPE_DIRECTORY = 'd',
  STR_TYPE_FILE = 'f',
  BYTE_CHUNKS = 1000,
  MODE_OWNER_POS = 0,
  MODE_GROUP_POS = 1,
  MODE_WORD_POS = 2,
  OCTAL = 8,
  DECIMAL = 10,
  LAST_THREE_ENTRIES = -3,

  program = require('commander'),
  path = require('path'),
  join = path.join,
  basename = path.basename,
  fs = require('fs'),
  moment = require('moment'),
  childProcess = require('child_process'),
  utilities = require('fedtools-utilities'),
  cmd = require('fedtools-commands'),
  log = require('fedtools-logs'),
  common = require('./common'),
  type = STR_TYPE_FILE,
  longListing = false,
  debug = false,
  stats = false,
  boring = false,
  cwd = process.cwd(),
  ignoreBlacklists = false,
  dirBlacklist = /node_modules|(^|\/)\.[^/.]/ig,
  dirsList = [],
  filesList = [],
  rePattern,
  command,
  totalDirScanned = 0,
  totalFileScanned = 0,
  perf,
  groupNames = {},
  ownerNames = {
    0: 'root'
  };

program
  .usage('[options]')
  .option('-p, --pattern <value>', 'a regular expression to match (file or folder)')
  .option('-t, --type <' + STR_TYPE_FILE + '|' + STR_TYPE_DIRECTORY + '>', 'list only files or directories')
  .option('-l, --long', 'long listing (equivalent to ls -l)')
  .option('-H, --hidden', 'show hidden files and directories')
  .option('-c, --command <value>', 'command to execute over each node (ex: chmod +x)')
  .option('-b, --boring', 'do not use color output')
  .option('-r, --rainbow', 'do not ignore any files or folders')
  .option('-s, --stats', 'display some statistics');

program.on('--help', function () {
  log.echo('  Description:');
  log.echo('');
  log.echo('    List files or directories under the current directory that match');
  log.echo('    the given pattern or all of them if no pattern is given. If the');
  log.echo('    type is omitted, the default behavior is to look for files.');
  log.echo('');
  log.echo('  Examples:');
  log.echo('');
  log.echo('    $ ff -p \'.*-min.js\'');
  log.echo('    $ ff -t d -p \'lib\'');
  log.echo('    $ ff -c \'chmod +x\'');
  log.echo('');
});

program.parse(process.argv);

/*******************/
/* Parsing options */
/*******************/

if (program.args.length > 1) {
  // too many patterns!
  log.error('==> oops: ', program.args);
  program.help();
} else if (program.args.length === 1) {
  program.help();
}

if (typeof program.pattern === 'string') {
  rePattern = new RegExp(program.pattern);
}

if (typeof program.type === 'string') {
  if (program.type === STR_TYPE_FILE || program.type === STR_TYPE_DIRECTORY) {
    type = program.type;
  } else {
    program.help();
  }
}

if (program.long) {
  longListing = true;
}

if (typeof program.command === 'string') {
  command = program.command.trim().split(' ');
}

if (program.stats) {
  stats = true;
}

if (program.boring) {
  boring = true;
}

if (program.rainbow) {
  ignoreBlacklists = true;
}

if (program.debug) {
  debug = true;
  stats = true;
  boring = false;
}

/*******************/
/* Functions       */
/*******************/

function hidden(path) {
  if (program.hidden) {
    return true;
  }
  return path[0] !== '.';
}

function checkPattern(str, type) {
  if (rePattern) {
    if (type === STR_TYPE_FILE || type === STR_TYPE_DIRECTORY) {
      if (debug) {
        log.echo('==> looking for: [%s]', rePattern);
        log.echo('==> str to check: ', str);
      }
      rePattern.lastIndex = 0;
      return rePattern.exec(str);
    }
  }
  return true;
}

function runCommand(node) {
  var sProcess,
    sCommand,
    sArgs;

  if (command) {
    sCommand = command[0];
    // need a clone, not a reference
    sArgs = command.slice(0);
    sArgs.shift();
    sArgs.push(node);
    sProcess = childProcess.spawn(sCommand, sArgs);
    sProcess.stdout.on('data', function (data) {
      if (data) {
        log.echo(data.toString());
      }
    });
    sProcess.stderr.on('data', function (data) {
      if (data) {
        log.echo(data.toString());
      }
    });
  }
}

function ignoreFolders(dir) {
  if (ignoreBlacklists) {
    return false;
  }
  return dirBlacklist.exec(basename(dir));
}

function findNodes(dirs, options) {
  dirs.forEach(function (strPath) {
    var
      res,
      files,
      shortname,
      stat = fs.lstatSync(strPath);

    if (stat.isDirectory() && !ignoreFolders(strPath)) {
      totalDirScanned++;
      if (options.type === STR_TYPE_DIRECTORY) {
        if ((res = checkPattern(strPath, options.type))) {
          dirsList.push({
            match: res,
            name: strPath,
            stat: stat
          });
          runCommand(strPath);
        }
      }

      try {
        files = fs.readdirSync(strPath);
        findNodes(files.filter(hidden).map(function (file) {
          return join(strPath, file);
        }), options);
      } catch (e) {
        // nothing to declare
      }
    } else if (stat.isFile()) {
      totalFileScanned++;
      if (options.type === STR_TYPE_FILE) {
        shortname = basename(strPath);
        if ((res = checkPattern(shortname, options.type))) {
          filesList.push({
            match: res[0],
            name: strPath,
            shortname: shortname,
            stat: stat
          });
          runCommand(strPath);
        }
      }
    }
  });
}

function extractMode(mode) {
  var
    modeDec = parseInt(mode.toString(OCTAL), DECIMAL).toString().slice(LAST_THREE_ENTRIES),
    modeOwner = modeDec.charAt(MODE_OWNER_POS),
    modeGroup = modeDec.charAt(MODE_GROUP_POS),
    modeWorld = modeDec.charAt(MODE_WORD_POS),

    modes = {
      0: '---',
      1: '--x',
      2: '-w-',
      3: '-wx',
      4: 'r--',
      5: 'r-x',
      6: 'rw-',
      7: 'rwx'
    };
  return modes[modeOwner] + modes[modeGroup] + modes[modeWorld];
}

function convertSize(bytes) {
  var
    sizes = ['B', 'K', 'M', 'G', 'T'],
    posttxt = 0,
    len = 5,
    str;

  while (bytes >= BYTE_CHUNKS) {
    posttxt = posttxt + 1;
    bytes = bytes / BYTE_CHUNKS;
  }
  str = parseInt(bytes, DECIMAL).toFixed(0) + sizes[posttxt];
  return new Array(len + 1 - str.length).join(' ') + str;
}

function convertDate(date) {
  return moment(date).format('MMM DD HH:mm');
}

function getOwnerNameFromId(uid) {
  var
    res;

  if (!ownerNames[uid]) {
    // set to number as a default
    ownerNames[uid] = uid;
    if (common.isMac()) {
      res = cmd.run('id -nu ' + uid, {
        status: false
      });
      if (res.code === 0 && res.stdout !== '') {
        ownerNames[uid] = res.stdout.replace(/\n$/g, '');
      }
    }
  }
  return ownerNames[uid];
}

function getGroupNameFromId(gid) {
  var
    group,
    res;

  if (!groupNames[gid]) {
    // set to number as a default
    groupNames[gid] = gid;
    if (common.isMac()) {
      res = cmd.run('grep \':*:' + gid + ':\' /etc/group', {
        status: false
      });
      if (res.code === 0 && res.stdout !== '') {
        group = res.stdout.split(':');
        if (group && group.length) {
          groupNames[gid] = group[0];
        }
      }
    }
  }
  return groupNames[gid];
}


function formatLongListings(stat, type) {
  var
    res,
    delim = (type === STR_TYPE_FILE) ? '-' : 'd';

  res = {
    mode: delim + extractMode(stat.mode),
    size: ' ' + convertSize(stat.size),
    mdate: ' ' + convertDate(stat.mtime) + ' '
  };

  res.owner = '  ' + getOwnerNameFromId(stat.uid);
  res.group = '  ' + getGroupNameFromId(stat.gid);

  return res;
}

/*******************/
/* Geronimo!       */
/*******************/
if (stats) {
  utilities.performance.mark('ff-1');
}

findNodes([cwd], {
  type: type
});

if (!boring) {
  log.echo('');
}

utilities.performance.mark('ff-2');

if (filesList.length > 0) {
  filesList.forEach(function (file) {
    var name,
      stat = file.stat,
      l = {
        mode: '',
        size: '',
        owner: '',
        group: '',
        mdate: ''
      };

    if (longListing) {
      l = formatLongListings(stat, STR_TYPE_FILE);
    }
    name = './' + path.relative(cwd, file.name);
    if (boring) {
      log.rainbow('%s%s%s%s%s%s', l.mode, l.owner, l.group, l.size, l.mdate, name);
    } else {
      if (file && file.match && file.shortname) {
        name = name.replace(file.shortname,
          file.shortname.replace(file.match, common.LOG_COLORS.FOCUS_BG + file.match));
      }
      log.rainbow('  ' + common.LOG_COLORS.GREY + '%s%s%s%s%s%s' + common.LOG_COLORS.RESET,
        l.mode, l.owner, l.group, l.size, l.mdate, name);
    }
  });
  utilities.performance.mark('ff-file');
} else if (dirsList.length > 0) {
  dirsList.forEach(function (dir) {
    var name,
      stat = dir.stat,
      l = {
        mode: '',
        size: '',
        owner: '',
        group: '',
        mdate: ''
      };

    if (longListing) {
      l = formatLongListings(stat, STR_TYPE_DIRECTORY);
    }
    name = path.relative(cwd, dir.name);
    name = (name === '') ? '.' : './' + name;
    if (boring) {
      log.rainbow('%s%s%s%s%s', l.mode, l.owner, l.group, l.mdate, name);
    } else {
      if (dir && dir.match) {
        name = name.replace(dir.match, common.LOG_COLORS.FOCUS_BG + dir.match);
      }
      log.rainbow('  ' + common.LOG_COLORS.BLUE + '%s%s%s%s%s' + common.LOG_COLORS.RESET,
        l.mode, l.owner, l.group, l.mdate, name);
    }
  });
  utilities.performance.mark('ff-dir');
}

if (stats) {
  log.echo('');
  if (dirsList.length) {
    log.echo('  Total dirs matching     : ' + dirsList.length);
    log.echo('  Total dirs scanned      : ' + totalDirScanned);
    utilities.performance.measure('dir-list', 'ff-1', 'ff-dir');
    perf = utilities.performance.getEntriesByName('dir-list');
    if (perf && perf[0].duration) {
      log.echo('  Elapsed time            : ' +
        utilities.formatMillisecondsToHuman(perf[0].duration));
    }
  }
  if (filesList.length) {
    log.echo('  Total files matching    : ' + filesList.length);
    log.echo('  Total files scanned     : ' + totalFileScanned);
    utilities.performance.measure('file-list', 'ff-1', 'ff-file');
    perf = utilities.performance.getEntriesByName('file-list');
    if (perf && perf[0].duration) {
      log.echo('  Elapsed time            : ' +
        utilities.formatMillisecondsToHuman(perf[0].duration));
    }
  }
  log.echo('');
} else if (!boring) {
  log.echo('');
}
