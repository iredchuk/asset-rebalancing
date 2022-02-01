import { product } from "./stat";

const pickItems = <T>(arrays: T[][], combination: number): T[] => {
  const items: T[] = [];
  let next = combination;

  for (let i = 0; i < arrays.length; ++i) {
    const array = arrays[i];
    if (array.length === 0) {
      continue;
    }

    items[i] = array[next % array.length];
    next = Math.floor(next / array.length);
  }

  return items;
};

export const iterateOverArrays = <T>(
  arrays: T[][],
  action: (items: T[]) => void
) => {
  const combinations = product(arrays.map((a) => a.length || 1));
  for (let c = 0; c < combinations; c += 1) {
    action(pickItems(arrays, c));
  }
};
