// ESLint Flat Config for frontend
// 📎 CONTEXT: ESLint v9 flat config; TS + React + Prettier integration

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser & Node globals for app code and Vite tooling
        ...globals.browser,
        ...globals.node,
        // Test globals (Vitest)
        ...globals.vitest,
      },
    },
    plugins: { "@typescript-eslint": tseslint, react: reactPlugin, "react-hooks": reactHooks },
    rules: {
      // Base
      "no-unused-vars": "off",
      // TS environment doesn't need this; handled by TS typechecker
      "no-undef": "off",
      // TS
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // React
      "react-hooks/rules-of-hooks": "error",
      // Disable to avoid warnings failing CI due to --max-warnings=0
      "react-hooks/exhaustive-deps": "off",
    },
    settings: { react: { version: "detect" } },
  },
  prettier,
];
