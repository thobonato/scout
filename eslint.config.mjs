import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Always use braces — no single-line if/return statements
      curly: ["error", "all"],

      // Prefer const over let when variable is never reassigned
      "prefer-const": "error",

      // No var declarations
      "no-var": "error",

      // Always use === instead of ==
      eqeqeq: ["error", "always"],

      // Warn on console.log (console.warn and console.error are fine)
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // No unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // No explicit any
      "@typescript-eslint/no-explicit-any": "error",

      // No else after a return — pairs with early returns style
      "no-else-return": "error",

      // No nested ternaries (a ? b : c ? d : e)
      "no-nested-ternary": "error",

      // Template literals over string concatenation
      "prefer-template": "error",

      // Object shorthand: { name } over { name: name }
      "object-shorthand": "error",

      // Enforce import type for type-only imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Self-closing JSX tags when there are no children
      "react/self-closing-comp": "error",

      // No circular imports
      "import/no-cycle": "error",
    },
  },
]);

export default eslintConfig;
