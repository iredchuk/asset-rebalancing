import assert from "assert";

export const sum = (array: number[]): number =>
  array.reduce((result, num) => result + num, 0);

export const product = (array: number[]): number =>
  array.reduce((result, num) => result * num, 1);

export const avg = (array: number[]): number => {
  assert(array.length > 0, "Cannot calculate average for empty array");
  return sum(array) / array.length;
};

export const stdev = (array: number[]): number => {
  assert(
    array.length > 0,
    "Cannot calculate standard deviation for empty array"
  );
  if (array.length === 1) {
    return 0;
  }
  const average = avg(array);
  const deviations = array.map((num) => (num - average) * (num - average));
  return Math.sqrt(sum(deviations) / (array.length - 1));
};
