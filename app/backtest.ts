import {
  Allocation,
  Change,
  createAllocation,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

import { iterateOverArrays } from "./iterate";

export interface BackTestResult {
  endValue: number;
  valueRatio: number;
  allocation?: Allocation;
}

export interface BacktestAllocationParams {
  initialValue: number;
  allocation: Allocation;
  changes: Change[];
}

export const backTestAllocation = (
  params: BacktestAllocationParams
): BackTestResult => {
  const { initialValue, allocation, changes } = params;
  const resultPortfolio = changes.reduce(
    (portfolio, change) =>
      rebalance(updatePortfolio(portfolio, change), allocation),
    createPortfolio(initialValue, allocation)
  );

  const endValue = getPortfolioValue(resultPortfolio);

  return {
    endValue,
    valueRatio: endValue / initialValue,
    allocation: { ...allocation },
  };
};

export type AllocationCombinations = Record<string, number[]>;

const selectAllocation = (
  assets: string[],
  assetAllocations: number[]
): Allocation => {
  const values = assets.reduce<Record<string, number>>(
    (result, asset, i) => ({ ...result, [asset]: assetAllocations[i] }),
    {}
  );

  return createAllocation(values);
};

interface BacktestCombinationsParams {
  initialValue: number;
  allocationCombinations: AllocationCombinations;
  changes: Change[];
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
    resultsLimit,
    resultsComparer,
  } = params;

  let bestResults: BackTestResult[] = [];
  const combinations = Object.values(allocationCombinations);
  const assets = Object.keys(allocationCombinations);

  iterateOverArrays(combinations, (assetAllocations) => {
    const allocation = selectAllocation(assets, assetAllocations);
    const result = backTestAllocation({ initialValue, allocation, changes });
    bestResults.push(result);
    bestResults.sort(resultsComparer);
    bestResults.splice(resultsLimit);
  });

  return bestResults;
};
