import { iterateOverArrays } from "./iterate-over-arrays";

describe("iterate-over-arrays", () => {
  test("with one array", () => {
    const visited: string[] = [];

    const arrays: string[][] = [["1", "2", "3"]];

    iterateOverArrays(arrays, (items) => visited.push(items[0]));

    expect(visited).toEqual(["1", "2", "3"]);
  });

  test("with two arrays", () => {
    const visited: string[] = [];

    const arrays: string[][] = [
      ["1", "2", "3", "4"],
      ["A", "B"],
    ];

    iterateOverArrays(arrays, (items) => visited.push(items.join("")));

    expect(visited).toEqual(["1A", "2A", "3A", "4A", "1B", "2B", "3B", "4B"]);
  });

  test("with multiple arrays of different length", () => {
    const visited: string[] = [];

    const arrays: string[][] = [["1", "2", "3"], ["A", "B"], ["-"], ["x", "y"]];

    iterateOverArrays(arrays, (items) => visited.push(items.join("")));

    expect(visited).toEqual([
      "1A-x",
      "2A-x",
      "3A-x",
      "1B-x",
      "2B-x",
      "3B-x",
      "1A-y",
      "2A-y",
      "3A-y",
      "1B-y",
      "2B-y",
      "3B-y",
    ]);
  });

  test("empty arrays are ignored", () => {
    const visited: string[] = [];

    const arrays: string[][] = [["1", "2"], [], [], ["A", "B"], []];

    iterateOverArrays(arrays, (items) => visited.push(items.join("")));

    expect(visited).toEqual(["1A", "2A", "1B", "2B"]);
  });
});
