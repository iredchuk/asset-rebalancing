import { BackTestResult } from "./backtest";

export const formatResults = (results: BackTestResult[]) =>
  JSON.stringify(
    results.map((result) => ({
      ...result,
      endValue: Math.round(result.endValue),
      valueRatio: 0.01 * Math.round(result.valueRatio * 100),
    })),
    null,
    2
  );
