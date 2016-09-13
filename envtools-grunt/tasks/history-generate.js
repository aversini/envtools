var
  _ = require('lodash'),
  g = require('../globals'),
  moment = require('moment'),
  utilities = require('fedtools-utilities');

function _getHistoryCard(target, options, done) {
  utilities.getHistoryCard({
    sha: options.sha,
    timestamp: options.timestamp,
    merge: options.merge,
    cwd: target,
    ignore: [
      g.PUBLISH_COMMIT_MSG,
      g.UPDATING_HISTORY_COMMIT_MSG,
      g.PUBLISH_COMMIT_MSG,
      g.UPDATING_HISTORY_COMMIT_MSG,
      g.WIP_COMMIT_MSG,
      g.MERGE1_COMMIT_MSG,
      g.MERGE2_COMMIT_MSG
    ]
  }, function (err, res) {
    var
      output = '',
      buff,
      tpl = _.template('<%=title%> <%=sha%>'),

      SHORT_SHA = 7,
      SHA_SEP = (options.raw) ? ['', ''] : ['(', ')'],
      SHORTSHA_SEP = ['(', ')'],
      LONGSHA_SEP = ['', ''],
      TIMESTAMP_SEP = (options.raw) ? ['[', ']'] : ['__', '__'];

    if (!options.raw && options.sha && options.gitUrl) {
      SHORTSHA_SEP = ['[', ']'];
      LONGSHA_SEP = ['(' + options.gitUrl, ')'];
    }

    if (!err) {
      _.each(res, function (item) {
        if (item.tag && item.logs && item.logs.length && item.tagTitle !== 'HEAD') {
          output += '\n';
          if (item.logs && item.logs[0] && item.logs[0].timestamp) {
            output += TIMESTAMP_SEP[0] + item.tagTitle + ' / ' + moment
              .unix(item.logs[0].timestamp)
              .format('YYYY-MM-DD') + TIMESTAMP_SEP[1];
          } else {
            output += item.tagTitle;
          }
          output += '\n\n';
          _.each(item.logs, function (commit) {
            var sha = null;

            if (commit.author === 'unknown') {
              commit.author = 'Anonymous';
            }

            if (options.sha && commit.sha !== '') {
              if (options.gitUrl) {
                sha = SHA_SEP[0] + SHORTSHA_SEP[0] + commit.sha.slice(0, SHORT_SHA) +
                  SHORTSHA_SEP[1] + LONGSHA_SEP[0] + commit.sha + LONGSHA_SEP[1] + SHA_SEP[1];
              } else {
                sha = SHORTSHA_SEP[0] + commit.sha.slice(0, SHORT_SHA) +
                  SHORTSHA_SEP[1];
              }
            }
            buff = tpl({
              timestamp: (commit.timestamp !== '') ? TIMESTAMP_SEP[0] + moment.unix(commit.timestamp).format('YYYY-MM-DD') + TIMESTAMP_SEP[1] : null,
              // author: AUTHOR_SEP[0] + commit.author + AUTHOR_SEP[1],
              sha: sha,
              title: commit.title
            });

            if (options.raw) {
              output += buff + '\n';
            } else {
              output += '- ' + buff + '\n';
            }

            if (commit.body) {
              output += '  ' + commit.body.replace(/\n/g, '\n  ') + '\n';
            }
          });
        }
      });
    }
    done(err, output);
  });
}


module.exports = function (grunt) {
  grunt.registerTask('history-generate', 'Generating fistory files', function () {
    var
      noWrite = grunt.option('no-write') || false,
      done = this.async();

    if (noWrite) {
      grunt.log.writeln('history-generate dry run');
    }

    _getHistoryCard('.', {
      merge: false,
      gitUrl: 'https://github.com/aversini/envtools/commit/',
      raw: false, // we need markdown
      sha: true,
      timestamp: true
    }, function (err, log) {
      if (!err) {
        if (!noWrite) {
          grunt.file.write(g.historyFile, log);
        } else {
          grunt.log.ok('history-generate: fedtools-utilities.git.getHistoryCard');
        }
      }
      done(err);
    });
  });
};
