const waterfall = require("async/waterfall");
const path = require("path");
const fs = require("fs-extra");
const utilities = require("fedtools-utilities");
const backup = require("../../utilities/backup");
const common = require("../../common");
const DOT_HUSHLOGIN = path.join(process.env.HOME, ".hushlogin");

function setAutoLoad(options, callback) {
  function _writeDotProfile(file, choice, done) {
    const envdir = path.join(__dirname, "..", "..", "..", "shell");
    const lines = [common.ENVTOOLS.DOT_PROFILE_COMMENT];

    if (process.platform === "win32") {
      lines.push(`export ENVTOOLS_ENVDIR="${envdir}"`);
    }
    lines.push(`source "${path.join(envdir, 'load.sh"')}`);

    backup(file);
    fs.ensureFileSync(file);

    if (choice === common.ON) {
      utilities.appendLinesInFile(
        {
          lines,
          file
        },
        function(err) {
          done(err);
        }
      );
    } else {
      utilities.removeLinesInFile(
        {
          lines,
          file
        },
        function(err) {
          done(err);
        }
      );
    }
  }

  function _updateDotProfiles(choice, done) {
    waterfall(
      [
        function(fini) {
          _writeDotProfile(common.DOT_PROFILE, choice, fini);
        },
        function(fini) {
          _writeDotProfile(common.DOT_BASH_PROFILE, choice, fini);
        },
        function(fini) {
          _writeDotProfile(common.DOT_ZSH_PROFILE, choice, fini);
        },
        function(fini) {
          /*
           * also remove the useless "last login info" shown
           * at each session startup to speed things up.
           */
          fs.writeFile(DOT_HUSHLOGIN, "", function() {
            fini();
          });
        }
      ],
      function(err) {
        done(err, options);
      }
    );
  }

  // in auto mode, no setting env if it's already set!
  if (options.auto && process.env.ENVTOOLS_VERSION) {
    return callback(null, options);
  }

  _updateDotProfiles(
    options.toggleOptions[common.ENVTOOLS.CFG_AUTOLOAD],
    function() {
      callback(null, options);
    }
  );
}

// -- E X P O R T S
exports.setAutoLoad = setAutoLoad;
