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
import { stdev, sum } from "../utils/stat";

export interface BackTestResult {
  portfolioValue: number;
  sortinoRatio: number;
  allocation?: Allocation;
}

export interface BacktestAllocationParams {
  initialValue: number;
  allocation: Allocation;
  changes: Change[];
  minAcceptedReturn: number;
}

export const backTestAllocation = (
  params: BacktestAllocationParams
): BackTestResult => {
  const { initialValue, allocation, changes, minAcceptedReturn } = params;
  const allDrawdowns: number[] = [];

  const resultPortfolio = changes.reduce((portfolio, change) => {
    const initialPortfolioValue = getPortfolioValue(portfolio);
    const updatedPortfolio = rebalance(
      updatePortfolio(portfolio, change),
      allocation
    );

    const updatedPortfolioValue = getPortfolioValue(updatedPortfolio);

    const adjustedReturn =
      (updatedPortfolioValue - initialPortfolioValue) / initialPortfolioValue -
      minAcceptedReturn;

    const drawdown = adjustedReturn < 0 ? Math.abs(adjustedReturn) : 0;
    allDrawdowns.push(drawdown);

    return updatedPortfolio;
  }, createPortfolio(initialValue, allocation));

  const portfolioValue = getPortfolioValue(resultPortfolio);

  const sortinoRatio =
    (portfolioValue - initialValue) /
    (initialValue * changes.length * (stdev(allDrawdowns) || 0.01));

  return {
    portfolioValue,
    sortinoRatio,
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
  minAcceptedReturn: number;
  resultsLimit: number;
  resultsComparer: (a: BackTestResult, b: BackTestResult) => number;
}

export const backTestAllocationCombinations = (
  params: BacktestCombinationsParams
): BackTestResult[] => {
  const {
    initialValue,
    allocationCombinations,
    changes,
    minAcceptedReturn,
    resultsLimit,
    resultsComparer,
  } = params;

  let bestResults: BackTestResult[] = [];
  const combinations = Object.values(allocationCombinations);
  const assets = Object.keys(allocationCombinations);

  iterateOverArrays(combinations, (assetAllocations) => {
    const allocation = tryCreateAllocation(assets, assetAllocations);
    if (allocation === undefined) {
      return;
    }

    const result = backTestAllocation({
      initialValue,
      allocation,
      changes,
      minAcceptedReturn,
    });

    bestResults.push(result);
    bestResults.sort(resultsComparer);
    bestResults.splice(resultsLimit);
  });

  return bestResults;
};
