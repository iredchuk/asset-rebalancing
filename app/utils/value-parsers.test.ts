import { parsePercentValue } from "./value-parsers";

describe("value-parsers", () => {
  test("parsePercentValue as integer without space", () => {
    const actual = parsePercentValue("23%");
    expect(actual).toBe(0.23);
  });

  test("parsePercentValue as float with space", () => {
    const actual = parsePercentValue("17.89 %");
    expect(actual).toBe(0.1789);
  });
});
