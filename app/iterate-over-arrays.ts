interface DivisionResult {
  quotient: number;
  remainder: number;
}

const divide = (a: number, b: number): DivisionResult => ({
  quotient: Math.floor(a / b),
  remainder: a % b,
});

const pickItems = <T>(arrays: T[][], combination: number): T[] => {
  const items: T[] = [];
  let next = combination;

  for (const array of arrays) {
    if (array.length === 0) {
      continue;
    }

    const { quotient, remainder } = divide(next, array.length);
    items.push(array[remainder]);
    next = quotient;
  }

  return items;
};

export const iterateOverArrays = <T>(
  arrays: T[][],
  action: (items: T[]) => void
) => {
  const combinations = arrays.reduce(
    (result, array) => result * (array.length || 1),
    1
  );

  for (let c = 0; c < combinations; c += 1) {
    action(pickItems(arrays, c));
  }
};
