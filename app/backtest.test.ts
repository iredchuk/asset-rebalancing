import { backTestAllocation } from "./backtest";
import { createAllocation } from "./portfolio";

describe("backtest", () => {
  test("backTestAllocation", () => {
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

    expect(actual).toEqual({
      endValue: expect.any(Number),
      valueRatio: expect.any(Number),
      allocation: expect.any(Object),
    });

    expect(actual.endValue).toBeCloseTo(1340, 0);
    expect(actual.valueRatio).toBeCloseTo(1.34, 2);
    expect(actual.allocation).toEqual(allocation);
  });

  test("backTestAllocationCombinations", () => {
    // TODO
  });
});
