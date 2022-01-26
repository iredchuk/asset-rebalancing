import {
  Allocation,
  Change,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

interface BackTestResult {
  endValue: number;
  valueRatio: number;
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
  };
};
