import { backTestAllocation, backTestAllocationCombinations } from "./backtest";
import { createAllocation } from "./portfolio";
import { byEndValue } from "./result-comparers";

describe("backtest", () => {
  describe("backTestAllocation", () => {
    test("with one asset", () => {
      const initialValue = 1000;

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

      const actual = backTestAllocation({ initialValue, allocation, changes });

      expect(actual).toStrictEqual({
        endValue: expect.any(Number),
        valueRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.endValue).toBe(2730);
      expect(actual.valueRatio).toBe(2.73);
      expect(actual.allocation).toEqual(allocation);
    });

    test("with multiple assets", () => {
      const initialValue = 1000;

      const allocation = createAllocation({
        stocks: 0.7,
        cash: 0.3,
      });

      const changes = [
        { stocks: 0.5, cash: -0.1 },
        { stocks: -0.2, cash: 0 },
        { stocks: 0.3, cash: -0.1 },
      ];

      const actual = backTestAllocation({ initialValue, allocation, changes });

      expect(actual).toStrictEqual({
        endValue: expect.any(Number),
        valueRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.endValue).toBeCloseTo(1340, 0);
      expect(actual.valueRatio).toBeCloseTo(1.34, 2);
      expect(actual.allocation).toEqual(allocation);
    });
  });

  describe("backTestAllocationCombinations", () => {
    test("with two equal assets and 1 result", () => {
      const initialValue = 1000;

      const allocationCombinations = {
        stocks: [0.1, 0.3, 0.7, 1],
        bonds: [0, 0.3, 0.7, 1],
        cash: [0, 0.1, 0.2],
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
        resultsLimit: 1,
        resultsComparer: byEndValue,
      });

      expect(actual).toStrictEqual([
        {
          endValue: expect.any(Number),
          valueRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].endValue).toBeCloseTo(1242, 0);
      expect(actual[0].valueRatio).toBeCloseTo(1.242, 3);
      expect(actual[0].allocation).toEqual({
        stocks: 0.5,
        bonds: 0.5,
        cash: 0,
      });
    });

    test("with one much better asset and 3 results", () => {
      const initialValue = 1000;

      const allocationCombinations = {
        stocks: [0.2, 0.5, 0.8],
        cash: [0.2, 0.5, 0.8],
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
        resultsLimit: 3,
        resultsComparer: byEndValue,
      });

      expect(actual).toStrictEqual([
        {
          endValue: expect.any(Number),
          valueRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          endValue: expect.any(Number),
          valueRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          endValue: expect.any(Number),
          valueRatio: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].endValue).toBeCloseTo(1615, 0);
      expect(actual[0].valueRatio).toBeCloseTo(1.615, 3);
      expect(actual[0].allocation).toEqual({
        stocks: 0.8,
        cash: 0.2,
      });

      expect(actual[1].endValue).toBeCloseTo(1508, 0);
      expect(actual[1].valueRatio).toBeCloseTo(1.508, 3);
      expect(actual[1].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.cash
      );

      expect(actual[2].endValue).toBeCloseTo(1389, 0);
      expect(actual[2].valueRatio).toBeCloseTo(1.389, 3);
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
