module.exports = {
  plugins: ["jest"],
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  },
  settings: {
    jest: {
      version: require("jest/package.json").version,
    },
  },
};
