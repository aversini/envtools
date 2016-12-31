module.exports = {
  globals: {
    React: false,
    ReactDOM: false
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react'
  ],
  rules: {
    // enforce consistent spacing inside braces
    'object-curly-spacing': 'off',
    // require or disallow semicolons instead of ASI
    'semi': 'off',

    // specific react rules
    'react/display-name': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-unknown-property': 'error',
    'react/no-render-return-value': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'error'
  }
};
