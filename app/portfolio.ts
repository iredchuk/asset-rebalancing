import assert from "assert";

export type Portfolio = Record<string, number>;

export type Change = Record<string, number>;

export type Allocation = Record<string, number>;

export const getRecordTotal = (record: Record<string, number>): number =>
  Object.values(record).reduce((result, value) => result + value, 0);

export const createAllocation = (
  rawValues: Record<string, number>
): Allocation => {
  const total = getRecordTotal(rawValues);
  assert(total > 0, "Allocation total must be greater than 0");
  return Object.entries(rawValues).reduce<Record<string, number>>(
    (result, [asset, value]) => ({ ...result, [asset]: value / total }),
    {}
  );
};

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
  getRecordTotal(portfolio);

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
