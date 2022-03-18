import { parseData } from "./parse-data";

describe("parse-data", () => {
  test("with data rows parses values from specified keys", () => {
    const actual = parseData(
      [
        {
          keyA: 10,
          keyB: 11,
          extra1: 100,
        },
        {
          keyA: 20,
          keyB: 21,
          extra2: 1000,
        },
      ],
      ["keyA", "keyB"],
    );

    expect(actual).toEqual([
      { keyA: 0.1, keyB: 0.11 },
      { keyA: 0.2, keyB: 0.21 },
    ]);
  });
});
