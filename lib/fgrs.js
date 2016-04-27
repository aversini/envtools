#!/usr/bin/env node
/*eslint no-octal-escape:0*/
var
  MAX_ARGS = 2,

  program = require('commander'),
  path = require('path'),
  join = path.join,
  fs = require('fs'),
  utilities = require('fedtools-utilities'),
  pendingNodes = 0,
  debug = false,
  stats = false,
  boring = false,
  async = false,
  ignoreBlacklists = false,
  cwd = process.cwd(),
  dirsList = [],
  filesList = [],
  fileBlacklist =
  /\.pyc|\.class|\.java~|\.tar|\.gif|\.jpg|\.jpeg|\.pdf|\.png|\.tgz|\.doc|\.xls|\.tar\.gz|\.swp|\.zip|\.dmg|\.jar|\.svg|\.eot|\.ttf|\.woff/ig,
  dirBlacklist = /node_modules/ig,
  totalOccurrences = 0,
  totalFilesMatched = 0,
  re;

program
  .version('0.0.1')
  .usage('[options] pattern')
  .option('-s, --stats', 'display some statistics')
  .option('-i, --ignore-case', 'ignore case distinctions')
  .option('-g, --grep', 'display grep output')
  .option('-b, --boring', 'do not use color output')
  .option('-d, --debug', 'display debbuging information')
  .option('-a, --async', 'switch to asynchronous search')
  .option('-r, --rainbow', 'do not ignore any files or folders')
  .option('-e, --ext <value>', 'look only for file with extension *.value');

program.on('--help', function () {
  console.log('  Description:');
  console.log('');
  console.log('    Search for a pattern in readable files recursively starting');
  console.log('    in the current directory. This is an enhanced version of a');
  console.log('    find and a grep.');
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ fgrs.js wf2-skin-nx -e scss -g');
  console.log('    $ fgrs.js wf2-skin-nx -s');
  console.log('');
});

program.parse(process.argv);

/*******************/
/* Parsing options */
/*******************/
if (process.argv.length === MAX_ARGS || program.args.length !== 1) {
  // missing arguments or invalid option
  program.help();
}

if (typeof program.ext === 'string') {
  program.extension = '.' + program.ext.slice(program.ext.lastIndexOf('.') + 1);
}

if (program.ignoreCase) {
  re = new RegExp('(' + program.args + ')', 'ig');
} else {
  re = new RegExp('(' + program.args + ')', 'g');
}

if (program.stats) {
  stats = true;
}

if (program.boring) {
  boring = true;
}

if (program.async) {
  async = true;
}

if (program.debug) {
  debug = true;
  stats = true;
  boring = false;
}

if (program.rainbow) {
  ignoreBlacklists = true;
}

/*******************/
/* Functions       */
/*******************/

function checkExtension(file) {
  if (program.extension) {
    if (program.extension === path.extname(file)) {
      return true;
    } else {
      return false;
    }
  }
  if (!ignoreBlacklists) {
    if (path.extname(file).match(fileBlacklist)) {
      return false;
    }
  }

  return true;
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

function hidden(path) {
  if (program.hidden) {
    return true;
  }
  return path[0] !== '.';
}

function findFiles(dirs, done) {
  dirs.forEach(function (strPath) {
    pendingNodes = pendingNodes + 1; // counting all node (files + dirs)
    fs.stat(strPath, function (err, stat) {
      if (err) {
        throw err;
      }

      if (stat.isDirectory()) {
        if (checkDirectory(strPath)) {
          dirsList.push(strPath);

          fs.readdir(strPath, function (err, files) {
            if (err) {
              throw err;
            }
            findFiles(files.filter(hidden).map(function (file) {
              return join(strPath, file);
            }), done);
            pendingNodes = pendingNodes - 1; //done with this directory
            if (debug) {
              console.log('==> pendingNodes: ', pendingNodes);
            }
            if (!pendingNodes) {
              return done();
            }
          });
        } else {
          pendingNodes = pendingNodes - 1; // ignoring this directory
        }
      } else {
        if (stat.isFile() && checkExtension(strPath)) {
          filesList.push(strPath);
        }
        pendingNodes = pendingNodes - 1; // done with this file
        if (debug) {
          console.log('==> pendingNodes: ', pendingNodes);
        }
        if (!pendingNodes) {
          return done();
        }
      }
    });
  });
}

function scanFiles(done) {
  filesList.forEach(function (strPath) {
    var o, sOut, lines = [],
      readFileNode = function (err, str) {
        if (err) {
          throw err;
        }
        str.split('\n').forEach(function (line, i) {
          re.lastIndex = 0;
          if (!re.test(line)) {
            return;
          }
          lines.push([i, line]);
        });

        if (lines.length) {
          o = (lines.length === 1) ? 'occurrence' : 'occurrences';
          sOut = '';
          totalOccurrences += lines.length;
          totalFilesMatched = totalFilesMatched + 1;
          if (boring) {
            sOut = './%s';
          } else {
            sOut = '  \033[36m./%s\033[0m';
          }
          if (stats) {
            console.log(sOut + ' (%d ' + o + ')', path.relative(cwd, strPath), lines.length);
          } else {
            console.log(sOut, path.relative(cwd, strPath));
          }
          if (program.grep) {
            lines.forEach(function (line) {
              var i = line[0];
              line = line[1];
              line = line.replace(re, '\033[30;43m$1\033[0;90m');
              console.log('  \033[90m%d: %s\033[0m', i + 1, line);
            });
            console.log('');
          }
        }
        pendingNodes = pendingNodes - 1; // done with this file
        if (debug) {
          console.log('==> pendingNodes: ', pendingNodes);
        }
        if (!pendingNodes) {
          return done(null, {
            o: totalOccurrences,
            f: totalFilesMatched
          });
        }
      };

    if (async) {
      fs.readFile(strPath, 'utf8', readFileNode);
    } else {
      readFileNode(null, fs.readFileSync(strPath, 'utf8'));
    }
  });
}

/*******************/
/* Geronimo!       */
/*******************/

if (stats) {
  utilities.timeTracker('start');
}

if (!boring || program.grep) {
  console.log('');
}

findFiles([cwd], function () {
  if (filesList.length > 0) {
    pendingNodes = filesList.length;
    scanFiles(function (err, data) {
      var o, f;
      if (err) {
        throw new Error(err);
      }
      if (stats) {
        console.log('');
        if (data) {
          o = (data.o === 1) ? 'occurrence found  : ' : 'occurrences found : ';
          f = (data.f === 1) ? 'file matching     : ' : 'files matching    : ';
          console.log('  Total %s%d', o, data.o);
          console.log('  Total %s%d', f, data.f);
        }
        if (async) {
          console.log('  Asynchronous search     : ', async);
        }
        if (debug) {
          console.log('  total dirs found        :', dirsList.length);
          console.log('  total files found       :', filesList.length);
        }
        utilities.timeTracker('stop', '  Elapsed time            : ');
        console.log('');
      } else {
        if (!boring) {
          console.log('');
        }
      }
    });
  }
});
