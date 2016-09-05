module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  plugins: [
    'react',
    'jsx-a11y',
    'import',
  ],
  rules: {
    strict: 0,
    'func-names': 0,
    'space-before-function-paren': 0,
  },
};