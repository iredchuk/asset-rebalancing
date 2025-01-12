import { iterateOverArrays } from "../utils/iterate";
import { avg, rootMeanSquare, sum } from "../utils/stat";
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
  sortinoRatio: number;
  allocation: Allocation;
}

export interface BacktestAllocationParams {
  allocation: Allocation;
  changes: Change[];
  minimalAcceptableReturn: number;
}

export const backTestAllocation = (
  params: BacktestAllocationParams,
): BackTestResult => {
  const { allocation, changes } = params;
  const initialPortfolioValue = 1;
  let previousPortfolioValue = initialPortfolioValue;
  let lastHighValue = initialPortfolioValue;
  let maxDrawdown = 0;
  const returns: number[] = [];
  const negativeExcessiveReturns: number[] = [];

  let portfolio = createPortfolio(initialPortfolioValue, allocation);

  for (const change of changes) {
    portfolio = rebalance(updatePortfolio(portfolio, change), allocation);

    const currentPortfolioValue = getPortfolioValue(portfolio);
    const portfolioReturn = currentPortfolioValue / previousPortfolioValue - 1;
    returns.push(portfolioReturn);
    const excessiveReturn = portfolioReturn - params.minimalAcceptableReturn;
    negativeExcessiveReturns.push(Math.min(excessiveReturn, 0));

    if (currentPortfolioValue > lastHighValue) {
      lastHighValue = currentPortfolioValue;
    } else {
      const drawdown = 1 - currentPortfolioValue / lastHighValue;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    previousPortfolioValue = currentPortfolioValue;
  }

  const portfolioValue = getPortfolioValue(portfolio);

  const totalReturn = portfolioValue / initialPortfolioValue - 1;
  const averageReturn = avg(returns);
  const downsideDeviation = rootMeanSquare(negativeExcessiveReturns);
  const sortinoRatio =
    (averageReturn - params.minimalAcceptableReturn) / downsideDeviation;

  return {
    totalReturn,
    averageReturn,
    maxDrawdown,
    sortinoRatio,
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

export interface BacktestParams {
  allocationCombinations: AllocationCombinations;
  changes: Change[];
  resultsLimit: number;
  minimalAcceptableReturn: number;
  sortByDesc: (r: BackTestResult) => number;
}

export const backTestAllocationCombinations = (
  params: BacktestParams,
): BackTestResult[] => {
  const {
    allocationCombinations,
    changes,
    resultsLimit,
    minimalAcceptableReturn,
    sortByDesc,
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
      minimalAcceptableReturn,
    });

    bestResults.push(result);
    bestResults.sort(compareResults);
    bestResults.splice(resultsLimit);
  });

  return bestResults;
};
