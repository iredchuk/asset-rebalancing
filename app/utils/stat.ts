import assert from "assert";

export const sum = (array: number[]): number =>
  array.reduce((result, num) => result + num, 0);

export const product = (array: number[]): number =>
  array.reduce((result, num) => result * num, 1);

export const avg = (array: number[]): number => {
  assert(array.length > 0, "Cannot calculate average for empty array");
  return sum(array) / array.length;
};
