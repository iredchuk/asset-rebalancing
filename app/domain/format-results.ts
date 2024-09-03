import { EOL } from "os";
import { BackTestResult } from "./backtest";
import { Allocation } from "./portfolio";

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
Total return: ${formatPercentValue(result.totalReturn, 2)}
Average return: ${formatPercentValue(result.averageReturn, 2)}
Max Drawdown: ${formatPercentValue(result.maxDrawdown, 2)}
Allocation:
${formatAllocation(result.allocation)}
`;

export const formatResults = (results: BackTestResult[]): string =>
  results.map(formatOneResult).join(EOL);
