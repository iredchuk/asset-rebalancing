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

const selectAllocation = (
  allocations: Allocations,
  values: number[]
): Allocation => {
  // TODO: create valid allocation not greater than 1 in total value
  const allocationValues = Object.keys(allocations).reduce<
    Record<string, number>
  >((result, asset, i) => ({ ...result, [asset]: values[i] }), {});

  return createAllocation(allocationValues, JSON.stringify(allocationValues));
};

export const backTestAllocationCombinations = (
  initialValue: number,
  allocations: Allocations,
  changes: Change[]
): BackTestResult => {
  let bestResult: BackTestResult = { endValue: 0, valueRatio: 0 };
  const combinations = Object.values(allocations);

  iterateOverArrays(combinations, (values) => {
    const allocation = selectAllocation(allocations, values);
    const result = backTestAllocation(initialValue, allocation, changes);
    if (result.endValue > bestResult.endValue) {
      bestResult = result;
    }
  });

  return bestResult;
};
