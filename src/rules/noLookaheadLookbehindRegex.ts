import { Rule } from "eslint";
import * as ESTree from "estree";

import {
  analyzeRegExpForLookaheadAndLookbehind,
  AnalyzeOptions,
  CheckableExpression,
} from "../helpers/analyzeRegExpForLookaheadAndLookbehind";
import { collectBrowserTargets, collectUnsupportedTargets } from "../helpers/caniuse";
import { isStringLiteralRegExp, isRegExpLiteral } from "../helpers/ast";
import { createContextReport } from "../helpers/createReport";

export const DEFAULT_OPTIONS: AnalyzeOptions["rules"] = {
  "no-lookahead": 1,
  "no-lookbehind": 1,
  "no-negative-lookahead": 1,
  "no-negative-lookbehind": 1,
};

export const DEFAULT_CONF: AnalyzeOptions["conf"] = {
  browserslist: true,
};

function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export const getExpressionsToCheckFromConfiguration = (
  options: Rule.RuleContext["options"]
): { rules: AnalyzeOptions["rules"]; conf: AnalyzeOptions["conf"] } => {
  if (!options.length) return { rules: DEFAULT_OPTIONS, conf: DEFAULT_CONF };
  let rules: CheckableExpression[] = options;
  let conf: AnalyzeOptions["conf"] = {};
  if (isPlainObject(options[options.length - 1])) {
    rules = options.slice(0, -1);
    conf = options[options.length - 1];
  }

  const validOptions: CheckableExpression[] = rules.filter((option: unknown) => {
    if (typeof option !== "string") return false;
    return DEFAULT_OPTIONS[option as keyof typeof DEFAULT_OPTIONS];
  });

  if (!validOptions.length) {
    return { rules: DEFAULT_OPTIONS, conf };
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
    conf,
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
    const browsers = context.settings.browsers || context.settings.targets;
    const { targets, hasConfig } = collectBrowserTargets(context.getFilename(), browsers);
    // Lookahead assertions are part of JavaScript's original regular expression support and are thus supported in all browsers.
    const unsupportedTargets = collectUnsupportedTargets("js-regexp-lookbehind", targets);
    const {
      rules,
      conf: { browserslist },
    } = getExpressionsToCheckFromConfiguration(context.options);

    // If there are no unsupported targets resolved from the browserslist config, then we can skip this rule
    if (!unsupportedTargets.length && hasConfig) return {};

    return {
      Literal(node: ESTree.Literal & Rule.NodeParentExtension): void {
        let input: string = "";
        if (isStringLiteralRegExp(node) && typeof node.raw === "string") {
          // For string literals, we need to pass the raw value which includes escape characters.
          input = node.raw;
        } else if (isRegExpLiteral(node)) {
          input = node.regex.pattern;
        }
        if (input) {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(input, rules);
          if (unsupportedGroups.length === 0) return;
          if (!browserslist) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
            return;
          }
          if (unsupportedGroups.some((group) => group.type === "lookbehind")) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
          }
        }
      },
    };
  },
};

export { noLookaheadLookbehindRegexp };
