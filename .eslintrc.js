module.exports = {
  env: {
    node: true,
    jest: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["plugin:eslint-plugin/recommended", "plugin:prettier/recommended"],
  parserOptions: {
    project: "./tsconfig.json",
  },
};
