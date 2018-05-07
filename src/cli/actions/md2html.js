const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const log = require('fedtools-logs');
const common = require('../../common');

module.exports = function (self, program) {
  let file = _.isString(program.f) ? program.f : null;

  function _usage() {
    const msg = [];
    log.echo();
    msg.push('');
    msg.push(log.strToColor('yellow', 'Description:'));
    msg.push('Envtools md2html is a simple command line tool that');
    msg.push('allows you to convert a Markdown file to HTML.');
    msg.push('The resulting HTML is printed on the terminal screen.');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Usage:'));
    msg.push('envtools md2html [-f input]');
    msg.push('');
    msg.push(log.strToColor('yellow', 'Examples:'));
    msg.push('$ envtools md2html -f file.md');
    msg.push('$ envtools md2html -f file.md > file.html');
    msg.push('');
    log.printMessagesInBox(msg, common.LOG_COLORS.DEFAULT_BOX);
    log.echo();
    process.exit(1);
  }

  if (!file || !fs.existsSync(file)) {
    _usage('Invalid argument, file is missing (-f)');
  } else {
    file = path.resolve(file);
  }

  unified()
    .use(markdown)
    .use(html)
    .process(fs.readFileSync(file), function (err, data) {
      if (err) {
        throw err;
      }
      log.echo(String(data));
    });
};
