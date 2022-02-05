import { BackTestResult } from "./backtest";
import { byPortfolioValue, bySortinoRatio } from "./result-comparers";

describe("result-comparers", () => {
  test("byPortfolioValue", () => {
    const results: BackTestResult[] = [
      {
        portfolioValue: 120,
        sortinoRatio: 1.9,
        maxDrawdown: 0.34,
        allocation: {},
      },
      {
        portfolioValue: 150,
        sortinoRatio: 2.1,
        maxDrawdown: 0.21,
        allocation: {},
      },
      {
        portfolioValue: 140,
        sortinoRatio: 2.5,
        maxDrawdown: 0.12,
        allocation: {},
      },
      {
        portfolioValue: 130,
        sortinoRatio: 3.2,
        maxDrawdown: 0.15,
        allocation: {},
      },
    ];

    results.sort(byPortfolioValue);

    expect(results).toMatchObject([
      { portfolioValue: 150 },
      { portfolioValue: 140 },
      { portfolioValue: 130 },
      { portfolioValue: 120 },
    ]);
  });

  test("bySortinoRatio", () => {
    const results: BackTestResult[] = [
      {
        portfolioValue: 120,
        sortinoRatio: 1.9,
        maxDrawdown: 0.1,
        allocation: {},
      },
      {
        portfolioValue: 150,
        sortinoRatio: 2.1,
        maxDrawdown: 0.25,
        allocation: {},
      },
      {
        portfolioValue: 140,
        sortinoRatio: 2.5,
        maxDrawdown: 0,
        allocation: {},
      },
      {
        portfolioValue: 130,
        sortinoRatio: 3.2,
        maxDrawdown: 0.35,
        allocation: {},
      },
    ];

    results.sort(bySortinoRatio);

    expect(results).toMatchObject([
      { sortinoRatio: 3.2 },
      { sortinoRatio: 2.5 },
      { sortinoRatio: 2.1 },
      { sortinoRatio: 1.9 },
    ]);
  });
});
