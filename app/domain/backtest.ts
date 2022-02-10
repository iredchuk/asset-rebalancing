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
  portfolioValue: number;
  sortinoRatio: number;
  maxDrawdown: number;
  allocation: Allocation;
}

export interface BacktestAllocationParams {
  initialValue: number;
  allocation: Allocation;
  changes: Change[];
  minAcceptableReturn: number;
}

const getAdjustedDrawdown = (
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
  drawdowns: number[]
) => {
  const downsideDeviation = Math.sqrt(
    sum(drawdowns.map((d) => d * d)) / drawdowns.length
  );
  return (
    (averagePeriodReturn - minAcceptableReturn) /
    Math.max(downsideDeviation, 0.001)
  );
};

export const backTestAllocation = (
  params: BacktestAllocationParams
): BackTestResult => {
  const { initialValue, allocation, changes, minAcceptableReturn } = params;
  const adjustedDrawdowns: number[] = [];

  const resultPortfolio = changes.reduce((portfolio, change) => {
    const initialPortfolioValue = getPortfolioValue(portfolio);
    const updatedPortfolio = rebalance(
      updatePortfolio(portfolio, change),
      allocation
    );

    adjustedDrawdowns.push(
      getAdjustedDrawdown(
        initialPortfolioValue,
        getPortfolioValue(updatedPortfolio),
        minAcceptableReturn
      )
    );

    return updatedPortfolio;
  }, createPortfolio(initialValue, allocation));

  const portfolioValue = getPortfolioValue(resultPortfolio);

  const averagePeriodReturn = getAveragePeriodReturn(
    initialValue,
    portfolioValue,
    changes.length
  );

  const sortinoRatio = getSortinoRatio(
    averagePeriodReturn,
    minAcceptableReturn,
    adjustedDrawdowns
  );

  const maxDrawdown = Math.max(...adjustedDrawdowns) - minAcceptableReturn;

  return {
    portfolioValue,
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
  initialValue: number;
  allocationCombinations: AllocationCombinations;
  changes: Change[];
  minAcceptableReturn: number;
  resultsLimit: number;
  compareByDesc: (r: BackTestResult) => number;
  filter?: (r: BackTestResult) => boolean;
}

export const backTestAllocationCombinations = (
  params: BacktestCombinationsParams
): BackTestResult[] => {
  const {
    initialValue,
    allocationCombinations,
    changes,
    minAcceptableReturn,
    resultsLimit,
    compareByDesc,
    filter,
  } = params;

  let bestResults: BackTestResult[] = [];
  const combinations = Object.values(allocationCombinations);
  const assets = Object.keys(allocationCombinations);

  const compareResults = (a: BackTestResult, b: BackTestResult) =>
    Math.sign(compareByDesc(b) - compareByDesc(a));

  iterateOverArrays(combinations, (assetAllocations) => {
    const allocation = tryCreateAllocation(assets, assetAllocations);
    if (allocation === undefined) {
      return;
    }

    const result = backTestAllocation({
      initialValue,
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
