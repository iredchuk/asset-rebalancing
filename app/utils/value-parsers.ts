export const parsePercentValue = (str: string): number =>
  0.01 * parseFloat(str.replace("%", ""));
