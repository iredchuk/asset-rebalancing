import {
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

describe("portfolio", () => {
  describe("createPortfolio", () => {
    test("with value and allocation", () => {
      const actual = createPortfolio(1000, {
        gold: 0.65,
        silver: 0.25,
        platinum: 0.1,
      });

      expect(actual).toEqual({
        gold: 650,
        silver: 250,
        platinum: 100,
      });
    });
  });

  describe("getPortfolioValue", () => {
    test("equals to value portfolio created with", () => {
      const portfolio = createPortfolio(1200, {
        gold: 0.65,
        silver: 0.25,
        platinum: 0.1,
      });

      const actual = getPortfolioValue(portfolio);

      expect(actual).toBe(1200);
    });
  });

  describe("updatePortfolio", () => {
    test("when all asset changes specified", () => {
      const portfolio = createPortfolio(1000, {
        gold: 0.5,
        silver: 0.3,
        platinum: 0.2,
      });

      const change = {
        gold: 0.3,
        silver: 0,
        platinum: -0.2,
      };

      const actual = updatePortfolio(portfolio, change);

      expect(actual).not.toBe(portfolio);

      expect(actual).toEqual({
        gold: 650,
        silver: 300,
        platinum: 160,
      });

      expect(getPortfolioValue(actual)).toBe(1110);
    });

    test("when some changes not specified and some non-related changes", () => {
      const portfolio = createPortfolio(1000, {
        gold: 0.5,
        silver: 0.3,
        platinum: 0.2,
      });

      const change = {
        gold: 0.3,
        platinum: -0.2,
        crypto: 2.5,
      };

      const actual = updatePortfolio(portfolio, change);

      expect(actual).not.toBe(portfolio);

      expect(actual).toEqual({
        gold: 650,
        silver: 300,
        platinum: 160,
      });

      expect(getPortfolioValue(actual)).toBe(1110);
    });
  });

  describe("rebalance", () => {
    test("rebalances according to allocation", () => {
      const portfolio = createPortfolio(1000, {
        cash: 0.5,
        gold: 0.3,
        silver: 0.2,
      });

      const allocation = { cash: 0.1, gold: 0.6, silver: 0.3 };

      const actual = rebalance(portfolio, allocation);

      expect(actual).not.toBe(portfolio);

      expect(getPortfolioValue(actual)).toBe(1000);

      expect(actual["gold"] / actual["silver"]).toBe(2);

      expect(actual["gold"] / actual["cash"]).toBe(6);
    });
  });
});
