import { recommended } from "./config/recommended";
import { noLookaheadLookbehindRegexp } from "./rules/noLookaheadLookbehindRegex";

export const configs = {
  recommended,
};

export const rules = {
  "no-lookahead-lookbehind-regexp": noLookaheadLookbehindRegexp,
};
