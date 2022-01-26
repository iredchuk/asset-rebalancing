import {
  Allocation,
  Change,
  createAllocation,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

import { iterateOverArrays } from "./iterate-over-arrays";

interface BackTestResult {
  endValue: number;
  valueRatio: number;
  allocation?: Allocation;
}

const compareResults = (a: BackTestResult, b: BackTestResult): number => {
  if (a.endValue > b.endValue) {
    return 1;
  }
  if (a.endValue < b.endValue) {
    return -1;
  }
  return 0;
};

export const backTestAllocation = (
  initialValue: number,
  allocation: Allocation,
  changes: Change[]
): BackTestResult => {
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

type AllocationCombinations = Record<string, number[]>;

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

export const backTestAllocationCombinations = (
  initialValue: number,
  allocationCombinations: AllocationCombinations,
  changes: Change[]
): BackTestResult => {
  let bestResult: BackTestResult = { endValue: 0, valueRatio: 0 };
  const combinations = Object.values(allocationCombinations);

  iterateOverArrays(combinations, (values) => {
    const allocation = selectAllocation(allocationCombinations, values);
    const result = backTestAllocation(initialValue, allocation, changes);
    if (compareResults(result, bestResult) > 0) {
      bestResult = result;
    }
  });

  return bestResult;
};
