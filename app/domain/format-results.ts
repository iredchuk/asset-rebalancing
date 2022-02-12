import { BackTestResult } from "./backtest";

const formatPercentValue = (value: number, decimals: number) =>
  `${(value * 100).toFixed(decimals)}%`;

export const formatResults = (results: BackTestResult[]): string =>
  JSON.stringify(
    results.map((result: BackTestResult) => ({
      totalReturn: formatPercentValue(result.totalReturn, 2),
      averageReturn: formatPercentValue(result.averageReturn, 2),
      sortinoRatio: result.sortinoRatio.toFixed(2),
      maxDrawdown: formatPercentValue(result.maxDrawdown, 2),
      allocation: Object.entries(result.allocation).reduce(
        (result, [asset, value]) => ({
          ...result,
          [asset]: formatPercentValue(value, 0),
        }),
        {}
      ),
    })),
    null,
    2
  );
