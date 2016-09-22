/*eslint no-octal-escape: 0*/
var
  STR_TYPE_DIRECTORY = 'd',
  STR_TYPE_FILE = 'f',
  BYTE_CHUNKS = 1024,
  MODE_OWNER_POS = 0,
  MODE_GROUP_POS = 1,
  MODE_WORD_POS = 2,
  OCTAL = 8,
  DECIMAL = 10,
  LAST_THREE_ENTRIES = -3,

  program = require('commander'),
  path = require('path'),
  join = path.join,
  fs = require('fs'),
  posix,
  moment = require('moment'),
  childProcess = require('child_process'),
  utilities = require('fedtools-utilities'),
  type = STR_TYPE_FILE,
  longListing = false,
  debug = false,
  stats = false,
  boring = false,
  cwd = process.cwd(),
  ignoreBlacklists = false,
  dirBlacklist = /node_modules/,
  dirsList = [],
  filesList = [],
  reFiles,
  reDirs,
  command,
  pattern,
  purePattern;

try {
  posix = require('posix');
} catch (err) {
  posix = null;
}

program
  .version('0.0.1')
  .usage('[options] [pattern]')

.option('-t, --type <' + STR_TYPE_FILE + '|' + STR_TYPE_DIRECTORY + '>', 'list only files or directories')
  .option('-l, --long', 'long listing (equivalent to ls -l)')
  .option('-H, --hidden', 'show hidden files and directories')
  .option('-c, --command <value>', 'command to execute over each node (ex: chmod -x)')
  .option('-b, --boring', 'do not use color output')
  .option('-r, --rainbow', 'do not ignore any files or folders')
  .option('-s, --stats', 'display some statistics');

program.on('--help', function () {
  console.log('  Description:');
  console.log('');
  console.log('    List files or directories under the current directory that match');
  console.log('    the given pattern or all of them if no pattern is given. If the');
  console.log('    type is omitted, the default behavior is to look for files.');
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ ff.js \'*-min.js\'');
  console.log('    $ ff.js --type d \'js\'');
  console.log('');
});

program.parse(process.argv);

/*******************/
/* Parsing options */
/*******************/

if (program.args.length > 1) {
  // too many patterns!
  console.log('==> oops: ', program.args);
  program.help();
} else if (program.args.length === 1) {
  pattern = program.args.toString().replace('*', '').replace('.', '\\.');
  purePattern = program.args.toString().replace('*', '');
  reFiles = new RegExp(pattern + '$');
  reDirs = new RegExp(pattern);
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
  if (pattern) {
    if (debug) {
      console.log('==> looking for: [%s]', pattern);
    }
    if (type === STR_TYPE_FILE) {
      reFiles.lastIndex = 0;
      if (str.match(reFiles)) {
        return true;
      } else {
        return false;
      }
    } else if (type === STR_TYPE_DIRECTORY) {
      reDirs.lastIndex = 0;
      if (str.match(reDirs)) {
        return true;
      } else {
        return false;
      }
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
    sArgs = command.slice(0); // need a clone, not a reference
    sArgs.shift();
    sArgs.push(node);
    sProcess = childProcess.spawn(sCommand, sArgs);
    sProcess.stdout.on('data', function (data) {
      if (data) {
        console.info(data.toString());
      }
    });
    sProcess.stderr.on('data', function (data) {
      if (data) {
        console.info(data.toString());
      }
    });
  }
}

function checkDirectory(dir) {
  if (!ignoreBlacklists) {
    if (dir.match(dirBlacklist)) {
      return false;
    } else {
      return true;
    }
  }
  return true;
}

function findNodes(dirs, options) {
  dirs.forEach(function (strPath) {
    var files, stat = fs.lstatSync(strPath);
    if (stat.isDirectory() && checkDirectory(strPath)) {
      if (options.type === STR_TYPE_DIRECTORY) {
        if (checkPattern(strPath, options.type)) {
          dirsList.push({
            name: strPath,
            stat: stat
          });
          runCommand(strPath);
        }
      }
      files = fs.readdirSync(strPath);
      findNodes(files.filter(hidden).map(function (file) {
        return join(strPath, file);
      }), options);
    } else if (stat.isFile()) {
      if (options.type === STR_TYPE_FILE) {
        if (checkPattern(strPath, options.type)) {
          filesList.push({
            name: strPath,
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

function formatLongListings(stat, type) {
  var
    res,
    delim = (type === STR_TYPE_FILE) ? '-' : 'd';

  res = {
    mode: delim + extractMode(stat.mode),
    size: ' ' + convertSize(stat.size),
    mdate: ' ' + convertDate(stat.mtime) + ' '
  };
  if (posix) {
    res.owner = '  ' + posix.getpwnam(stat.uid).name;
    res.group = '  ' + posix.getgrnam(stat.gid).name;
  } else {
    res.owner = '  ' + stat.uid;
    res.group = '  ' + stat.gid;
  }
  return res;
}

/*******************/
/* Geronimo!       */
/*******************/
if (stats) {
  utilities.timeTracker('start');
}

findNodes([cwd], {
  type: type
});

if (!boring) {
  console.log('');
}

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
      console.log('%s%s%s%s%s%s', l.mode, l.owner, l.group, l.size, l.mdate, name);
    } else {
      if (purePattern) {
        name = name.replace(purePattern, '\033[30;43m' + purePattern + '\033[0;90m');
      }
      console.log('  \033[90m%s%s%s%s%s%s\033[0m', l.mode, l.owner, l.group, l.size, l.mdate, name);
    }
  });
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
      console.log('%s%s%s%s%s', l.mode, l.owner, l.group, l.mdate, name);
    } else {
      if (purePattern) {
        name = name.replace(purePattern, '\033[30;43m' + purePattern + '\033[0;90m');
      }
      console.log('  \033[90m%s%s%s%s%s\033[0m', l.mode, l.owner, l.group, l.mdate, name);
    }
  });
}

if (stats) {
  console.log('');
  if (dirsList.length) {
    console.log('  Total dirs listed       : ', dirsList.length);
  }
  if (filesList.length) {
    console.log('  Total files listed      : ', filesList.length);
  }
  utilities.timeTracker('stop', '  Elapsed time            :  ');
  console.log('');
} else {
  if (!boring) {
    console.log('');
  }
}
