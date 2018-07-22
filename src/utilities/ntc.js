/* eslint no-magic-numbers:0, radix: 0 */
/*
+-----------------------------------------------------------------+
|     Created by Chirag Mehta - http://chir.ag/projects/ntc       |
|-----------------------------------------------------------------|
|               ntc js (Name that Color JavaScript)               |
+-----------------------------------------------------------------+

All the functions, code, lists etc. have been written specifically
for the Name that Color JavaScript by Chirag Mehta unless otherwise
specified.

This script is released under the: Creative Commons License:
Attribution 2.5 http://creativecommons.org/licenses/by/2.5/

Sample Usage:

  <script type="text/javascript" src="ntc.js"></script>

  <script type="text/javascript">

    var n_match  = ntc.name("#6195ED");
    n_rgb        = n_match[0]; // This is the RGB value of the closest matching color
    n_name       = n_match[1]; // This is the text string for the name of the match
    n_exactmatch = n_match[2]; // True if exact color match, False if close-match

    alert(n_match);

  </script>

*/

const ntc = {
  init() {
    let color, rgb, hsl;
    for (let i = 0; i < ntc.names.length; i++) {
      color = `#${ntc.names[i][0].toUpperCase()}`;
      rgb = ntc.rgb(color);
      hsl = ntc.hsl(color);
      ntc.names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
    }
  },

  name(color) {
    if (color.length < 3 || color.length > 7) {
      return ['#000000', `Invalid Color: ${color}`, false];
    }
    if (color.length % 3 === 0) {
      color = `#${color}`;
    }
    if (color.length === 4) {
      color = `#${color.substr(1, 1)}${color.substr(1, 1)}${color.substr(
        2,
        1
      )}${color.substr(2, 1)}${color.substr(3, 1)}${color.substr(3, 1)}`;
    }

    const rgb = ntc.rgb(color);
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const hsl = ntc.hsl(color);
    const h = hsl[0];
    const s = hsl[1];
    const l = hsl[2];
    let ndf1 = 0,
      ndf2 = 0,
      ndf = 0,
      cl = -1,
      df = -1;

    for (let i = 0; i < ntc.names.length; i++) {
      if (color === `#${ntc.names[i][0]}`) {
        return [`#${ntc.names[i][0]}`, ntc.names[i][1], true];
      }

      ndf1 =
        Math.pow(r - ntc.names[i][2], 2) +
        Math.pow(g - ntc.names[i][3], 2) +
        Math.pow(b - ntc.names[i][4], 2);
      ndf2 =
        Math.pow(h - ntc.names[i][5], 2) +
        Math.pow(s - ntc.names[i][6], 2) +
        Math.pow(l - ntc.names[i][7], 2);

      ndf = ndf1 + ndf2 * 2;
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = i;
      }
    }

    return cl < 0
      ? ['#000000', `Invalid Color: ${color}`, false]
      : [`#${ntc.names[cl][0]}`, ntc.names[cl][1], false];
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  hsl(color) {
    const rgb = [
      parseInt(`0x${color.substring(1, 3)}`) / 255,
      parseInt(`0x${color.substring(3, 5)}`) / 255,
      parseInt(`0x${color.substring(5, 7)}`) / 255
    ];
    let h, s;
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    const min = Math.min(r, Math.min(g, b));
    const max = Math.max(r, Math.max(g, b));
    const delta = max - min;
    const l = (min + max) / 2;

    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
    }

    h = 0;
    if (delta > 0) {
      if (max === r && max !== g) {
        h += (g - b) / delta;
      }
      if (max === g && max !== b) {
        h += 2 + (b - r) / delta;
      }
      if (max === b && max !== r) {
        h += 4 + (r - g) / delta;
      }
      h /= 6;
    }
    return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  rgb(color) {
    return [
      parseInt(`0x${color.substring(1, 3)}`),
      parseInt(`0x${color.substring(3, 5)}`),
      parseInt(`0x${color.substring(5, 7)}`)
    ];
  },

  names: [
    // CSS Level 1
    ['000000', 'Black'],
    ['c0c0c0', 'Silver'],
    ['808080', 'Gray'],
    ['ffffff', 'White'],
    ['800000', 'Maroon'],
    ['ff0000', 'Red'],
    ['800080', 'Purple'],
    ['ff00ff', 'Fuchsia'],
    ['008000', 'Green'],
    ['00ff00', 'Lime'],
    ['808000', 'Olive'],
    ['ffff00', 'Yellow'],
    ['000080', 'Navy'],
    ['0000ff', 'Blue'],
    ['008080', 'Teal'],
    ['00ffff', 'Aqua'],
    // CSS Level 2 (revision 1)
    ['ffa500', 'Orange'],
    // CSS Level 3
    ['f0f8ff', 'AliceBlue'],
    ['faebd7', 'AntiqueWhite'],
    ['7fffd4', 'AquaMarine'],
    ['f0ffff', 'Azure'],
    ['f5f5dc', 'Beige'],
    ['ffe4c4', 'Bisque'],
    ['ffebcd', 'BlanchedAlmond'],
    ['8a2be2', 'BlueViolet'],
    ['a52a2a', 'Brown'],
    ['deb887', 'BurlyWood'],
    ['5f9ea0', 'CadetBlue'],
    ['7fff00', 'Chartreuse'],
    ['d2691e', 'Chocolate'],
    ['ff7f50', 'Coral'],
    ['6495ed', 'CornflowerBlue'],
    ['fff8dc', 'Cornsilk'],
    ['dc143c', 'Crimson'],
    ['00ffff', 'Cyan'],
    ['00008b', 'Darkblue'],
    ['008b8b', 'DarkCyan'],
    ['b8860b', 'DarkGoldenRod'],
    ['a9a9a9', 'DarkGray'],
    ['006400', 'DarkGreen'],
    ['a9a9a9', 'DarkGrey'],
    ['bdb76b', 'DarkKhaki'],
    ['8b008b', 'DarkMagenta'],
    ['556b2f', 'DarkOliveGreen'],
    ['ff8c00', 'DarkOrange'],
    ['9932cc', 'DarkOrchid'],
    ['8b0000', 'DarkRed'],
    ['e9967a', 'DarkSalmon'],
    ['8fbc8f', 'DarkSeaGreen'],
    ['483d8b', 'DarkSlateBlue'],
    ['2f4f4f', 'DarkSlateGrey'],
    ['00ced1', 'DarkTurquoise'],
    ['9400d3', 'DarkViolet'],
    ['ff1493', 'DeepPink'],
    ['00bfff', 'DeepSkyBlue'],
    ['696969', 'DimGrey'],
    ['1e90ff', 'DodgerBlue'],
    ['b22222', 'FireBrick'],
    ['fffaf0', 'FloralWhite'],
    ['228b22', 'ForestGreen'],
    ['dcdcdc', 'Gainsboro'],
    ['f8f8ff', 'GhostWhite'],
    ['ffd700', 'Gold'],
    ['daa520', 'GoldenRod'],
    ['adff2f', 'GreenYellow'],
    ['808080', 'Grey'],
    ['f0fff0', 'Honeydew'],
    ['ff69b4', 'HotPink'],
    ['cd5c5c', 'IndianRed'],
    ['4b0082', 'Indigo'],
    ['fffff0', 'Ivory'],
    ['f0e68c', 'Khaki'],
    ['e6e6fa', 'Lavender'],
    ['fff0f5', ':avenderBlush'],
    ['7cfc00', 'LawnGreen'],
    ['fffacd', 'LemonChiffon'],
    ['add8e6', 'LightBlue'],
    ['f08080', 'LightCoral'],
    ['e0ffff', 'LightCyan'],
    ['fafad2', 'LightGoldenRodYellow'],
    ['90ee90', 'LightGreen'],
    ['d3d3d3', 'LightGrey'],
    ['ffb6c1', 'LightPink'],
    ['ffa07a', 'LightSalmon'],
    ['20b2aa', 'LightSeaGreen'],
    ['87cefa', 'LightSkyBlue'],
    ['778899', 'LightSlateGrey'],
    ['b0c4de', 'LightSteelBlue'],
    ['ffffe0', 'LightYellow'],
    ['32cd32', 'LimeGreen'],
    ['faf0e6', 'Linen'],
    ['ff00ff', 'Magenta'],
    ['66cdaa', 'MediumAquaMarine'],
    ['0000cd', 'MediumBlue'],
    ['ba55d3', 'MediumOrchid'],
    ['9370db', 'MediumPurple'],
    ['3cb371', 'MediumSeaGreen'],
    ['7b68ee', 'MediumSlateBlue'],
    ['00fa9a', 'MediumSpringGreen'],
    ['48d1cc', 'MediumTurquoise'],
    ['c71585', 'MediumVioletRed'],
    ['191970', 'MidnightBlue'],
    ['f5fffa', 'MintCream'],
    ['ffe4e1', 'MistyRose'],
    ['ffe4b5', 'Moccasin'],
    ['ffdead', 'NavajoWhite'],
    ['fdf5e6', 'OldLace'],
    ['6b8e23', 'OliveDrab'],
    ['ff4500', 'OrangeRed'],
    ['da70d6', 'Orchid'],
    ['eee8aa', 'PaleGoldenRod'],
    ['98fb98', 'PaleGreen'],
    ['afeeee', 'PaleTurquoise'],
    ['db7093', 'PaleVioletRed'],
    ['ffefd5', 'PapayaWhip'],
    ['ffdab9', 'PeachPuff'],
    ['cd853f', 'Peru'],
    ['ffc0cb', 'Pink'],
    ['dda0dd', 'Plum'],
    ['b0e0e6', 'PowderBlue'],
    ['bc8f8f', 'RosyBrown'],
    ['4169e1', 'RoyalBlue'],
    ['8b4513', 'SaddleBrown'],
    ['fa8072', 'Salmon'],
    ['f4a460', 'SandyBrown'],
    ['2e8b57', 'SeaGreen'],
    ['fff5ee', 'SeaShell'],
    ['a0522d', 'Sienna'],
    ['87ceeb', 'SkyBlue'],
    ['6a5acd', 'SlateBlue'],
    ['708090', 'SlateGrey'],
    ['fffafa', 'Snow'],
    ['00ff7f', 'SpringGreen'],
    ['4682b4', 'SteelBlue'],
    ['d2b48c', 'Tan'],
    ['d8bfd8', 'Thistle'],
    ['ff6347', 'Tomato'],
    ['40e0d0', 'Turquoise'],
    ['ee82ee', 'Violet'],
    ['f5deb3', 'Wheat'],
    ['f5f5f5', 'WhiteSmoke'],
    ['9acd32', 'YellowGreen'],
    // CSS Level 4
    ['663399', 'RebeccaPurple']
  ]
};

ntc.init();

module.exports = ntc;
