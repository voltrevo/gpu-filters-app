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
    'no-mixed-operators': 0,
    'vars-on-top': 0,
    'object-curly-spacing': 0,
    'new-cap': 0,
  },
};