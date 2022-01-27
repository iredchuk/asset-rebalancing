import { BackTestResult } from "./backtest";

export const byEndValue = (a: BackTestResult, b: BackTestResult): number =>
  Math.sign(b.endValue - a.endValue);
