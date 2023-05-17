import * as ESTree from "estree";
import { Rule } from "eslint";

import {
  AnalyzeOptions,
  analyzeRegExpForLookaheadAndLookbehind,
} from "../helpers/analyzeRegExpForLookaheadAndLookbehind";
import { collectUnsupportedTargets, formatLinterMessage } from "../helpers/caniuse";

export function createContextReport(
  node: ESTree.Literal & Rule.NodeParentExtension,
  context: Rule.RuleContext,
  violators: ReturnType<typeof analyzeRegExpForLookaheadAndLookbehind>,
  targets: ReturnType<typeof collectUnsupportedTargets>,
  config: AnalyzeOptions["config"]
): void {
  context.report({
    node: node,
    message: formatLinterMessage(violators, targets, config),
  });
}
