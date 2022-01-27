import { pushSortedCapped } from "./push-sorted-capped";

describe("push-sorted-capped", () => {
  test("with limit 1 updates correctly", () => {
    const array: string[] = [];
    const compare = (s1: string, s2: string) => s2.length - s1.length;

    pushSortedCapped(array, "123", 1, compare);
    expect(array).toStrictEqual(["123"]);

    pushSortedCapped(array, "1", 1, compare);
    expect(array).toStrictEqual(["123"]);

    pushSortedCapped(array, "12", 1, compare);
    expect(array).toStrictEqual(["123"]);

    pushSortedCapped(array, "12345", 1, compare);
    expect(array).toStrictEqual(["12345"]);

    pushSortedCapped(array, "1234", 1, compare);
    expect(array).toStrictEqual(["12345"]);
  });

  test("with limit 3 updates correctly", () => {
    const array: string[] = [];
    const compare = (s1: string, s2: string) => s2.length - s1.length;

    pushSortedCapped(array, "1", 3, compare);
    expect(array).toStrictEqual(["1"]);

    pushSortedCapped(array, "123", 3, compare);
    expect(array).toStrictEqual(["123", "1"]);

    pushSortedCapped(array, "12", 3, compare);
    expect(array).toStrictEqual(["123", "12", "1"]);

    pushSortedCapped(array, "12345", 3, compare);
    expect(array).toStrictEqual(["12345", "123", "12"]);

    pushSortedCapped(array, "1", 3, compare);
    expect(array).toStrictEqual(["12345", "123", "12"]);

    pushSortedCapped(array, "1234", 3, compare);
    expect(array).toStrictEqual(["12345", "1234", "123"]);
  });
});
