/* eslint no-magic-numbers: 0 */
module.exports = {
  rules: {
    // enforce getter and setter pairs in objects
    'accessor-pairs': 'off',
    // enforce return statements in callbacks of array methods
    'array-callback-return': 'error',
    // enforce the use of variables within the scope they are defined
    'block-scoped-var': 'error',
    // enforce that class methods utilize this
    'class-methods-use-this': 'off',
    // enforce a maximum cyclomatic complexity allowed in a program
    'complexity': ['error', 20],
    // require return statements to either always or never specify values
    'consistent-return': 'off',
    // enforce consistent brace style for all control statements
    'curly': [
      'error',
      'all'
    ],
    // require default cases in switch statements
    'default-case': 'error',
    // enforce consistent newlines before and after dots
    'dot-location': ['error', 'property'],
    // enforce dot notation whenever possible
    'dot-notation': [
      'error', {
        allowKeywords: true
      }
    ],
    // require the use of === and !==
    'eqeqeq': [
      'error',
      'smart'
    ],
    // require for-in loops to include an if statement
    'guard-for-in': 'error',
    // disallow the use of alert, confirm, and prompt
    'no-alert': 'error',
    // disallow the use of arguments.caller or arguments.callee
    'no-caller': 'error',
    // disallow lexical declarations in case clauses
    'no-case-declarations': 'error',
    // disallow division operators explicitly at the beginning of regular expressions
    'no-div-regex': 'error',
    // disallow else blocks after return statements in if statements
    'no-else-return': 'off',
    // disallow empty functions
    'no-empty-function': ['error', {
      allow: [
        'arrowFunctions',
        'functions',
        'methods'
      ]
    }],
    // disallow empty destructuring patterns
    'no-empty-pattern': 'error',
    // disallow null comparisons without type-checking operators
    'no-eq-null': 'error',
    // disallow the use of eval()
    'no-eval': 'error',
    // disallow extending native types
    'no-extend-native': 'error',
    // disallow unnecessary calls to .bind()
    'no-extra-bind': 'error',
    // disallow unnecessary labels
    'no-extra-label': 'error',
    // disallow fallthrough of case statements
    'no-fallthrough': 'error',
    // disallow leading or trailing decimal points in numeric literals
    'no-floating-decimal': 'error',
    // disallow assignments to native objects or read-only global variables
    'no-global-assign': 'error',
    // disallow shorthand type conversions
    'no-implicit-coercion': 'warn',
    // disallow variable and function declarations in the global scope
    'no-implicit-globals': 'off',
    // disallow the use of eval()-like methods
    'no-implied-eval': 'error',
    // disallow this keywords outside of classes or class-like objects
    'no-invalid-this': 'off',
    // disallow the use of the __iterator__ property
    'no-iterator': 'error',
    // disallow labeled statements
    'no-labels': 'error',
    // disallow unnecessary nested blocks
    'no-lone-blocks': 'warn',
    // disallow function declarations and expressions inside loop statements
    'no-loop-func': 'warn',
    // disallow magic numbers
    'no-magic-numbers': [
      'warn', {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true
      }
    ],
    // disallow multiple spaces
    'no-multi-spaces': 'warn',
    // disallow multiline strings
    'no-multi-str': 'warn',
    // disallow new operators with the Function object
    'no-new-func': 'error',
    // disallow new operators with the String, Number, and Boolean objects
    'no-new-wrappers': 'error',
    // disallow new operators outside of assignments or comparisons
    'no-new': 'error',
    'no-obj-calls': 'error',
    // disallow octal escape sequences in string literals
    'no-octal-escape': 'error',
    // disallow octal literals
    'no-octal': 'error',
    // disallow reassigning function parameters
    'no-param-reassign': 'off',
    // disallow the use of the __proto__ property
    'no-proto': 'error',
    // disallow variable redeclaration
    'no-redeclare': 'error',
    // disallow certain properties on certain objects
    'no-restricted-properties': 'off',
    // disallow assignment operators in return statements
    'no-return-assign': 'error',
    // disallow javascript: urls
    'no-script-url': 'error',
    // disallow assignments where both sides are exactly the same
    'no-self-assign': 'error',
    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'error',
    // disallow comma operators
    'no-sequences': 'error',
    // disallow throwing literals as exceptions
    'no-throw-literal': 'off',
    // disallow unmodified loop conditions
    'no-unmodified-loop-condition': 'error',
    // disallow unused expressions
    'no-unused-expressions': 'off',
    // disallow unused labels
    'no-unused-labels': 'error',
    // disallow unnecessary calls to .call() and .apply()
    'no-useless-call': 'error',
    // Disallow unnecessary concatenation of strings
    'no-useless-concat': 'error',
    // disallow unnecessary escape characters
    'no-useless-escape': 'warn',
    // disallow redundant return statements
    'no-useless-return': 'error',
    // disallow void operators
    'no-void': 'error',
    // disallow specified warning terms in comments
    'no-warning-comments': 'warn',
    // disallow with statements
    'no-with': 'error',
    // enforce the consistent use of the radix argument when using parseInt()
    'radix': 'warn',
    // require var declarations be placed at the top of their containing scope
    'vars-on-top': 'warn',
    // require parentheses around immediate function invocations
    'wrap-iife': [
      'error',
      'any'
    ],
    // require or disallow “Yoda” conditions
    'yoda': 'error'
  }
};
