import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { avg, product, rootMeanSquare, sum } from "./stat";
import { roundToDecimals } from "./test-utils";

describe("stat", () => {
  describe("sum", () => {
    test("empty array", () => {
      const actual = sum([]);
      assert.equal(actual, 0);
    });

    test("one item array", () => {
      const actual = sum([17]);
      assert.equal(actual, 17);
    });

    test("several items array", () => {
      const actual = sum([-1, 2, 0, 1.5]);
      assert.equal(actual, 2.5);
    });
  });

  describe("product", () => {
    test("empty array", () => {
      const actual = product([]);
      assert.equal(actual, 1);
    });

    test("one item array", () => {
      const actual = product([100]);
      assert.equal(actual, 100);
    });

    test("several items array", () => {
      const actual = product([0.5, -1, -2, 3, -2.5]);
      assert.equal(actual, -7.5);
    });
  });

  describe("avg", () => {
    test("empty array - throws", () => {
      assert.throws(() => avg([]));
    });

    test("one item array", () => {
      const actual = avg([-31]);
      assert.equal(actual, -31);
    });

    test("several items array", () => {
      const actual = avg([1, -10, 17, 4]);
      assert.equal(actual, 3);
    });
  });

  describe("rootMeanSquare", () => {
    test("empty array - throws", () => {
      assert.throws(() => rootMeanSquare([]));
    });

    test("one item array", () => {
      const actual = rootMeanSquare([17]);
      assert.equal(actual, 17);
    });

    test("several items array", () => {
      const actual = rootMeanSquare([4, 0, 3, 7]);
      assert.equal(roundToDecimals(actual, 4), 4.3012);
    });
  });
});
