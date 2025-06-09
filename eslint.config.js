import pkg from "@eslint/js";
const { eslintRecommended } = pkg;

export default [
  {
    files: ["src/**/*.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },
    rules: {
      // You can add rules here
      semi: ["error", "always"],
    },
  },
];
