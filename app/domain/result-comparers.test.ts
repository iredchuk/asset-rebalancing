import { BackTestResult } from "./backtest";
import { byPortfolioValue } from "./result-comparers";

describe("result-comparers", () => {
  test("byPortfolioValue", () => {
    const results: BackTestResult[] = [
      { portfolioValue: 120 },
      { portfolioValue: 150 },
      { portfolioValue: 140 },
      { portfolioValue: 130 },
    ];

    results.sort(byPortfolioValue);

    expect(results).toStrictEqual([
      { portfolioValue: 150 },
      { portfolioValue: 140 },
      { portfolioValue: 130 },
      { portfolioValue: 120 },
    ]);
  });
});
