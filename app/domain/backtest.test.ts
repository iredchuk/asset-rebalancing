import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { roundToDecimals } from "../utils/test-utils";
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

      assert.equal(roundToDecimals(actual.totalReturn, 3), 0.404);
      assert.equal(roundToDecimals(actual.averageReturn, 4), 0.0885);
      assert.equal(roundToDecimals(actual.maxDrawdown, 4), 0.2);

      assert.deepEqual(actual.allocation, allocation);
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

      assert.equal(roundToDecimals(actual.totalReturn, 3), 0.403);
      assert.equal(roundToDecimals(actual.averageReturn, 4), 0.1195);
      assert.equal(roundToDecimals(actual.maxDrawdown, 4), 0.04);

      assert.deepEqual(actual.allocation, allocation);
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

      assert.equal(roundToDecimals(actual.totalReturn, 3), -0.185);
      assert.equal(roundToDecimals(actual.averageReturn, 3), -0.05);
      assert.equal(roundToDecimals(actual.maxDrawdown, 4), 0.1855);

      assert.deepEqual(actual.allocation, allocation);
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

      assert.equal(actual.length, 1);

      assert.equal(roundToDecimals(actual[0].totalReturn, 3), 0.242);
      assert.equal(roundToDecimals(actual[0].averageReturn, 4), 0.0749);
      assert.equal(roundToDecimals(actual[0].maxDrawdown, 4), 0.1);

      assert.deepEqual(actual[0].allocation, {
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

      assert.equal(actual.length, 3);

      assert.equal(roundToDecimals(actual[0].totalReturn, 3), 0.871);
      assert.equal(roundToDecimals(actual[0].averageReturn, 3), 0.17);
      assert.equal(roundToDecimals(actual[0].maxDrawdown, 4), 0.1);

      assert.deepEqual(actual[0].allocation, {
        stocks: 1,
        cash: 0,
      });

      assert.equal(roundToDecimals(actual[1].totalReturn, 3), 0.615);
      assert.equal(roundToDecimals(actual[1].averageReturn, 3), 0.127);
      assert.equal(roundToDecimals(actual[1].maxDrawdown, 4), 0.1);

      assert(actual[1].allocation!.stocks! > actual[1].allocation!.cash!);

      assert.equal(roundToDecimals(actual[2].totalReturn, 3), 0.254);
      assert.equal(roundToDecimals(actual[2].averageReturn, 3), 0.058);
      assert.equal(roundToDecimals(actual[2].maxDrawdown, 4), 0.1);

      assert(actual[1].allocation!.stocks! > actual[1].allocation!.cash!);
      assert(actual[0].allocation!.stocks! > actual[1].allocation!.cash!);
      assert(actual[1].allocation!.stocks! > actual[2].allocation!.cash!);
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

      assert.equal(actual.length, 2);

      assert.equal(roundToDecimals(actual[0].totalReturn, 3), 0.088);
      assert.equal(roundToDecimals(actual[0].averageReturn, 3), 0.028);
      assert.equal(roundToDecimals(actual[0].maxDrawdown, 4), 0.0975);

      assert.deepEqual(actual[0].allocation, {
        bonds: 0.5,
        gold: 0.5,
      });

      assert.equal(roundToDecimals(actual[1].totalReturn, 3), -0.153);
      assert.equal(roundToDecimals(actual[1].averageReturn, 3), -0.054);
      assert.equal(roundToDecimals(actual[1].maxDrawdown, 4), 0.5);

      assert.deepEqual(actual[1].allocation, {
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

      assert.equal(actual.length, 1);

      assert.equal(roundToDecimals(actual[0].totalReturn, 3), 0.227);
      assert.equal(roundToDecimals(actual[0].averageReturn, 3), 0.071);
      assert.equal(roundToDecimals(actual[0].maxDrawdown, 4), 0.02);

      assert.deepEqual(actual[0].allocation, {
        stocks: 0.3,
        bonds: 0.7,
        cash: 0,
      });
    });
  });
});
