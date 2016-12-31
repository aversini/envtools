module.exports = {
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    // enforces no braces where they can be omitted
    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: false
    }],
    // require parens in arrow function arguments
    'arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: true
    }],
    // require space before/after arrow function's arrow
    'arrow-spacing': 'warn',
    // verify super() callings in constructors
    'constructor-super': 'error',
    // enforce the spacing around the * in generator functions
    'generator-star-spacing': ['error', {
      before: false,
      after: true
    }],
    // disallow modifying variables of class declarations
    'no-class-assign': 'error',
    // disallow arrow functions where they could be confused with comparisons
    'no-confusing-arrow': ['error', {
      allowParens: true
    }],
    // disallow modifying variables that are declared using const
    'no-const-assign': 'error',
    // disallow duplicate class members
    'no-dupe-class-members': 'error',
    // disallow importing from the same path more than once
    'no-duplicate-imports': 'warn',
    // disallow symbol constructor
    'no-new-symbol': 'error',
    // disallow specific imports
    'no-restricted-imports': 'off',
    // disallow template literal placeholder syntax in regular strings
    'no-template-curly-in-string': 'error',
    // disallow to use this/super before super() calling in constructors.
    'no-this-before-super': 'error',
    // disallow useless computed property keys
    'no-useless-computed-key': 'off',
    // disallow unnecessary constructor
    'no-useless-constructor': 'error',
    // disallow renaming import, export, and destructured assignments
    // to the same name
    'no-useless-rename': 'off',
    // require let or const instead of var
    'no-var': 'warn',
    // require method and property shorthand syntax for object literals
    'object-shorthand': 'warn',
    // suggest using arrow functions as callbacks
    'prefer-arrow-callback': 'off',
    // suggest using of const for variables that are never modified
    // after declared
    'prefer-const': 'warn',
    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    'prefer-numeric-literals': 'warn',
    // use rest parameters instead of arguments
    'prefer-rest-params': 'warn',
    // suggest using the spread operator instead of .apply()
    'prefer-spread': 'warn',
    // suggest using template literals instead of string concatenation
    'prefer-template': 'warn',
    // disallow generator functions that do not have yield
    'require-yield': 'error',
    // enforce spacing between object rest-spread
    'rest-spread-spacing': 'error',
    // import sorting
    'sort-imports': 'off',
    // require a Symbol description
    'symbol-description': 'off',
    // enforce usage of spacing in template strings
    'template-curly-spacing': 'error',
    // enforce spacing around the * in yield* expressions
    'yield-star-spacing': 'off'
  }
};
