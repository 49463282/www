module.exports = {
  env: {
    jest: true,
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'prefer-const': 'off',
    'no-unused-vars': 'off',
    quotes: 'off'
  }
}
