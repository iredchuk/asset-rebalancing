export const pushSortedCapped = <T>(
  array: T[],
  item: T,
  limit: number,
  compare: (a: T, b: T) => number
): void => {
  array.push(item);
  array.sort(compare);
  array.splice(limit);
};
