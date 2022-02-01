import { backTestAllocation, backTestAllocationCombinations } from "./backtest";
import { createAllocation } from "./portfolio";
import { byPortfolioValue } from "./result-comparers";

describe("backtest", () => {
  describe("backTestAllocation", () => {
    test("with one asset always increasing", () => {
      const initialValue = 1000;
      const minAcceptedReturn = 0;

      const allocation = createAllocation({
        stocks: 1,
        bonds: 0,
      });

      const changes = [
        { stocks: 0.5, bonds: 0.3 },
        { stocks: 0, bonds: 0.1 },
        { stocks: 0.3, bonds: -0.5 },
        { stocks: 0.4, bonds: 0.4 },
      ];

      const actual = backTestAllocation({
        initialValue,
        allocation,
        changes,
        minAcceptedReturn,
      });

      expect(actual).toStrictEqual({
        portfolioValue: expect.any(Number),
        sortinoRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.portfolioValue).toBe(2730);
      expect(actual.sortinoRatio).toBeCloseTo(43.25, 2);
      expect(actual.allocation).toEqual(allocation);
    });

    test("with multiple assets", () => {
      const initialValue = 1000;
      const minAcceptedReturn = 0.05;

      const allocation = createAllocation({
        stocks: 0.7,
        cash: 0.3,
      });

      const changes = [
        { stocks: 0.5, cash: -0.1 },
        { stocks: -0.2, cash: 0 },
        { stocks: 0.3, cash: -0.1 },
      ];

      const actual = backTestAllocation({
        initialValue,
        allocation,
        changes,
        minAcceptedReturn,
      });

      expect(actual).toStrictEqual({
        portfolioValue: expect.any(Number),
        sortinoRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.portfolioValue).toBeCloseTo(1340, 0);
      expect(actual.sortinoRatio).toBeCloseTo(1.03, 2);
      expect(actual.allocation).toEqual(allocation);
    });
  });

  describe("backTestAllocationCombinations", () => {
    test("with two equal assets and 1 result", () => {
      const initialValue = 1000;
      const minAcceptedReturn = 0.05;

      const allocationCombinations = {
        stocks: [0, 0.3, 0.5, 0.7, 1],
        bonds: [0, 0.3, 0.5, 0.7, 1],
        cash: [0, 0.1, 0.2, 0.3],
      };

      const changes = [
        {
          stocks: 0.5,
          bonds: -0.2,
          cash: -0.1,
        },
        {
          stocks: -0.3,
          bonds: 0.1,
          cash: 0,
        },
        {
          stocks: 0.1,
          bonds: 0.3,
          cash: -0.1,
        },
      ];

      const actual = backTestAllocationCombinations({
        initialValue,
        allocationCombinations,
        changes,
        minAcceptedReturn,
        resultsLimit: 1,
        resultsComparer: byPortfolioValue,
      });

      expect(actual).toStrictEqual([
        {
          portfolioValue: expect.any(Number),
          sortinoRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].portfolioValue).toBeCloseTo(1242, 0);
      expect(actual[0].sortinoRatio).toBeCloseTo(0.93, 2);
      expect(actual[0].allocation).toEqual({
        stocks: 0.5,
        bonds: 0.5,
        cash: 0,
      });
    });

    test("with one much better asset and 3 results", () => {
      const initialValue = 1000;
      const minAcceptedReturn = 0.05;

      const allocationCombinations = {
        stocks: [0, 0.2, 0.5, 0.8, 1],
        cash: [0, 0.2, 0.5, 0.8, 1],
      };

      const changes = [
        {
          stocks: 0.65,
          cash: -0.1,
        },
        {
          stocks: -0.1,
          cash: -0.1,
        },
        {
          stocks: 0.4,
          cash: -0.1,
        },
        {
          stocks: -0.1,
          cash: 0,
        },
      ];

      const actual = backTestAllocationCombinations({
        initialValue,
        allocationCombinations,
        changes,
        minAcceptedReturn,
        resultsLimit: 3,
        resultsComparer: byPortfolioValue,
      });

      expect(actual).toStrictEqual([
        {
          portfolioValue: expect.any(Number),
          sortinoRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          portfolioValue: expect.any(Number),
          sortinoRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          portfolioValue: expect.any(Number),
          sortinoRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].portfolioValue).toBeCloseTo(1871, 0);
      expect(actual[0].sortinoRatio).toBeCloseTo(2.51, 2);
      expect(actual[0].allocation).toEqual({
        stocks: 1,
        cash: 0,
      });

      expect(actual[1].portfolioValue).toBeCloseTo(1615, 0);
      expect(actual[1].sortinoRatio).toBeCloseTo(1.89, 2);
      expect(actual[1].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.cash
      );

      expect(actual[2].portfolioValue).toBeCloseTo(1254, 0);
      expect(actual[2].sortinoRatio).toBeCloseTo(0.845, 3);
      expect(actual[2].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.cash
      );

      expect(actual[0].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.stocks
      );

      expect(actual[1].allocation!.stocks).toBeGreaterThan(
        actual[2].allocation!.stocks
      );
    });
  });
});
