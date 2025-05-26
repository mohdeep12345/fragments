// eslint.config.mjs

import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // For all JS-like files, apply js plugin recommended rules & browser globals
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // For .js files specifically, set sourceType to commonjs
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },

  // Global environment globals for node and jest
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // React plugin recommended flat config
  pluginReact.configs.flat.recommended,
];
