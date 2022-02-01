import { BackTestResult } from "./backtest";
import { byPortfolioValue, bySortinoRatio } from "./result-comparers";

describe("result-comparers", () => {
  test("byPortfolioValue", () => {
    const results: BackTestResult[] = [
      { portfolioValue: 120, sortinoRatio: 1.9 },
      { portfolioValue: 150, sortinoRatio: 2.1 },
      { portfolioValue: 140, sortinoRatio: 2.5 },
      { portfolioValue: 130, sortinoRatio: 3.2 },
    ];

    results.sort(byPortfolioValue);

    expect(results).toStrictEqual([
      { portfolioValue: 150, sortinoRatio: 2.1 },
      { portfolioValue: 140, sortinoRatio: 2.5 },
      { portfolioValue: 130, sortinoRatio: 3.2 },
      { portfolioValue: 120, sortinoRatio: 1.9 },
    ]);
  });

  test("bySortinoRatio", () => {
    const results: BackTestResult[] = [
      { portfolioValue: 120, sortinoRatio: 1.9 },
      { portfolioValue: 150, sortinoRatio: 2.1 },
      { portfolioValue: 140, sortinoRatio: 2.5 },
      { portfolioValue: 130, sortinoRatio: 3.2 },
    ];

    results.sort(bySortinoRatio);

    expect(results).toStrictEqual([
      { portfolioValue: 130, sortinoRatio: 3.2 },
      { portfolioValue: 140, sortinoRatio: 2.5 },
      { portfolioValue: 150, sortinoRatio: 2.1 },
      { portfolioValue: 120, sortinoRatio: 1.9 },
    ]);
  });
});
