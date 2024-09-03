import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createArrayFromLimits } from "./arrays";

describe("arrays", () => {
  describe("createArrayFromLimits", () => {
    test("when step covers all limits", () => {
      const actual = createArrayFromLimits({ min: 0, max: 10, step: 2 });
      assert.deepEqual(actual, [0, 2, 4, 6, 8, 10]);
    });

    test("when step does not cover upper limit", () => {
      const actual = createArrayFromLimits({ min: 0, max: 40, step: 15 });
      assert.deepEqual(actual, [0, 15, 30]);
    });

    test("when max is not greater than min includes only max", () => {
      const actual = createArrayFromLimits({ min: 0, max: 0, step: 0 });
      assert.deepEqual(actual, [0]);
    });
  });
});
