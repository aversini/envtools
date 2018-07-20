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
      hexa: color(colorArg).hex(),
      rgba: color(colorArg).cssa()
    };
  } catch (e) {
    log.echo();
    log.error('Invalid color:', program._[1]);
    return;
  }

  const colorData = ntc.name(colorObj.hexa);
  const colorName = colorData[1];
  const colorSASSName = `$color-${_.kebabCase(colorName)}`;
  const colorPrecision = colorData[2] ? 'Exact' : 'Approximate';

  log.echo();
  log.rainbow(`Color name       : ${chalk.cyan(colorName)}`);
  log.rainbow(`Color hexa code  : ${chalk.cyan(colorObj.hexa)}`);
  log.rainbow(`Color RGBA code  : ${chalk.cyan(colorObj.rgba)}`);
  log.rainbow(`SASS definition  : ${chalk.cyan(colorSASSName)}: ${chalk.cyan(colorObj.hexa)};`);
  log.rainbow(`Color precision  : ${chalk.cyan(colorPrecision)}`);
};
