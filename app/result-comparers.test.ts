import { BackTestResult } from "./backtest";
import { byEndValue } from "./result-comparers";

describe("result-comparers", () => {
  test("byEndValue", () => {
    const results: BackTestResult[] = [
      {
        endValue: 120,
        valueRatio: 1.2,
      },
      {
        endValue: 150,
        valueRatio: 1.5,
      },
      {
        endValue: 140,
        valueRatio: 1.4,
      },
      {
        endValue: 130,
        valueRatio: 1.3,
      },
    ];

    results.sort(byEndValue);

    expect(results).toStrictEqual([
      {
        endValue: 150,
        valueRatio: 1.5,
      },
      {
        endValue: 140,
        valueRatio: 1.4,
      },
      {
        endValue: 130,
        valueRatio: 1.3,
      },
      {
        endValue: 120,
        valueRatio: 1.2,
      },
    ]);
  });
});
