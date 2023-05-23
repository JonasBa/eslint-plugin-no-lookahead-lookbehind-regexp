import { RuleTester } from "eslint";
import { noLookaheadLookbehindRegexp } from "./noLookaheadLookbehindRegex";

// const groups = [
//   { expression: "?=", type: "lookahead" },
//   { expression: "?!", type: "negative lookahead" },
//   { expression: "?<=", type: "lookbehind" },
//   { expression: "?<!", type: "negative lookbehind" },
// ];

// // dont flag string values when they are not used in combination with
// // RegExp and does not flag escaped sequences.
// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("false positives", noLookaheadLookbehindRegexp, {
//   valid: [
//     ...groups.map((g) => {
//       return {
//         code: `const str = "(${g.expression}foo)"`,
//         options: ["error", { browserslist: false }],
//       };
//     }),
//     ...groups.map((g) => {
//       return {
//         code: `/\\(${g})/g`,
//         options: ["error", { browserslist: false }],
//       };
//     }),
//   ],
//   invalid: [],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("flags regexp literal", noLookaheadLookbehindRegexp, {
//   valid: [],
//   invalid: [
//     ...groups.map((g) => ({
//       code: `const regexp = /(${g.expression})/;`,
//       options: ["error", { browserslist: false }],
//       errors: [
//         {
//           message: `Disallowed ${g.type} match group at position 0`,
//         },
//       ],
//     })),
//   ],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("flags regexp constructor", noLookaheadLookbehindRegexp, {
//   valid: [],
//   invalid: [
//     ...groups.map((g) => ({
//       code: `new RegExp("(${g.expression})")`,
//       options: ["error", { browserslist: false }],
//       errors: [
//         {
//           message: `Disallowed ${g.type} match group at position 1`,
//         },
//       ],
//     })),
//   ],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("flags regexp constructor literal", noLookaheadLookbehindRegexp, {
//   valid: [],
//   invalid: [
//     ...groups.map((g) => ({
//       code: `new RegExp(/(${g.expression})/);`,
//       options: ["error", { browserslist: false }],
//       errors: [
//         {
//           message: `Disallowed ${g.type} match group at position 1`,
//         },
//       ],
//     })),
//   ],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("flags component props", noLookaheadLookbehindRegexp, {
//   valid: [],
//   invalid: [
//     ...groups.map((g) => ({
//       code: `<Component prop={/(${g.expression})/}/>`,
//       options: ["error", { browserslist: false }],
//       errors: [
//         {
//           message: `Disallowed ${g.type} match group at position 0`,
//         },
//       ],
//     })),
//   ],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("does not flag if rule is disabled", noLookaheadLookbehindRegexp, {
//   valid: [{ code: `const regexp = /(?<=foo)/;`, options: ["error", "no-lookahead"] }],
//   invalid: [
//     {
//       code: `const regexp = /(?<=foo)/;`,
//       options: ["error", "no-lookbehind"],
//       errors: [{ message: `Disallowed lookbehind match group at position 0` }],
//     },
//   ],
// });

// new RuleTester({
//   parser: require.resolve("@typescript-eslint/parser"),
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
// }).run("flags when browser target does not support feature", noLookaheadLookbehindRegexp, {
//   valid: [
//     ...groups.map((g) => {
//       return {
//         code: `const regexp = /(${g.expression})/;`,
//         settings: { browsers: "Chrome 96, Firefox 96" },
//       };
//     }),
//   ],
//   invalid: [
//     {
//       code: `const regexp = /(?<=foo)/;`,
//       settings: {
//         browsers: ["Safari 15"],
//       },
//       errors: [{ message: `Safari 15: unsupported lookbehind match group at position 0` }],
//     },
//     {
//       code: `const regexp = /(?<=foo)/;`,
//       settings: {
//         browsers: ["Chrome 61"],
//       },
//       errors: [{ message: `Chrome 61: unsupported lookbehind match group at position 0` }],
//     },
//     {
//       code: `const regexp = /(?<=foo)/;`,
//       settings: {
//         browsers: ["ie 11, safari 13"],
//       },
//       errors: [
//         {
//           message: `Internet Explorer 11, Safari 13: unsupported lookbehind match group at position 0`,
//         },
//       ],
//     },
//   ],
// });

new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
}).run(
  "when browserslist is disabled and rule is enabled, errors are reported",
  noLookaheadLookbehindRegexp,
  {
    valid: [
      {
        code: `const regexp = /(?=)/;`,
        settings: { browsers: "Chrome 96, Firefox 96" },
      },
      {
        code: `const regexp = /(?!)/;`,
        settings: { browsers: "Chrome 96, Firefox 96" },
      },
      {
        code: `const regexp = /(?=)/;`,
        options: ["error", { browserslist: true }],
      },
      {
        code: `const regexp = /(?!)/;`,
        options: ["error", { browserslist: true }],
      },
    ],
    invalid: [
      {
        code: `const regexp = /(?=)/;`,
        options: ["error", "no-lookahead", { browserslist: false }],
        errors: [{ message: `Disallowed lookahead match group at position 0` }],
      },
      {
        code: `const regexp = /(?!)/;`,
        options: ["error", "no-negative-lookahead", { browserslist: false }],
        errors: [{ message: `Disallowed negative lookahead match group at position 0` }],
      },
    ],
  }
);
