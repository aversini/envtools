/*eslint no-octal-escape:0*/
var
  MAX_ARGS = 2,
  MAX_FILE_SIZE_BYTES = 20000000,

  async = require('async'),
  program = require('commander'),
  path = require('path'),
  extname = path.extname,
  basename = path.basename,
  fs = require('fs'),
  utilities = require('fedtools-utilities'),
  debug = false,
  verbose = false,
  boring = false,
  ignoreBlacklists = false,
  cwd = process.cwd(),
  fileBlacklist =
  /\.pyc|\.class|\.java~|\.tar|\.gif|\.jpg|\.jpeg|\.pdf|\.png|\.tgz|\.doc|\.xls|\.tar\.gz|\.swp|\.zip|\.dmg|\.jar|\.svg|\.eot|\.ttf|\.woff|\.icns|\.hds/ig,
  dirBlacklist = /node_modules|(^|\/)\.[^\/\.]/ig,
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

// -- P A R S I N G  O P T I O N S

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
  verbose = true;
}

if (program.boring) {
  boring = true;
}

if (program.async) {
  async = true;
}

if (program.debug) {
  debug = true;
  verbose = true;
  boring = false;
}

if (program.rainbow) {
  ignoreBlacklists = true;
}

// -- F U N C T I O N S

function scanFiles(files, done) {
  var
    firstLog = true;
  async.each(files, function (strPath, cb) {
    var
      o,
      sOut,
      lines = [];

    function _scanFile(err, buffer) {
      if (err) {
        throw err;
      }
      buffer.split('\n').forEach(function (line, i) {
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
        if (verbose) {
          if (firstLog) {
            console.log('');
            firstLog = false;
          }
          console.log(sOut + ' (%d ' + o + ')', path.relative(cwd, strPath), lines.length);
        } else {
          if (firstLog) {
            console.log('');
            firstLog = false;
          }
          console.log(sOut, path.relative(cwd, strPath));
        }
        if (program.grep) {
          lines.forEach(function (line) {
            var i = line[0];
            line = line[1];
            line = line.replace(re, '\033[30;43m$1\033[0;90m');
            if (firstLog) {
              console.log('');
              firstLog = false;
            }
            console.log('  \033[90m%d: %s\033[0m', i + 1, line);
          });
          if (firstLog) {
            console.log('');
            firstLog = false;
          }
          console.log('');
        }
      }
      return cb(null);
    }
    _scanFile(null, fs.readFileSync(strPath, 'utf8'));
  }, function (err) {
    return done(err, {
      o: totalOccurrences,
      f: totalFilesMatched,
      s: files.length
    });
  });
}

function ignoreFolders(file, stats) {
  // `file` is the absolute path to the file, and `stats` is an `fs.Stats`
  // object returned from `fs.lstat()`.
  if (ignoreBlacklists) {
    return false;
  }
  return stats.isDirectory() && dirBlacklist.exec(basename(file));
}

function ignoreFiles(file, stats) {
  // `file` is the absolute path to the file, and `stats` is an `fs.Stats`
  // object returned from `fs.lstat()`.
  if (ignoreBlacklists) {
    return false;
  }
  if (stats.isFile()) {
    // return true (ignore) for blacklisted files
    if (extname(file).match(fileBlacklist)) {
      return true;
    }
    // if we are only looking for a specific extension,
    // return true (ignore) for all the others
    if (program.extension) {
      return program.extension !== extname(file);
    }
    // filter out any file bigger than MAX_FILE_SIZE
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      return true;
    }
  }
}

function findFiles(dir, done) {
  require('recursive-readdir')(dir, [ignoreFolders, ignoreFiles], function (err, files) {
    done(err, files);
  });
}


// -- C O M M A N D  E N T R Y  P O I N T

if (verbose) {
  utilities.timeTracker('start');
}

findFiles(cwd, function (err, files) {
  if (err) {
    throw err;
  }
  if (files.length > 0) {
    scanFiles(files, function (err, data) {
      var o, f;
      if (err) {
        throw new Error(err);
      }
      if (verbose) {
        console.log('');
        if (data) {
          o = (data.o === 1) ? 'occurrence found  : ' : 'occurrences found : ';
          f = (data.f === 1) ? 'file matching     : ' : 'files matching    : ';
          console.log('  Total %s%d', o, data.o);
          console.log('  Total %s%d', f, data.f);
          console.log('  Total files scanned     :', files.length);
        }
        if (debug) {
          console.log('\n[DEBUG] files:');
          files.forEach(function (file) {
            console.log(file);
          });
          console.log('');
        }
        utilities.timeTracker('stop', '  Elapsed time            : ');
        console.log('');
      } else {
        if (!boring && data.o) {
          console.log('');
        }
      }
    });
  }
});
