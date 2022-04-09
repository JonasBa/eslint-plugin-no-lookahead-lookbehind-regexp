import { Rule } from "eslint";
import * as ESTree from "estree";

import { analyzeRegExpForLookaheadAndLookbehind } from "./../helpers/analyzeRegExpForLookAheadAndLookbehind";
import { collectBrowserTargets, collectUnsupportedTargets } from "./../helpers/caniuse";

import { isStringLiteralRegExp, isRegExpLiteral } from "./../helpers/ast";
import { createContextReport } from "../helpers/createReport";

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

    // If there are no unsupported targets resolved from the browserlist config, then we can skip this rule
    if (!unsupportedTargets.length && hasConfig) return {};

    console.log(context);

    return {
      Literal(node: ESTree.Literal & Rule.NodeParentExtension): void {
        if (isStringLiteralRegExp(node) && typeof node.raw === "string") {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(
            node.raw // For string literals, we need to pass the raw value which includes escape characters.
          );
          if (unsupportedGroups.length > 0) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
          }
        } else if (isRegExpLiteral(node)) {
          const unsupportedGroups = analyzeRegExpForLookaheadAndLookbehind(node.regex.pattern);
          if (unsupportedGroups.length > 0) {
            createContextReport(node, context, unsupportedGroups, unsupportedTargets);
          }
        }
      },
    };
  },
};

export { noLookaheadLookbehindRegexp };
