import { Rule } from "eslint";
import * as ESTree from "estree";

export function isRegExpLiteral(
  literal: ESTree.Literal & Rule.NodeParentExtension
): literal is ESTree.RegExpLiteral & Rule.NodeParentExtension {
  return "regex" in literal;
}

export function isStringLiteralRegExp(literal: ESTree.Literal & Rule.NodeParentExtension) {
  return (
    literal.parent !== null &&
    literal.parent.type === "NewExpression" &&
    literal.parent.callee.type === "Identifier" &&
    literal.parent.callee.name === "RegExp"
  );
}
