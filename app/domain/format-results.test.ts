import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BackTestResult } from "./backtest";
import { formatResults } from "./format-results";

describe("format-results", () => {
  test("format results with 2 entries", () => {
    const results: BackTestResult[] = [
      {
        totalReturn: 0.25496,
        averageReturn: 0.05124,
        maxDrawdown: 0.13697,
        sortinoRatio: 1.25496,
        allocation: {
          gold: 0.72,
          silver: 0.18,
          platinum: 0.1,
        },
      },
      {
        totalReturn: 0.14701,
        averageReturn: 0.04333,
        sortinoRatio: 1.14701,
        maxDrawdown: 0.14046,
        allocation: {
          gold: 0.65,
          silver: 0.35,
          platinum: 0,
        },
      },
    ];

    const actual = formatResults(results);

    assert.equal(
      actual,
      `
Total Return: 25.50%
Average Return: 5.12%
Max Drawdown: 13.70%
Sortino Ratio: 1.25
Allocation:
  gold: 72%
  silver: 18%
  platinum: 10%


Total Return: 14.70%
Average Return: 4.33%
Max Drawdown: 14.05%
Sortino Ratio: 1.15
Allocation:
  gold: 65%
  silver: 35%
  platinum: 0%
`,
    );
  });
});
