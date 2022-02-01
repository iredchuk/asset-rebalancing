import { BackTestResult } from "./backtest";

export const byPortfolioValue = (
  a: BackTestResult,
  b: BackTestResult
): number => Math.sign(b.portfolioValue - a.portfolioValue);
