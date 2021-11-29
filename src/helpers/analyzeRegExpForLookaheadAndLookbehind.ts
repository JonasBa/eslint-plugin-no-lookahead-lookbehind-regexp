type UnsupportedExpression = {
  type: "lookahead" | "lookbehind";
  negative?: 1;
  position: number;
};

function analyzeRegExpForLookaheadAndLookbehind(input: string): UnsupportedExpression[] {
  // Lookahead and lookbehind require min 5 characters to be useful, however
  // an expression like /(?=)/ which uses only 4, although not useful, can still crash an application
  if (input.length < 4) return [];

  let current = 0;

  const peek = (): string => input.charAt(current + 1);
  const advance = (): string => input.charAt(++current);
  const isEnd = () => current > input.length;
  const isEscaped = (): boolean => input.charAt(current - 1) === "\\";

  const matchedExpressions: UnsupportedExpression[] = [];

  while (!isEnd()) {
    const start = current;
    const char = input.charAt(start);

    switch (char) {
      case "(": {
        // If first char is ( then the sequence cannot be escaped.
        if (current > 0 && isEscaped()) {
          advance();
          break;
        }

        if (peek() === "?") {
          advance();

          // Lookahead
          if (peek() === "=") {
            matchedExpressions.push({
              type: "lookahead",
              position: start,
            });
            advance();
            break;
          }
          // Negative lookahead
          if (peek() === "!") {
            matchedExpressions.push({
              type: "lookahead",
              negative: 1,
              position: start,
            });
            advance();
            break;
          }

          if (peek() === "<") {
            // Lookbehind
            if (input.charAt(current + 2) === "=") {
              matchedExpressions.push({
                type: "lookbehind",
                position: start,
              });
              advance();
              advance();
              break;
            }
            // Negative Lookbehind
            if (input.charAt(current + 2) === "!") {
              matchedExpressions.push({
                type: "lookbehind",
                negative: 1,
                position: start,
              });
              advance();
              advance();
              break;
            }
          }
        } else {
          advance();
        }
        break;
      }
      default: {
        advance();
      }
    }
  }

  return matchedExpressions;
}

export { analyzeRegExpForLookaheadAndLookbehind };
