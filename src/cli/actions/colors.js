/* eslint no-magic-numbers:0, radix: 0 */

const _ = require('lodash');
const chalk = require('chalk');
const color = require('onecolor');
const log = require('fedtools-logs');
const ntc = require('../../utilities/ntc');

module.exports = function (self, program) {
  let colorObj,
    colorArg = String(program._[1])
      .toUpperCase()
      .trim();

  if (colorArg.startsWith('#')) {
    colorArg = colorArg.replace('#', '');
    if (colorArg.length === 1) {
      colorArg = `${colorArg.repeat(6)}`;
    }
  }

  try {
    colorObj = {
      hexa: color(colorArg).hex()
    };
  } catch (e) {
    log.echo();
    log.error('Invalid color:', program._[1]);
    return;
  }

  ntc.init();
  const [hexa, name, exact] = ntc.name(colorObj.hexa);
  const rgb = `rgba(${ntc.rgb(hexa).join(', ')}, 1)`;
  const intro = `Color data for ${chalk.cyan(colorObj.hexa)}`;
  const extra = exact ? '(exact match)' : chalk.yellow('(closest match)');
  const CSSVariable = `--color-${_.kebabCase(name)}`;

  log.echo();
  log.rainbow(`${intro} ${extra}:`);
  log.echo();

  log.rainbow(`Color name      : ${chalk.cyan(name)}`);
  log.rainbow(`Color hexa code : ${chalk.cyan(hexa)}`);
  log.rainbow(`Color rgba code : ${chalk.cyan(rgb)}`);
  log.rainbow(
    `CSS variable    : ${chalk.cyan(CSSVariable)}: ${chalk.cyan(
      hexa.toLowerCase()
    )};`
  );
};
