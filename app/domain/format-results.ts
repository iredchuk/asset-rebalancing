import { BackTestResult } from "./backtest";

export const formatResults = (results: BackTestResult[]): string =>
  JSON.stringify(
    results.map((result) => ({
      ...result,
      portfolioValue: Math.round(result.portfolioValue),
    })),
    null,
    2
  );
