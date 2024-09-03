import { backTestAllocation, backTestAllocationCombinations } from "./backtest";
import { createAllocation } from "./portfolio";

describe("backtest", () => {
  describe("backTestAllocation", () => {
    test("with one asset", () => {
      const allocation = createAllocation({
        stocks: 1,
        bonds: 0,
      });

      const changes = [
        { stocks: 0.5, bonds: 0.3 },
        { stocks: -0.1, bonds: 0.1 },
        { stocks: 0.3, bonds: -0.5 },
        { stocks: -0.2, bonds: 0.4 },
      ];

      const actual = backTestAllocation({
        allocation,
        changes,
      });

      expect(actual).toStrictEqual({
        totalReturn: expect.any(Number),
        averageReturn: expect.any(Number),
        maxDrawdown: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.totalReturn).toBeCloseTo(0.404, 3);
      expect(actual.averageReturn).toBeCloseTo(0.0885, 4);
      expect(actual.maxDrawdown).toBeCloseTo(0.2, 4);
      expect(actual.allocation).toEqual(allocation);
    });

    test("with multiple assets", () => {
      const allocation = createAllocation({
        stocks: 0.5,
        bonds: 0.3,
        cash: 0.2,
      });

      const changes = [
        { stocks: 0.5, bonds: 0.1, cash: -0.1 },
        { stocks: -0.2, bonds: 0.2, cash: 0 },
        { stocks: 0.3, bonds: 0.1, cash: -0.1 },
      ];

      const actual = backTestAllocation({
        allocation,
        changes,
      });

      expect(actual).toStrictEqual({
        totalReturn: expect.any(Number),
        averageReturn: expect.any(Number),
        maxDrawdown: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.totalReturn).toBeCloseTo(0.403, 3);
      expect(actual.averageReturn).toBeCloseTo(0.1195, 4);
      expect(actual.maxDrawdown).toBeCloseTo(0.04, 4);
      expect(actual.allocation).toEqual(allocation);
    });

    test("with losing portfolio and zero drawdown deviation", () => {
      const allocation = createAllocation({
        usd: 0.5,
        eur: 0.5,
      });

      const changes = [
        { usd: -0.1, eur: 0 },
        { usd: 0, eur: -0.1 },
        { usd: -0.1, eur: 0 },
        { usd: 0, eur: -0.1 },
      ];

      const actual = backTestAllocation({
        allocation,
        changes,
      });

      expect(actual).toStrictEqual({
        totalReturn: expect.any(Number),
        averageReturn: expect.any(Number),
        maxDrawdown: expect.any(Number),
        allocation: expect.any(Object),
      });

      expect(actual.totalReturn).toBeCloseTo(-0.185, 3);
      expect(actual.averageReturn).toBeCloseTo(-0.05, 4);
      expect(actual.maxDrawdown).toBeCloseTo(0.1855, 4);
      expect(actual.allocation).toEqual(allocation);
    });
  });

  describe("backTestAllocationCombinations", () => {
    test("with two equal assets and 1 result by total return", () => {
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
        allocationCombinations,
        changes,
        resultsLimit: 1,
        sortByDesc: (r) => r.totalReturn,
      });

      expect(actual).toStrictEqual([
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].totalReturn).toBeCloseTo(0.242, 3);
      expect(actual[0].averageReturn).toBeCloseTo(0.0749, 4);
      expect(actual[0].maxDrawdown).toBeCloseTo(0.1, 4);
      expect(actual[0].allocation).toEqual({
        stocks: 0.5,
        bonds: 0.5,
        cash: 0,
      });
    });

    test("with one much better asset and 3 results by portfolio value", () => {
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
        allocationCombinations,
        changes,
        resultsLimit: 3,
        sortByDesc: (r) => r.totalReturn,
      });

      expect(actual).toStrictEqual([
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].totalReturn).toBeCloseTo(0.871, 3);
      expect(actual[0].averageReturn).toBeCloseTo(0.17, 3);
      expect(actual[0].maxDrawdown).toBeCloseTo(0.1, 4);
      expect(actual[0].allocation).toEqual({
        stocks: 1,
        cash: 0,
      });

      expect(actual[1].totalReturn).toBeCloseTo(0.615, 3);
      expect(actual[1].averageReturn).toBeCloseTo(0.127, 3);
      expect(actual[1].maxDrawdown).toBeCloseTo(0.1, 4);
      expect(actual[1].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.cash,
      );

      expect(actual[2].totalReturn).toBeCloseTo(0.254, 3);
      expect(actual[2].averageReturn).toBeCloseTo(0.058, 3);
      expect(actual[2].maxDrawdown).toBeCloseTo(0.1, 4);
      expect(actual[2].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.cash,
      );

      expect(actual[0].allocation!.stocks).toBeGreaterThan(
        actual[1].allocation!.stocks,
      );

      expect(actual[1].allocation!.stocks).toBeGreaterThan(
        actual[2].allocation!.stocks,
      );
    });

    test("with almost equal assets and 2 results by total return", () => {
      const allocationCombinations = {
        bonds: [0, 0.5, 1],
        gold: [0, 0.5, 1],
      };

      const changes = [
        {
          bonds: 0.4,
          gold: -0.5,
        },
        {
          bonds: -0.5,
          gold: 0.4,
        },
        {
          bonds: 0.2,
          gold: 0.21,
        },
      ];

      const actual = backTestAllocationCombinations({
        allocationCombinations,
        changes,
        resultsLimit: 2,
        sortByDesc: (r) => r.totalReturn,
      });

      expect(actual).toStrictEqual([
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].totalReturn).toBeCloseTo(0.088, 3);
      expect(actual[0].averageReturn).toBeCloseTo(0.028, 3);
      expect(actual[0].maxDrawdown).toBeCloseTo(0.0975, 4);
      expect(actual[0].allocation).toEqual({
        bonds: 0.5,
        gold: 0.5,
      });

      expect(actual[1].totalReturn).toBeCloseTo(-0.153, 3);
      expect(actual[1].averageReturn).toBeCloseTo(-0.054, 3);
      expect(actual[1].maxDrawdown).toBeCloseTo(0.5, 4);
      expect(actual[1].allocation).toEqual({
        bonds: 0,
        gold: 1,
      });
    });

    test("with filter by max. drawdown and sort by total return", () => {
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
        allocationCombinations,
        changes,
        resultsLimit: 2,
        sortByDesc: (r) => r.totalReturn,
        filter: (r) => r.maxDrawdown < 0.03,
      });

      expect(actual).toHaveLength(1);

      expect(actual).toStrictEqual([
        {
          totalReturn: expect.any(Number),
          averageReturn: expect.any(Number),
          maxDrawdown: expect.any(Number),
          allocation: expect.any(Object),
        },
      ]);

      expect(actual[0].totalReturn).toBeCloseTo(0.227, 3);
      expect(actual[0].averageReturn).toBeCloseTo(0.071, 3);
      expect(actual[0].maxDrawdown).toBeCloseTo(0.02, 4);
      expect(actual[0].allocation).toEqual({
        stocks: 0.3,
        bonds: 0.7,
        cash: 0,
      });
    });
  });
});
