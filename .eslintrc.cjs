module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "simple-import-sort", "prettier"],
  rules: {
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["react"],
          ["@douyinfe(.*)$"],
          ["(@)?think(.*)$"],
          ["(@)?tiptap(.*)$"],
          ["^@?\\w"],
          ["@/(.*)"],
          ["^[./]"],
          ["(.*).module.scss"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
  },
};
