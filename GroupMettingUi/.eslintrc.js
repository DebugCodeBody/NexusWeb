module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-empty-function": "warn",
    "vue/multi-word-component-names":"off",
    "no-async-promise-executor":"off",
    "vue/no-mutating-props":"off",
    "no-undef":"warn",
    "no-empty":"warn"
  },
};
