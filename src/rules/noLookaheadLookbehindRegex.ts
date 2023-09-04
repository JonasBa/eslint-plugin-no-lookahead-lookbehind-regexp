import { Rule } from "eslint";
import * as ESTree from "estree";

import {
  analyzeRegExpForLookaheadAndLookbehind,
  AnalyzeOptions,
  CheckableExpression,
} from "../helpers/analyzeRegExpForLookaheadAndLookbehind";
import {
  findBrowserTargets,
  findUnsupportedTargets,
  formatLinterMessage,
} from "../helpers/caniuse";
import { isStringLiteralRegExp, isRegExpLiteral } from "../helpers/ast";

export const DEFAULT_OPTIONS: AnalyzeOptions["rules"] = {
  "no-lookahead": 1,
  "no-lookbehind": 1,
  "no-negative-lookahead": 1,
  "no-negative-lookbehind": 1,
};

export const DEFAULT_CONF: AnalyzeOptions["config"] = {
  browserslist: true,
};

function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export const getExpressionsToCheckFromConfiguration = (
  options: Rule.RuleContext["options"]
): { rules: AnalyzeOptions["rules"]; config: AnalyzeOptions["config"] } => {
  if (!options.length) return { rules: DEFAULT_OPTIONS, config: DEFAULT_CONF };
  let rules: CheckableExpression[] = options;
  let config: AnalyzeOptions["config"] = {};

  if (isPlainObject(options[options.length - 1])) {
    rules = options.slice(0, -1);
    config = options[options.length - 1];
  }

  const validOptions: CheckableExpression[] = rules.filter((option: unknown) => {
    if (typeof option !== "string") return false;
    return DEFAULT_OPTIONS[option as keyof typeof DEFAULT_OPTIONS];
  });

  if (!validOptions.length) {
    return { rules: { ...DEFAULT_OPTIONS }, config };
  }

  const expressions = validOptions.reduce<AnalyzeOptions["rules"]>(
    (acc: AnalyzeOptions["rules"], opt) => {
      acc[opt as keyof typeof DEFAULT_OPTIONS] = 1;
      return acc;
    },
    {
      "no-lookahead": 0,
      "no-lookbehind": 0,
      "no-negative-lookahead": 0,
      "no-negative-lookbehind": 0,
    }
  );
  return {
    rules: expressions,
    config,
  };
};

const noLookaheadLookbehindRegexp: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        "disallow the use of lookahead and lookbehind regular expressions if unsupported by browser",
      category: "Compatibility",
      recommended: true,
    },
    type: "problem",
  },
  create(context: Rule.RuleContext) {
    console.log("create", context);
    const browsers = context.settings.browsers || context.settings.targets;
    const { targets, inferredBrowsersListConfig } = findBrowserTargets(
      context.getFilename(),
      browsers
    );

    // Lookahead assertions are part of JavaScript's original regular expression support and are thus supported in all browsers.
    const { rules, config } = getExpressionsToCheckFromConfiguration(context.options);
    const unsupportedTargets = findUnsupportedTargets("js-regexp-lookbehind", targets);

    // If no unsupported targets are found, but the user has provided a config, then there is nothing to do
    if (!unsupportedTargets.length && inferredBrowsersListConfig) return {};
    if (!unsupportedTargets.length && browsers) return {};

    if (config.browserslist === true) {
      rules["no-lookahead"] = 0;
      rules["no-negative-lookahead"] = 0;
    }

    return {
      Literal(node: ESTree.Literal & Rule.NodeParentExtension): void {
        if (isStringLiteralRegExp(node) && typeof node.raw === "string") {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
            node.raw,
            rules // For string literals, we need to pass the raw value which includes escape characters.
          );
          if (unsupportedGroups.length > 0) {
            context.report({
              node: node,
              message: formatLinterMessage(unsupportedGroups, targets, config),
            });
          }
        } else if (isRegExpLiteral(node)) {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
            node.regex.pattern,
            rules
          );

          if (unsupportedGroups.length > 0) {
            context.report({
              node: node,
              message: formatLinterMessage(unsupportedGroups, targets, config),
            });
          }
        }
      },
    };
  },
};

export { noLookaheadLookbehindRegexp };
