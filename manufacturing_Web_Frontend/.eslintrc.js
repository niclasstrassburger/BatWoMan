const { configs } = require("@eslint/js");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  rules: {
    ...configs.recommended.rules,
    "no-unused-vars": "warn",
    "vue/multi-word-component-names": "warn",
    'valid-v-slot': "ignore",
  }
}
