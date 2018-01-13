let STR_TYPE_DIRECTORY = 'd',
  STR_TYPE_FILE = 'f',
  BYTE_CHUNKS = 1000,
  MODE_OWNER_POS = 0,
  MODE_GROUP_POS = 1,
  MODE_WORD_POS = 2,
  OCTAL = 8,
  DECIMAL = 10,
  LAST_THREE_ENTRIES = -3,
  optimist,
  program,
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
  dirBlacklist = /node_modules|(^|\/)\.[^/.]/gi,
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

optimist = require('optimist')
  .usage(
    '\nDescription:\n' +
      ' List files or directories under the current directory that match\n' +
      ' the given pattern or all of them if no pattern is given. If the\n' +
      ' type is omitted, the default behavior is to look for files.\n\n' +
      'Usage: ff [options] -p <search pattern> '
  )
  .options('p', {
    demand: true,
    alias: 'pattern',
    describe: 'a regular expression to match'
  })
  .options('t', {
    alias: 'type',
    describe: 'choose to list either files or directories'
  })
  .options('l', {
    alias: 'long',
    describe: 'long listing format (equivalent to ls -l)'
  })
  .options('H', {
    alias: 'hidden',
    describe: 'show hidden files and directories'
  })
  .options('c', {
    alias: 'command',
    describe: 'command to execute over each node (ex: chmod +x)'
  })
  .options('b', {
    alias: 'boring',
    describe: 'do not use color output'
  })
  .options('d', {
    alias: 'debug',
    describe: 'display debbuging information'
  })
  .options('r', {
    alias: 'rainbow',
    describe: 'do not ignore any files or folders'
  })
  .options('s', {
    alias: 'stats',
    describe: 'display some statistics'
  })
  .boolean(['l', 'H', 'b', 'd', 's', 'r']);

program = optimist.argv;

/** **************** */
/* Parsing options */
/** **************** */

if (program._.length) {
  // too many arguments
  optimist.showHelp();
  process.exit(1);
}

if (typeof program.pattern === 'string') {
  rePattern = new RegExp(program.pattern);
}

if (typeof program.type === 'string') {
  if (program.type === STR_TYPE_FILE || program.type === STR_TYPE_DIRECTORY) {
    type = program.type;
  } else {
    optimist.showHelp();
    process.exit(1);
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

/** **************** */
/* Functions       */
/** **************** */

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
  let sProcess, sCommand, sArgs;

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
    let res,
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
            stat
          });
          runCommand(strPath);
        }
      }

      try {
        files = fs.readdirSync(strPath);
        findNodes(
          files.filter(hidden).map(function (file) {
            return join(strPath, file);
          }),
          options
        );
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
            shortname,
            stat
          });
          runCommand(strPath);
        }
      }
    }
  });
}

function extractMode(mode) {
  let modeDec = parseInt(mode.toString(OCTAL), DECIMAL)
      .toString()
      .slice(LAST_THREE_ENTRIES),
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
  let sizes = ['B', 'K', 'M', 'G', 'T'],
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
  let res;

  if (!ownerNames[uid]) {
    // set to number as a default
    ownerNames[uid] = uid;
    res = cmd.run(`id -nu ${uid}`, {
      status: false
    });
    if (res.code === 0 && res.stdout !== '') {
      ownerNames[uid] = res.stdout.replace(/\n$/g, '');
    }
  }
  return ownerNames[uid];
}

function getGroupNameFromId(gid) {
  let group, res;

  if (!groupNames[gid]) {
    // set to number as a default
    groupNames[gid] = gid;
    res = cmd.run(`grep ':*:${gid}:' /etc/group`, {
      status: false
    });
    if (res.code === 0 && res.stdout !== '') {
      group = res.stdout.split(':');
      if (group && group.length) {
        groupNames[gid] = group[0];
      }
    }
  }
  return groupNames[gid];
}

function formatLongListings(stat, type) {
  let res,
    delim = type === STR_TYPE_FILE ? '-' : 'd';

  res = {
    mode: delim + extractMode(stat.mode),
    size: ` ${convertSize(stat.size)}`,
    mdate: ` ${convertDate(stat.mtime)} `
  };

  if (common.isWindows()) {
    res.owner = `  ${stat.uid}`;
    res.group = `  ${stat.gid}`;
  } else {
    res.owner = `  ${getOwnerNameFromId(stat.uid)}`;
    res.group = `  ${getGroupNameFromId(stat.gid)}`;
  }

  return res;
}

/** **************** */
/* Geronimo!       */
/** **************** */
if (stats) {
  utilities.performance.mark('ff-1');
}

findNodes([cwd], {
  type
});

if (!boring) {
  log.echo('');
}

utilities.performance.mark('ff-2');

if (filesList.length > 0) {
  filesList.forEach(function (file) {
    let name,
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
    name = `./${path.relative(cwd, file.name)}`;
    if (boring) {
      log.rainbow(
        '%s%s%s%s%s%s',
        l.mode,
        l.owner,
        l.group,
        l.size,
        l.mdate,
        name
      );
    } else {
      if (file && file.match && file.shortname) {
        name = common.LOG_COLORS.gray(
          name.replace(
            file.shortname,
            file.shortname.replace(
              file.match,
              common.LOG_COLORS.focusBg(file.match)
            )
          )
        );
      }
      log.rainbow(
        '  %s%s%s%s%s%s',
        l.mode,
        l.owner,
        l.group,
        l.size,
        l.mdate,
        name
      );
    }
  });
  utilities.performance.mark('ff-file');
} else if (dirsList.length > 0) {
  dirsList.forEach(function (dir) {
    let name,
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
    name = name === '' ? '.' : `./${name}`;
    if (boring) {
      log.rainbow('%s%s%s%s%s', l.mode, l.owner, l.group, l.mdate, name);
    } else {
      if (dir && dir.match) {
        name = common.LOG_COLORS.blue(
          name.replace(dir.match, common.LOG_COLORS.focusBg(dir.match))
        );
      }
      log.rainbow('  %s%s%s%s%s', l.mode, l.owner, l.group, l.mdate, name);
    }
  });
  utilities.performance.mark('ff-dir');
}

if (stats) {
  log.echo('');
  if (dirsList.length) {
    log.echo(`  Total dirs matching     : ${dirsList.length}`);
    log.echo(`  Total dirs scanned      : ${totalDirScanned}`);
    utilities.performance.measure('dir-list', 'ff-1', 'ff-dir');
    perf = utilities.performance.getEntriesByName('dir-list');
    if (perf && perf[0].duration) {
      log.echo(
        `  Elapsed time            : ${
          utilities.formatMillisecondsToHuman(perf[0].duration)}`
      );
    }
  }
  if (filesList.length) {
    log.echo(`  Total files matching    : ${filesList.length}`);
    log.echo(`  Total files scanned     : ${totalFileScanned}`);
    utilities.performance.measure('file-list', 'ff-1', 'ff-file');
    perf = utilities.performance.getEntriesByName('file-list');
    if (perf && perf[0].duration) {
      log.echo(
        `  Elapsed time            : ${
          utilities.formatMillisecondsToHuman(perf[0].duration)}`
      );
    }
  }
  log.echo('');
} else if (!boring) {
  log.echo('');
}
