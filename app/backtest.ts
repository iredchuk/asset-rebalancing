import {
  Allocation,
  Change,
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

type Allocations = Record<string, number[]>;

const createAllocation = (allocations: Allocations, values: number[]) =>
  Object.keys(allocations).reduce<Allocation>(
    (result, asset, i) => ({ ...result, [asset]: values[i] }),
    {}
  );

export const backTestAllocationCombinations = (
  initialValue: number,
  allocations: Allocations,
  changes: Change[]
): BackTestResult => {
  let bestResult: BackTestResult = { endValue: 0, valueRatio: 0 };

  const combinations = Object.values(allocations);

  iterateOverArrays(combinations, (values) => {
    const allocation = createAllocation(allocations, values);

    const result = backTestAllocation(initialValue, allocation, changes);

    if (result.endValue > bestResult.endValue) {
      bestResult = result;
    }
  });

  return bestResult;
};
