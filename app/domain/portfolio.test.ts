import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  createAllocation,
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

describe("portfolio", () => {
  describe("createAllocation", () => {
    test("with normalized values", () => {
      const actual = createAllocation({ stocks: 0.5, bonds: 0.2, cash: 0.3 });

      assert.deepEqual(actual, {
        stocks: 0.5,
        bonds: 0.2,
        cash: 0.3,
      });
    });

    test("with non-normalized values", () => {
      const actual = createAllocation({
        stocks: 80,
        bonds: 50,
        cash: 70,
        nothing: 0,
      });

      assert.deepEqual(actual, {
        stocks: 0.4,
        bonds: 0.25,
        cash: 0.35,
        nothing: 0,
      });
    });
  });

  describe("createPortfolio", () => {
    test("with value and allocation", () => {
      const actual = createPortfolio(
        1000,
        createAllocation({
          gold: 0.65,
          silver: 0.25,
          platinum: 0.1,
        }),
      );

      assert.deepEqual(actual, {
        gold: 650,
        silver: 250,
        platinum: 100,
      });
    });
  });

  describe("getPortfolioValue", () => {
    test("equals to value portfolio created with", () => {
      const portfolio = createPortfolio(
        1200,
        createAllocation({
          gold: 0.65,
          silver: 0.25,
          platinum: 0.1,
        }),
      );

      const actual = getPortfolioValue(portfolio);

      assert.equal(actual, 1200);
    });
  });

  describe("updatePortfolio", () => {
    test("when all asset changes specified", () => {
      const portfolio = createPortfolio(
        1000,
        createAllocation({
          gold: 0.5,
          silver: 0.3,
          platinum: 0.2,
        }),
      );

      const change = {
        gold: 0.3,
        silver: 0,
        platinum: -0.2,
      };

      const actual = updatePortfolio(portfolio, change);

      assert.notEqual(portfolio, actual);

      assert.deepEqual(actual, {
        gold: 650,
        silver: 300,
        platinum: 160,
      });

      assert.equal(getPortfolioValue(actual), 1110);
    });

    test("when some changes not specified and some non-related changes", () => {
      const portfolio = createPortfolio(
        1000,
        createAllocation({
          gold: 0.5,
          silver: 0.3,
          platinum: 0.2,
        }),
      );

      const change = {
        gold: 0.3,
        platinum: -0.2,
        crypto: 2.5,
      };

      const actual = updatePortfolio(portfolio, change);

      assert.notEqual(portfolio, actual);

      assert.deepEqual(actual, {
        gold: 650,
        silver: 300,
        platinum: 160,
      });

      assert.equal(getPortfolioValue(actual), 1110);
    });
  });

  describe("rebalance", () => {
    test("rebalances according to allocation", () => {
      const portfolio = createPortfolio(
        1000,
        createAllocation({
          cash: 0.5,
          gold: 0.3,
          silver: 0.2,
        }),
      );

      const allocation = createAllocation({
        cash: 0.1,
        gold: 0.6,
        silver: 0.3,
      });

      const actual = rebalance(portfolio, allocation);

      assert.notEqual(portfolio, actual);
      assert.equal(getPortfolioValue(actual), 1000);
      assert.equal(actual["gold"] / actual["silver"], 2);
      assert.equal(actual["gold"] / actual["cash"], 6);
    });
  });
});
