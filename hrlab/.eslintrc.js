module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/base"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  rules: {
    "no-console":
    /* I was having issues building with this enabled process.env.NODE_ENV === 'development' ? 'error' : */ "off",
    "no-debugger": process.env.NODE_ENV === "development" ? "error" : "off",
    semi: "off",
    quotes: "off",
    "space-before-function-paren": "off",
    "no-unused-vars": "off"
  }
};
