import { Rule } from "eslint";
import * as ESTree from "estree";

function isRegExpLiteral(
  literal: ESTree.Literal
): literal is ESTree.RegExpLiteral {
  return "regexp" in literal;
}

const noLookAheadLookBehindRule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        "disallow the use of lookahead and lookbehind regexes if unsupported by browser",
      category: "Compatibility",
      recommended: true,
    },
    type: "problem",
  },
  create(context: Rule.RuleContext) {
    return {
      Literal(node) {
        if (isRegExpLiteral(node)) {
          console.log(node.regex);

          context.report({
            node,
            message: "Unsupported regexp",
          });
        }
      },
    };
  },
};

export { noLookAheadLookBehindRule };
