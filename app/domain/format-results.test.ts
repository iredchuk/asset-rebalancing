import { BackTestResult } from "./backtest";
import { formatResults } from "./format-results";

describe("format-results", () => {
  test("format results with 2 entries", () => {
    const results: BackTestResult[] = [
      {
        totalReturn: 0.25496,
        averageReturn: 0.05124,
        maxDrawdown: 0.13697,
        allocation: {
          gold: 0.72,
          silver: 0.18,
          platinum: 0.1,
        },
      },
      {
        totalReturn: 0.14701,
        averageReturn: 0.04333,
        maxDrawdown: 0.14046,
        allocation: {
          gold: 0.65,
          silver: 0.35,
          platinum: 0,
        },
      },
    ];

    const actual = formatResults(results);

    expect(actual).toEqual(`
Total return: 25.50%
Average return: 5.12%
Max Drawdown: 13.70%
Allocation:
  gold: 72%
  silver: 18%
  platinum: 10%


Total return: 14.70%
Average return: 4.33%
Max Drawdown: 14.05%
Allocation:
  gold: 65%
  silver: 35%
  platinum: 0%
`);
  });
});
