import { EOL } from "os";
import { BackTestResult } from "./backtest";
import { Allocation } from "./portfolio";

const formatValue = (value: number, decimals: number): string =>
  `${value.toFixed(decimals)}`;

const formatPercentValue = (value: number, decimals: number): string =>
  `${(value * 100).toFixed(decimals)}%`;

const formatAllocation = (allocation: Allocation): string =>
  Object.entries(allocation)
    .reduce<string[]>(
      (result, [asset, value]) => [
        ...result,
        `  ${asset}: ${formatPercentValue(value, 0)}`,
      ],
      [],
    )
    .join(EOL);

const formatOneResult = (result: BackTestResult) =>
  `
Total Return: ${formatPercentValue(result.totalReturn, 2)}
Average Return: ${formatPercentValue(result.averageReturn, 2)}
Max Drawdown: ${formatPercentValue(result.maxDrawdown, 2)}
Sortino Ratio: ${formatValue(result.sortinoRatio, 2)}
Allocation:
${formatAllocation(result.allocation)}
`;

export const formatResults = (results: BackTestResult[]): string =>
  results.map(formatOneResult).join(EOL);
