// ESLint Flat Config for backend
// 📎 CONTEXT: ESLint v9 flat config; TS + Node + Prettier

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // Global ignores (apply to all configs)
  { ignores: ["node_modules", "dist"] },

  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest, // for tests
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      // Base
      "no-unused-vars": "off",
      // TS handles undef via types and env globals
      "no-undef": "off",
      // TS
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  prettier,
];
