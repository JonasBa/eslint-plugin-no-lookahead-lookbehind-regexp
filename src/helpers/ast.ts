import { Rule } from "eslint";
import { Literal, RegExpLiteral } from "estree";

export function isRegExpLiteral(
  literal: Literal & Rule.NodeParentExtension
): literal is RegExpLiteral & Rule.NodeParentExtension {
  return "regex" in literal;
}

export function isStringLiteralRegExp(literal: Literal & Rule.NodeParentExtension) {
  return (
    literal.parent !== null &&
    literal.parent.type === "NewExpression" &&
    literal.parent.callee.type === "Identifier" &&
    literal.parent.callee.name === "RegExp"
  );
}
