/*eslint no-magic-numbers:0*/
module.exports = {
  rules: {
    // enforce consistent spacing inside array brackets
    'array-bracket-spacing': 'warn',
    // enforce consistent spacing inside single-line blocks
    'block-spacing': 'warn',
    // enforce consistent brace style for blocks
    'brace-style': ['error', '1tbs', {
      allowSingleLine: true
    }],
    // enforce camelcase naming convention
    'camelcase': 'error',
    // require or disallow trailing commas
    'comma-dangle': 'error',
    // enforce consistent spacing before and after commas
    'comma-spacing': 'warn',
    // enforce consistent comma style
    'comma-style': 'error',
    // enforce consistent spacing inside computed property brackets
    'computed-property-spacing': 'error',
    // enforce consistent naming when capturing the current execution context
    'consistent-this': 'off',
    // require or disallow newline at the end of files
    'eol-last': 'warn',
    // require or disallow spacing between function identifiers and
    // their invocations
    'func-call-spacing': 'warn',
    // require function names to match the name of the variable or
    // property to which they are assigned
    'func-name-matching': ['off', 'always', {
      includeCommonJSModuleExports: false
    }],
    // require or disallow named function expressions
    'func-names': 'off',
    // enforce the consistent use of either function declarations
    // or expressions
    'func-style': 'off',
    // disallow specified identifiers
    'id-blacklist': 'off',
    // enforce minimum and maximum identifier lengths
    'id-length': 'off',
    // require identifiers to match a specified regular expression
    'id-match': 'off',
    // enforce consistent indentation
    'indent': ['error', 2, {
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1
      },
      FunctionExpression: {
        parameters: 1,
        body: 1
      }
    }],
    // enforce the consistent use of either double or single
    // quotes in JSX attributes
    'jsx-quotes': 'off',
    // enforce consistent spacing between keys and values in
    // object literal properties
    'key-spacing': 'warn',
    // enforce consistent spacing before and after keywords
    'keyword-spacing': 'warn',
    // enforce position of line comments
    'line-comment-position': 'warn',
    // enforce consistent linebreak style
    'linebreak-style': 'off',
    // require empty lines around comments
    'lines-around-comment': 'off',
    // require or disallow newlines around directives
    'lines-around-directive': ['error', {
      before: 'always',
      after: 'always'
    }],
    // enforce a maximum depth that blocks can be nested
    'max-depth': 'warn',
    // enforce a maximum line length
    'max-len': 'off',
    // enforce a maximum number of lines per file
    'max-lines': 'off',
    // enforce a maximum depth that callbacks can be nested
    'max-nested-callbacks': 'error',
    // enforce a maximum number of parameters in function definitions
    'max-params': [
      'warn', {
        max: 5
      }
    ],
    // enforce a maximum number of statements allowed in function blocks
    'max-statements': 'off',
    // enforce a maximum number of statements allowed per line
    'max-statements-per-line': 'warn',
    // enforce newlines between operands of ternary expressions
    'multiline-ternary': 'off',
    // require constructor names to begin with a capital letter
    'new-cap': 'warn',
    // require parentheses when invoking a constructor with no arguments
    'new-parens': 'warn',
    // require or disallow an empty line after variable declarations
    'newline-after-var': 'off',
    // require an empty line before return statements
    'newline-before-return': 'off',
    // require a newline after each call in a method chain
    'newline-per-chained-call': ['error', {
      ignoreChainWithDepth: 4
    }],
    // disallow Array constructors
    'no-array-constructor': 'warn',
    // disallow bitwise operators
    'no-bitwise': 'warn',
    // disallow continue statements
    'no-continue': 'warn',
    // disallow inline comments after code
    'no-inline-comments': 'off',
    // disallow if statements as the only statement in else blocks
    'no-lonely-if': 'warn',
    // disallow mixed binary operators
    'no-mixed-operators': 'off',
    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 'error',
    // disallow multiple empty lines
    'no-multiple-empty-lines': [
      'warn', {
        max: 2,
        maxEOF: 1
      }
    ],
    // disallow negated conditions
    'no-negated-condition': 'off',
    // disallow nested ternary expressions
    'no-nested-ternary': 'warn',
    // disallow Object constructors
    'no-new-object': 'warn',
    // disallow the unary operators ++ and --
    'no-plusplus': 'off',
    // disallow specified syntax
    'no-restricted-syntax': 'off',
    // disallow tabs in file
    'no-tabs': 'error',
    // disallow ternary operators
    'no-ternary': 'off',
    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'warn',
    // disallow dangling underscores in identifiers
    'no-underscore-dangle': 'off',
    // disallow ternary operators when simpler alternatives exist
    'no-unneeded-ternary': 'warn',
    // disallow whitespace before properties
    'no-whitespace-before-property': 'error',
    'no-with': 'error',
    // enforce consistent line breaks inside braces
    'object-curly-newline': 'off',
    // enforce consistent spacing inside braces
    'object-curly-spacing': 'warn',
    // enforce placing object properties on separate lines
    'object-property-newline': 'warn',
    // enforce variables to be declared either together or
    // separately in functions
    'one-var': ['warn', {
      var: 'always',
      let: 'always',
      const: 'never'
    }],
    // require or disallow newlines around variable declarations
    'one-var-declaration-per-line': ['warn', 'initializations'],
    // require or disallow assignment operator shorthand where possible
    'operator-assignment': 'off',
    // enforce consistent linebreak style for operators
    'operator-linebreak': 'off',
    // require or disallow padding within blocks
    'padded-blocks': [
      'warn',
      'never'
    ],
    // require quotes around object literal property names
    'quote-props': [
      'warn',
      'consistent'
    ],
    // enforce the consistent use of either backticks, double,
    // or single quotes
    'quotes': ['warn', 'single', {
      allowTemplateLiterals: true
    }],
    // require JSDoc comments
    'require-jsdoc': 'off',
    // require or disallow semicolons instead of ASI
    'semi': [
      'error',
      'always', {
        omitLastInOneLineBlock: true
      }
    ],
    // enforce consistent spacing before and after semicolons
    'semi-spacing': 'warn',
    // require object keys to be sorted
    'sort-keys': 'off',
    // require variables within the same declaration block to be sorted
    'sort-vars': 'off',
    // enforce consistent spacing before blocks
    'space-before-blocks': 'warn',
    // enforce consistent spacing before function definition
    // opening parenthesis
    'space-before-function-paren': ['warn', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    // enforce consistent spacing inside parentheses
    'space-in-parens': 'warn',
    // require spacing around infix operators
    'space-infix-ops': 'warn',
    // enforce consistent spacing before or after unary operators
    'space-unary-ops': ['error', {
      words: true,
      nonwords: false,
      overrides: {}
    }],
    // enforce consistent spacing after the // or /* in a comment
    'spaced-comment': 'off',
    // require or disallow Unicode byte order mark (BOM)
    'unicode-bom': 'off',
    // require parenthesis around regex literals
    'wrap-regex': 'off'
  }
};
