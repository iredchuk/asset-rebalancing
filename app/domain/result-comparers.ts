import { BackTestResult } from "./backtest";

export const byPortfolioValue = (
  a: BackTestResult,
  b: BackTestResult
): number => Math.sign(b.portfolioValue - a.portfolioValue);

export const bySortinoRatio = (a: BackTestResult, b: BackTestResult): number =>
  Math.sign(b.sortinoRatio - a.sortinoRatio);
