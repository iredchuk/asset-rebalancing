export interface Limits {
  min: number;
  max: number;
  step: number;
}

export const createArrayFromLimits = ({ min, max, step }: Limits): number[] => {
  if (max <= min) {
    return [max];
  }

  const result = [];
  for (let i = min; i <= max; i += step) {
    result.push(i);
  }
  return result;
};
