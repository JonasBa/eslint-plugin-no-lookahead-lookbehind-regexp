import { analyzeRegExpForLookaheadAndLookbehind } from "./analyzeRegExpForLookaheadAndLookbehind";

const groups = ["?=", "?<=", "?!", "?<!"];

describe("analyzeRegExpForLookaheadAndLookbehind", () => {
  it("does not return false positives for an escaped sequence", () => {
    for (const group of groups) {
      expect(analyzeRegExpForLookaheadAndLookbehind(`\\(${group}`).length).toBe(0);
    }
  });

  it.each([
    ["lookahead", 0, "(?=)"],
    ["negative lookahead", 0, "(?!)"],
    ["lookbehind", 0, "(?<=)"],
    ["negative lookbehind", 0, "(?<!)"],
  ])(`Single match %s - at %i`, (type, position, expression) => {
    expect(analyzeRegExpForLookaheadAndLookbehind(expression)[0]).toEqual({
      type: type.replace("negative ", ""),
      position: position,
      ...(type.includes("negative") ? { negative: 1 } : {}),
    });
  });

  it.each([
    ["lookahead", 0, 7, "(?=t).*(?=t)"],
    ["negative lookahead", 0, 7, "(?!t).*(?!t)"],
    ["lookbehind", 0, 8, "(?<=t).*(?<=t)"],
    ["negative lookbehind", 0, 8, "(?<!t).*(?<!t)"],
  ])(`Multiple match %s - at %i and %i`, (type, first, second, expression) => {
    expect(analyzeRegExpForLookaheadAndLookbehind(expression)).toEqual([
      {
        type: type.replace("negative ", ""),
        position: first,
        ...(type.includes("negative") ? { negative: 1 } : {}),
      },
      {
        type: type.replace("negative ", ""),
        position: second,
        ...(type.includes("negative") ? { negative: 1 } : {}),
      },
    ]);
  });
});
