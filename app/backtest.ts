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
import { pushSortedCapped } from "./push-sorted-capped";

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
  allocations: AllocationCombinations,
  assetValues: number[]
): Allocation => {
  const values = Object.keys(allocations).reduce<Record<string, number>>(
    (result, asset, i) => ({ ...result, [asset]: assetValues[i] }),
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

  iterateOverArrays(combinations, (values) => {
    const allocation = selectAllocation(allocationCombinations, values);
    const result = backTestAllocation({ initialValue, allocation, changes });
    pushSortedCapped(bestResults, result, resultsLimit, resultsComparer);
  });

  return bestResults;
};
