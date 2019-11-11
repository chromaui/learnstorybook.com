const prettierConfig = require('./.prettierrc');

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  env: {
    browser: true,
    'jest/globals': true,
  },
  globals: {
    graphql: 'readonly',
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.js'],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['GatsbyLink'],
        specialLink: ['to'],
      },
    ],
    'prettier/prettier': ['warn', prettierConfig],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-wrap-multilines': [
      'error',
      {
        arrow: false,
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-one-expression-per-line': 0
  },
};
