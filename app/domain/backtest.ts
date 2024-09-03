import { iterateOverArrays } from "../utils/iterate";
import { sum } from "../utils/stat";
import {
  Allocation,
  Change,
  createAllocation,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

export interface BackTestResult {
  totalReturn: number;
  averageReturn: number;
  maxDrawdown: number;
  allocation: Allocation;
}

export interface BacktestAllocationParams {
  allocation: Allocation;
  changes: Change[];
}

const getAveragePeriodReturn = (
  initialPortfolioValue: number,
  portfolioValue: number,
  periodsCount: number,
) => Math.pow(portfolioValue / initialPortfolioValue, 1 / periodsCount) - 1;

export const backTestAllocation = (
  params: BacktestAllocationParams,
): BackTestResult => {
  const { allocation, changes } = params;
  const initialPortfolioValue = 1;
  let lastHighValue = initialPortfolioValue;
  let maxDrawdown = 0;

  const resultPortfolio = changes.reduce(
    (portfolio, change) => {
      const updatedPortfolio = rebalance(
        updatePortfolio(portfolio, change),
        allocation,
      );

      const currentPortfolioValue = getPortfolioValue(updatedPortfolio);

      if (currentPortfolioValue > lastHighValue) {
        lastHighValue = currentPortfolioValue;
      } else {
        const drawdown = 1 - currentPortfolioValue / lastHighValue;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }

      return updatedPortfolio;
    },
    createPortfolio(initialPortfolioValue, allocation),
  );

  const portfolioValue = getPortfolioValue(resultPortfolio);

  const averageReturn = getAveragePeriodReturn(
    initialPortfolioValue,
    portfolioValue,
    changes.length,
  );

  const totalReturn = portfolioValue / initialPortfolioValue - 1;

  return {
    totalReturn,
    averageReturn,
    maxDrawdown,
    allocation: { ...allocation },
  };
};

export type AllocationCombinations = Record<string, number[]>;

const tryCreateAllocation = (
  assets: string[],
  assetAllocations: number[],
): Allocation | undefined => {
  const allocation = assets.reduce<Record<string, number>>(
    (result, asset, i) => ({ ...result, [asset]: assetAllocations[i] }),
    {},
  );

  if (Math.abs(sum(Object.values(allocation)) - 1) >= 0.01) {
    return undefined;
  }

  return createAllocation(allocation);
};

interface BacktestCombinationsParams {
  allocationCombinations: AllocationCombinations;
  changes: Change[];
  resultsLimit: number;
  sortByDesc: (r: BackTestResult) => number;
  filter?: (r: BackTestResult) => boolean;
}

export const backTestAllocationCombinations = (
  params: BacktestCombinationsParams,
): BackTestResult[] => {
  const { allocationCombinations, changes, resultsLimit, sortByDesc, filter } =
    params;

  let bestResults: BackTestResult[] = [];
  const combinations = Object.values(allocationCombinations);
  const assets = Object.keys(allocationCombinations);

  const compareResults = (a: BackTestResult, b: BackTestResult) =>
    Math.sign(sortByDesc(b) - sortByDesc(a));

  iterateOverArrays(combinations, (assetAllocations) => {
    const allocation = tryCreateAllocation(assets, assetAllocations);
    if (allocation === undefined) {
      return;
    }

    const result = backTestAllocation({
      allocation,
      changes,
    });

    if (filter === undefined || filter(result)) {
      bestResults.push(result);
      bestResults.sort(compareResults);
      bestResults.splice(resultsLimit);
    }
  });

  return bestResults;
};
