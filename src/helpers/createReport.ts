import * as ESTree from "estree";
import { Rule } from "eslint";

import { analyzeRegExpForLookaheadAndLookbehind } from "./../helpers/analyzeRegExpForLookAheadAndLookbehind";
import { collectUnsupportedTargets, formatLinterMessage } from "./../helpers/caniuse";

export function createContextReport(
  node: ESTree.Literal & Rule.NodeParentExtension,
  context: Rule.RuleContext,
  violators: ReturnType<typeof analyzeRegExpForLookaheadAndLookbehind>,
  targets: ReturnType<typeof collectUnsupportedTargets>
): void {
  context.report({
    node: node,
    message: formatLinterMessage(violators, targets),
  });
}
