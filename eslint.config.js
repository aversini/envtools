module.exports = {
  extends: [
    "versini",
    "versini/rules/react/off",
    "versini/rules/react-a11y/off",
    "prettier"
  ],
  plugins: ["import"],
  rules: {
    "import/no-commonjs": ["error"],
    "max-len": [
      "error",
      {
        code: 80,
        tabWidth: 2,
        comments: 110,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ]
  },
  overrides: [
    {
      files: ["*.test.*"],
      rules: {
        "no-console": "off",
        "no-magic-numbers": "off",
        "react/no-multi-comp": "off",
        "react/prop-types": "off"
      }
    }
  ]
};
