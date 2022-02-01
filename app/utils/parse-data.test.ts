import { parseData } from "./parse-data";

describe("parse-data", () => {
  test("with data rows parses values from specified keys", () => {
    const valueParser = (str: string) => parseInt(str, 10);

    const actual = parseData(
      [
        {
          keyA: "10",
          keyB: "11",
          extra1: "100",
        },
        {
          keyA: "20",
          keyB: "21",
          extra2: "1000",
        },
      ],
      ["keyA", "keyB"],
      valueParser
    );

    expect(actual).toEqual([
      { keyA: 10, keyB: 11 },
      { keyA: 20, keyB: 21 },
    ]);
  });
});
