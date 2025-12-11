module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".mjs"],
      },
    },
  },
};
