import { BackTestResult } from "./backtest";

export const formatResults = (results: BackTestResult[]): string =>
  JSON.stringify(
    results.map((result: BackTestResult) => ({
      portfolioValue: result.portfolioValue.toFixed(0),
      sortinoRatio: result.sortinoRatio.toFixed(2),
      maxDrawdown: `${(result.maxDrawdown * 100).toFixed(2)}%`,
      allocation: Object.entries(result.allocation).reduce(
        (result, [asset, value]) => ({
          ...result,
          [asset]: `${value * 100}%`,
        }),
        {}
      ),
    })),
    null,
    2
  );
