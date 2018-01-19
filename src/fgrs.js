/* eslint no-console:0, no-useless-escape:0, complexity:0 */

const MAX_FILE_SIZE_BYTES = 20000000;
const each = require('async/each');
const fs = require('fs');
const utilities = require('fedtools-utilities');
const common = require('./common');
const path = require('path');
const extname = path.extname;
const basename = path.basename;

const cwd = process.cwd();
const fileBlacklist = /\.pyc|\.class|\.java~|\.tar|\.gif|\.jpg|\.jpeg|\.pdf|\.png|\.tgz|\.doc|\.xls|\.tar\.gz|\.swp|\.zip|\.dmg|\.jar|\.svg|\.eot|\.ttf|\.woff|\.icns|\.hds|\.a|\.so/gi;
const dirBlacklist = /node_modules|(^|\/)\.[^\/\.]/gi;

let totalOccurrences = 0,
  totalFilesMatched = 0,
  reFlag,
  rePattern,
  debug = false,
  verbose = false,
  boring = false,
  ignoreBlacklists = false;

const optimist = require('optimist')
  .usage(
    '\nDescription:\n' +
      ' Search for a pattern in all non-hidden and readable files\n' +
      ' within the current directory. This is an enhanced version\n' +
      ' of a find and a grep.\n\n' +
      'Usage: fgrs [options] -p <search pattern> '
  )
  .options('p', {
    demand: true,
    alias: 'pattern',
    describe: 'a regular expression to match'
  })
  .options('i', {
    alias: 'ignore-case',
    describe: 'ignore case distinctions'
  })
  .options('g', {
    alias: 'grep',
    describe: 'display grep output'
  })
  .options('e', {
    alias: 'ext',
    describe: 'look only for file with extension *.value'
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
  .boolean(['b', 'd', 's', 'g', 'r']);

const program = optimist.argv;

if (program._.length) {
  // too many arguments
  optimist.showHelp();
  process.exit(1);
}

if (typeof program.ext === 'string') {
  program.extension = `.${program.ext.slice(program.ext.lastIndexOf('.') + 1)}`;
}

if (program['ignore-case']) {
  reFlag = 'ig';
} else {
  reFlag = 'g';
}

if (
  typeof program.pattern === 'string' ||
  typeof program.pattern === 'number'
) {
  rePattern = new RegExp(program.pattern, reFlag);
} else {
  optimist.showHelp();
  process.exit(1);
}

if (program.stats) {
  verbose = true;
}

if (program.boring) {
  boring = true;
}

if (program.debug) {
  debug = true;
  verbose = true;
  boring = false;
}

if (program.grep) {
  // can't have both
  boring = false;
}

if (program.rainbow) {
  ignoreBlacklists = true;
}

// -- F U N C T I O N S

function scanFiles(files, done) {
  let firstLog = true;
  each(
    files,
    function (strPath, cb) {
      let o, sOut;
      const lines = [];

      function _scanFile(err, buffer) {
        if (err) {
          throw err;
        }
        buffer.split('\n').forEach(function (line, i) {
          rePattern.lastIndex = 0;
          if (!rePattern.test(line)) {
            return;
          }
          lines.push([i, line]);
        });

        if (lines.length) {
          o = lines.length === 1 ? 'occurrence' : 'occurrences';
          sOut = '';
          totalOccurrences += lines.length;
          totalFilesMatched = totalFilesMatched + 1;
          if (boring) {
            sOut = './%s';
          } else {
            sOut = `  ${common.LOG_COLORS.gray('./%s')}`;
          }
          if (verbose) {
            if (firstLog && !boring) {
              console.log('');
              firstLog = false;
            }
            console.log(
              `${sOut} (%d ${o})`,
              path.relative(cwd, strPath),
              lines.length
            );
          } else {
            if (firstLog && !boring) {
              console.log('');
              firstLog = false;
            }
            console.log(sOut, path.relative(cwd, strPath));
          }
          if (program.grep) {
            lines.forEach(function (line) {
              const lineNumber = line[0];

              line = line[1];
              rePattern.lastIndex = 0;
              const res = rePattern.exec(line);
              line = common.LOG_COLORS.gray(
                line.replace(rePattern, common.LOG_COLORS.focusBg(res[0]))
              );

              if (firstLog) {
                console.log('');
                firstLog = false;
              }
              console.log('  %d: %s', lineNumber + 1, line);
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
    },
    function (err) {
      return done(err, {
        o: totalOccurrences,
        f: totalFilesMatched,
        s: files.length
      });
    }
  );
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
  utilities.readdir(dir, [ignoreFolders, ignoreFiles], function (err, files) {
    done(err, files);
  });
}

// -- C O M M A N D  E N T R Y  P O I N T

if (verbose) {
  utilities.performance.mark('fgrs-1');
}

findFiles(cwd, function (err, files) {
  let perf;
  if (err) {
    throw err;
  }
  utilities.performance.mark('fgrs-2');
  if (files.length > 0) {
    scanFiles(files, function (err, data) {
      let o, f;
      utilities.performance.mark('fgrs-3');

      if (err) {
        throw new Error(err);
      }

      if (verbose) {
        console.log('');
        if (debug) {
          console.log('\n[DEBUG] all files:');
          files.forEach(function (file) {
            console.log(file);
          });
          console.log('');
        }
        if (data) {
          o =
            data.o === 1 ? 'occurrence found    : ' : 'occurrences found   : ';
          f =
            data.f === 1 ? 'file matching       : ' : 'files matching      : ';
          console.log('  Total %s%d', o, data.o);
          console.log('  Total %s%d', f, data.f);
          console.log('  Total files scanned       :', files.length);
        }
        utilities.performance.measure('totalTime', 'fgrs-1', 'fgrs-3');
        perf = utilities.performance.getEntriesByName('totalTime');
        if (perf && perf[0].duration) {
          console.log(
            `  Elapsed time              : ${utilities.formatMillisecondsToHuman(
              perf[0].duration
            )}`
          );
        }
        if (debug) {
          utilities.performance.measure('findFiles', 'fgrs-1', 'fgrs-2');
          perf = utilities.performance.getEntriesByName('findFiles');
          if (perf && perf[0].duration) {
            console.log(
              `  Elapsed time in findFiles : ${utilities.formatMillisecondsToHuman(
                perf[0].duration
              )}`
            );
          }

          utilities.performance.measure('scanFiles', 'fgrs-2', 'fgrs-3');
          perf = utilities.performance.getEntriesByName('scanFiles');
          if (perf && perf[0].duration) {
            console.log(
              `  Elapsed time in scanFiles : ${utilities.formatMillisecondsToHuman(
                perf[0].duration
              )}`
            );
          }
        }
        console.log('');
      } else if (!boring && data.o) {
        console.log('');
      }
    });
  } else if (verbose) {
    console.log('');
    console.log('  Total occurrences found   : 0');
    console.log('  Total files matching      : 0');
    console.log('  Total files scanned       : 0');
    utilities.performance.measure('totalTime', 'fgrs-1', 'fgrs-2');
    perf = utilities.performance.getEntriesByName('totalTime');
    if (perf && perf[0].duration) {
      console.log(
        `  Elapsed time              : ${utilities.formatMillisecondsToHuman(
          perf[0].duration
        )}`
      );
    }
    console.log('');
  }
});
