module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  globals: {
    $nuxt: false,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-promise-reject-errors': ['off'],
    'vue/max-attributes-per-line': ['error', { singleline: 2 }],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/no-use-v-if-with-v-for': ['off'],
    'vue/no-v-html': ['off'],
    'vue/component-name-in-template-casing': ['off'],
  }
}
