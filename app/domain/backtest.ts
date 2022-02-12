import {
  Allocation,
  Change,
  createAllocation,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";
import { iterateOverArrays } from "../utils/iterate";
import { sum } from "../utils/stat";

export interface BackTestResult {
  totalReturn: number;
  averageReturn: number;
  sortinoRatio: number;
  maxDrawdown: number;
  allocation: Allocation;
}

export interface BacktestAllocationParams {
  allocation: Allocation;
  changes: Change[];
  minAcceptableReturn: number;
}

const getRelativeNegativeReturn = (
  portfolioValueBefore: number,
  portfolioValueAfter: number,
  minAcceptableReturn: number
) => {
  const adjustedReturn =
    portfolioValueAfter / portfolioValueBefore - 1 - minAcceptableReturn;
  return Math.abs(Math.min(adjustedReturn, 0));
};

const getAveragePeriodReturn = (
  initialPortfolioValue: number,
  portfolioValue: number,
  periodsCount: number
) => Math.pow(portfolioValue / initialPortfolioValue, 1 / periodsCount) - 1;

const getSortinoRatio = (
  averagePeriodReturn: number,
  minAcceptableReturn: number,
  negativeReturns: number[]
) => {
  const downsideDeviation = Math.sqrt(
    sum(negativeReturns.map((d) => d * d)) / negativeReturns.length
  );
  return (
    (averagePeriodReturn - minAcceptableReturn) /
    Math.max(downsideDeviation, 0.001)
  );
};

export const backTestAllocation = (
  params: BacktestAllocationParams
): BackTestResult => {
  const { allocation, changes, minAcceptableReturn } = params;
  const initialPortfolioValue = 1;
  const negativeReturns: number[] = [];
  let lastHighValue = initialPortfolioValue;
  let maxDrawdown = 0;

  const resultPortfolio = changes.reduce((portfolio, change) => {
    const initialPortfolioValue = getPortfolioValue(portfolio);
    const updatedPortfolio = rebalance(
      updatePortfolio(portfolio, change),
      allocation
    );

    const currentPortfolioValue = getPortfolioValue(updatedPortfolio);

    negativeReturns.push(
      getRelativeNegativeReturn(
        initialPortfolioValue,
        currentPortfolioValue,
        minAcceptableReturn
      )
    );

    if (currentPortfolioValue > lastHighValue) {
      lastHighValue = currentPortfolioValue;
    } else {
      const drawdown = 1 - currentPortfolioValue / lastHighValue;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return updatedPortfolio;
  }, createPortfolio(initialPortfolioValue, allocation));

  const portfolioValue = getPortfolioValue(resultPortfolio);

  const averageReturn = getAveragePeriodReturn(
    initialPortfolioValue,
    portfolioValue,
    changes.length
  );

  const totalReturn = portfolioValue / initialPortfolioValue - 1;

  const sortinoRatio = getSortinoRatio(
    averageReturn,
    minAcceptableReturn,
    negativeReturns
  );

  return {
    totalReturn,
    averageReturn,
    sortinoRatio,
    maxDrawdown,
    allocation: { ...allocation },
  };
};

export type AllocationCombinations = Record<string, number[]>;

const tryCreateAllocation = (
  assets: string[],
  assetAllocations: number[]
): Allocation | undefined => {
  const allocation = assets.reduce<Record<string, number>>(
    (result, asset, i) => ({ ...result, [asset]: assetAllocations[i] }),
    {}
  );

  if (Math.abs(sum(Object.values(allocation)) - 1) >= 0.01) {
    return undefined;
  }

  return createAllocation(allocation);
};

interface BacktestCombinationsParams {
  allocationCombinations: AllocationCombinations;
  changes: Change[];
  minAcceptableReturn: number;
  resultsLimit: number;
  sortByDesc: (r: BackTestResult) => number;
  filter?: (r: BackTestResult) => boolean;
}

export const backTestAllocationCombinations = (
  params: BacktestCombinationsParams
): BackTestResult[] => {
  const {
    allocationCombinations,
    changes,
    minAcceptableReturn,
    resultsLimit,
    sortByDesc,
    filter,
  } = params;

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
      minAcceptableReturn,
    });

    if (filter === undefined || filter(result)) {
      bestResults.push(result);
      bestResults.sort(compareResults);
      bestResults.splice(resultsLimit);
    }
  });

  return bestResults;
};
