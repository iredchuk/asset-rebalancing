import { product, sum, avg, stdev } from "./stat";

describe("stat", () => {
  describe("sum", () => {
    test("empty array", () => {
      const actual = sum([]);
      expect(actual).toBe(0);
    });

    test("one item array", () => {
      const actual = sum([17]);
      expect(actual).toBe(17);
    });

    test("several items array", () => {
      const actual = sum([-1, 2, 0, 1.5]);
      expect(actual).toBeCloseTo(2.5, 0);
    });
  });

  describe("product", () => {
    test("empty array", () => {
      const actual = product([]);
      expect(actual).toBe(1);
    });

    test("one item array", () => {
      const actual = product([100]);
      expect(actual).toBe(100);
    });

    test("several items array", () => {
      const actual = product([0.5, -1, -2, 3, -2.5]);
      expect(actual).toBeCloseTo(-7.5, 0);
    });
  });

  describe("avg", () => {
    test("empty array - throws", () => {
      expect(() => avg([])).toThrow();
    });

    test("one item array", () => {
      const actual = avg([-31]);
      expect(actual).toBe(-31);
    });

    test("several items array", () => {
      const actual = avg([1, -10, 17, 4]);
      expect(actual).toBeCloseTo(3, 0);
    });
  });

  describe("stdev", () => {
    test("empty array - throws", () => {
      expect(() => stdev([])).toThrow();
    });

    test("one item array - throws", () => {
      expect(() => stdev([1])).toThrow();
    });

    test("same items array", () => {
      const actual = stdev([5, 5, 5, 5, 5]);
      expect(actual).toBeCloseTo(0, 0);
    });

    test("different items array", () => {
      const actual = stdev([0.91, 0.1, -0.9, 0.55, -0.2]);
      expect(actual).toBeCloseTo(0.7, 0);
    });
  });
});
