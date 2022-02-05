import { BackTestResult } from "./backtest";
import { byPortfolioValue, bySortinoRatio } from "./result-comparers";

describe("result-comparers", () => {
  test("byPortfolioValue", () => {
    const results: BackTestResult[] = [
      { portfolioValue: 120, sortinoRatio: 1.9, allocation: {} },
      { portfolioValue: 150, sortinoRatio: 2.1, allocation: {} },
      { portfolioValue: 140, sortinoRatio: 2.5, allocation: {} },
      { portfolioValue: 130, sortinoRatio: 3.2, allocation: {} },
    ];

    results.sort(byPortfolioValue);

    expect(results).toStrictEqual([
      { portfolioValue: 150, sortinoRatio: 2.1, allocation: {} },
      { portfolioValue: 140, sortinoRatio: 2.5, allocation: {} },
      { portfolioValue: 130, sortinoRatio: 3.2, allocation: {} },
      { portfolioValue: 120, sortinoRatio: 1.9, allocation: {} },
    ]);
  });

  test("bySortinoRatio", () => {
    const results: BackTestResult[] = [
      { portfolioValue: 120, sortinoRatio: 1.9, allocation: {} },
      { portfolioValue: 150, sortinoRatio: 2.1, allocation: {} },
      { portfolioValue: 140, sortinoRatio: 2.5, allocation: {} },
      { portfolioValue: 130, sortinoRatio: 3.2, allocation: {} },
    ];

    results.sort(bySortinoRatio);

    expect(results).toStrictEqual([
      { portfolioValue: 130, sortinoRatio: 3.2, allocation: {} },
      { portfolioValue: 140, sortinoRatio: 2.5, allocation: {} },
      { portfolioValue: 150, sortinoRatio: 2.1, allocation: {} },
      { portfolioValue: 120, sortinoRatio: 1.9, allocation: {} },
    ]);
  });
});
