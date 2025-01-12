import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BackTestResult } from "../domain/backtest";
import { createBackTestParams, DataRow, ParamsFile } from "./parse-params";

describe("parse-params", () => {
  test("with valid params", () => {
    const dataRows: DataRow[] = [
      {
        year: "2021",
        assetA: 10,
        assetB: 11,
        assetC: -5,
      },
      {
        year: "2022",
        assetA: 0,
        assetB: -20,
        assetC: -10,
      },
      {
        year: "2022",
        assetA: 10,
        assetB: 35,
        assetC: -20,
      },
    ];

    const params: ParamsFile = {
      sortBy: "Return",
      resultsLimit: 5,
      allocationLimits: {
        assetA: { min: 0, max: 0.5, step: 0.1 },
        assetB: { min: 0.5, max: 1, step: 0.2 },
        assetC: { min: 0, max: 0, step: 0 },
      },
    };

    const actual = createBackTestParams(dataRows, params);

    assert(actual);

    assert.equal(actual.resultsLimit, 5);

    assert.equal(
      actual.sortByDesc({ averageReturn: 120 } as BackTestResult),
      120,
    );

    assert.deepEqual(Object.keys(actual), [
      "allocationCombinations",
      "changes",
      "resultsLimit",
      "sortByDesc",
    ]);

    assert.deepEqual(actual.allocationCombinations, {
      assetA: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      assetB: [0.5, 0.7, 0.9],
      assetC: [0],
    });
  });
});
