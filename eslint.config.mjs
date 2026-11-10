import baseConfig from "./eslint.base.config.mjs";

const depConstraints = [
  {
    sourceTag: "type:app",
    onlyDependOnLibsWithTags: [
      "type:feature",
      "type:ui",
      "type:data-access",
      "type:util",
    ],
  },
  {
    sourceTag: "type:feature",
    onlyDependOnLibsWithTags: ["type:ui", "type:data-access", "type:util"],
  },
  {
    sourceTag: "type:feature",
    onlyDependOnLibsWithTags: ["scope:shared"],
  },
  {
    sourceTag: "type:ui",
    onlyDependOnLibsWithTags: ["type:util"],
  },
  {
    sourceTag: "type:data-access",
    onlyDependOnLibsWithTags: ["type:util"],
  },
  {
    sourceTag: "type:util",
    onlyDependOnLibsWithTags: ["type:util"],
  },
  {
    sourceTag: "scope:shared",
    onlyDependOnLibsWithTags: ["scope:shared"],
  },
  {
    sourceTag: "type:e2e",
    onlyDependOnLibsWithTags: [
      "type:feature",
      "type:ui",
      "type:data-access",
      "type:util",
    ],
  },
];

export default [
  ...baseConfig,
  {
    ignores: ["**/dist", "**/out-tsc"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: false,
          depConstraints: depConstraints,
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    // Override or add rules here
    rules: {},
  },
  {
    files: ["e2e/**/*.ts"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: false,
          depConstraints,
          checkDynamicDependenciesExceptions: [
            "@signal/planner",
            "@signal/performance",
            "@signal/marketing",
          ],
        },
      ],
    },
  },
];
