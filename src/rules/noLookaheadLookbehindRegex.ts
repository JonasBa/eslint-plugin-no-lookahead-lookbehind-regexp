import { Rule } from "eslint";
import * as ESTree from "estree";

import {
  analyzeRegExpForLookaheadAndLookbehind,
  AnalyzeOptions,
  CheckableExpression,
} from "./../helpers/analyzeRegExpForLookAheadAndLookbehind";
import { collectBrowserTargets, collectUnsupportedTargets } from "./../helpers/caniuse";
import { isStringLiteralRegExp, isRegExpLiteral } from "./../helpers/ast";
import { createContextReport } from "../helpers/createReport";

export const DEFAULT_OPTIONS: AnalyzeOptions["rules"] = {
  "no-lookahead": 1,
  "no-lookbehind": 1,
  "no-negative-lookahead": 1,
  "no-negative-lookbehind": 1,
};

export const getExpressionsToCheckFromConfiguration = (
  options: Rule.RuleContext["options"]
): AnalyzeOptions["rules"] => {
  if (!options.length) return DEFAULT_OPTIONS;

  const validOptions: CheckableExpression[] = options.filter((option: unknown) => {
    if (typeof option !== "string") return false;
    return DEFAULT_OPTIONS[option as keyof typeof DEFAULT_OPTIONS];
  });

  if (!validOptions.length) {
    return DEFAULT_OPTIONS;
  }

  return validOptions.reduce<AnalyzeOptions["rules"]>(
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
};

const noLookaheadLookbehindRegexp: Rule.RuleModule = {
  meta: {
    docs: {
      description: "disallow the use of lookahead and lookbehind regexes if unsupported by browser",
      category: "Compatibility",
      recommended: true,
    },
    type: "problem",
  },
  create(context: Rule.RuleContext) {
    const browsers = context.settings.browsers || context.settings.targets;
    const { targets, hasConfig } = collectBrowserTargets(context.getFilename(), browsers);
    const unsupportedTargets = collectUnsupportedTargets("js-regexp-lookbehind", targets);
    const rules = getExpressionsToCheckFromConfiguration(context.options);

    // If there are no unsupported targets resolved from the browserlist config, then we can skip this rule
    if (!unsupportedTargets.length && hasConfig) return {};

    return {
      Literal(node: ESTree.Literal & Rule.NodeParentExtension): void {
        if (isStringLiteralRegExp(node) && typeof node.raw === "string") {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
            node.raw,
            { rules } // For string literals, we need to pass the raw value which includes escape characters.
          );
          if (unsupportedGroups.length > 0) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
          }
        } else if (isRegExpLiteral(node)) {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(node.regex.pattern, {
            rules,
          });
          if (unsupportedGroups.length > 0) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
          }
        }
      },
    };
  },
};

export { noLookaheadLookbehindRegexp };
