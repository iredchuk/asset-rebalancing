import { backTestAllocation, backTestAllocationCombinations } from "./backtest";
import { createAllocation } from "./portfolio";

describe("backtest", () => {
  describe("backTestAllocation", () => {
    test("with one asset", () => {
      const initialValue = 1000;

      const allocation = createAllocation({
        stocks: 1,
      });

      const changes = [
        { stocks: 0.2 },
        { stocks: 0.2 },
        { stocks: 0.2 },
        { stocks: 0.2 },
      ];

      const actual = backTestAllocation(initialValue, allocation, changes);

      expect(actual).toStrictEqual({
        endValue: expect.any(Number),
        valueRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.endValue).toBe(2073.6);
      expect(actual.valueRatio).toBe(2.0736);
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

      const actual = backTestAllocation(initialValue, allocation, changes);

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
    test("with two equal assets", () => {
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

      const actual = backTestAllocationCombinations(
        initialValue,
        allocationCombinations,
        changes
      );

      expect(actual).toStrictEqual({
        endValue: expect.any(Number),
        valueRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.endValue).toBeCloseTo(1242, 0);
      expect(actual.valueRatio).toBeCloseTo(1.242, 3);
      expect(actual.allocation).toEqual({
        values: {
          stocks: 0.5,
          bonds: 0.5,
          cash: 0,
        },
      });
    });

    test("with one much better asset", () => {
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

      const actual = backTestAllocationCombinations(
        initialValue,
        allocationCombinations,
        changes
      );

      expect(actual).toStrictEqual({
        endValue: expect.any(Number),
        valueRatio: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.endValue).toBeCloseTo(1615, 0);
      expect(actual.valueRatio).toBeCloseTo(1.615, 3);
      expect(actual.allocation).toEqual({
        values: {
          stocks: 0.8,
          cash: 0.2,
        },
      });
    });
  });
});
