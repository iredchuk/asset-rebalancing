export type Portfolio = Record<string, number>;

export type Change = Record<string, number>;

export type Allocation = Record<string, number>;

export const createPortfolio = (
  value: number,
  allocation: Allocation
): Portfolio =>
  Object.entries(allocation).reduce<Portfolio>(
    (result, [asset, assetAllocation]) => ({
      ...result,
      [asset]: value * assetAllocation,
    }),
    {}
  );

export const getPortfolioValue = (portfolio: Portfolio): number =>
  Object.values(portfolio).reduce(
    (result, assetValue) => result + assetValue,
    0
  );

export const updatePortfolio = (
  portfolio: Portfolio,
  change: Change
): Portfolio =>
  Object.entries(change).reduce<Portfolio>(
    (result, [asset, changeValue]) => {
      if (portfolio[asset] !== undefined) {
        result[asset] = portfolio[asset] * (1 + changeValue);
      }
      return result;
    },
    { ...portfolio }
  );

export const rebalance = (
  portfolio: Portfolio,
  allocation: Allocation
): Portfolio => createPortfolio(getPortfolioValue(portfolio), allocation);
