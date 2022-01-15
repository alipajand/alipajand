module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['plugin:nuxt/recommended', 'plugin:prettier/recommended'],
  plugins: [],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    camelcase: 'off',
    indent: 0,
    'vue/valid-v-slot': 0,
    'no-useless-escape': 0,
    'no-globals-in-created': 0,
    'no-prototype-builtins': 0,
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'unicorn/number-literal-case': 0,
    'vue/max-attributes-per-line': 0,
    'no-template-curly-in-string': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0,
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never']
  }
};
