import assert from "assert";
import {
  AllocationCombinations,
  BacktestParams,
  BackTestResult,
} from "../domain/backtest";
import { Change } from "../domain/portfolio";

export type DataRow = Record<string, unknown>;

export interface ParamsFile {
  sortBy: "Return" | "MaxDrawdown" | "Sortino";
  resultsLimit: number;
  minimalAcceptableReturn: number;
  allocationLimits: Record<string, Limits>;
}

interface Limits {
  min: number;
  max: number;
  step: number;
}

const parseDataRow = (dataRow: DataRow, keys: string[]): Change =>
  keys.reduce<Change>((result, key, index) => {
    const rowValue = dataRow[key];
    assert(
      rowValue !== undefined && typeof rowValue === "number",
      `Key ${key} not found in a data row at index ${index} (${JSON.stringify(dataRow)})`,
    );
    return { ...result, [key]: rowValue * 0.01 };
  }, {});

const createArrayFromLimits = ({ min, max, step }: Limits): number[] => {
  if (max <= min) {
    return [max];
  }

  const result = [];
  for (let i = min; i <= max; i += step) {
    result.push(Math.round(i * 100) / 100);
  }
  return result;
};

const getSortByDescFn = (sortBy: string) => {
  switch (sortBy) {
    case "Return":
      return (result: BackTestResult) => result.averageReturn;
    case "MaxDrawdown":
      return (result: BackTestResult) => -result.maxDrawdown;
    case "Sortino":
      return (result: BackTestResult) => result.sortinoRatio;
    default:
      throw new Error("Invalid sortBy parameter");
  }
};

export const createBackTestParams = (
  dataRows: DataRow[],
  params: ParamsFile,
): BacktestParams => {
  assert(
    Array.isArray(dataRows) && dataRows.length > 0,
    "Data file is not specified or invalid",
  );

  assert(params, "Params file is not specified or invalid");

  const { sortBy, resultsLimit, minimalAcceptableReturn, allocationLimits } =
    params;

  assert(
    Number(resultsLimit) && resultsLimit > 0,
    "resultsLimit not specified or invalid",
  );

  assert(
    Number(minimalAcceptableReturn) && minimalAcceptableReturn >= 0,
    "minimalAcceptableReturn not specified or invalid",
  );

  assert(
    allocationLimits && Object.keys(allocationLimits).length > 0,
    "allocationLimits not specified or empty",
  );

  const allocationCombinations = Object.entries(
    allocationLimits,
  ).reduce<AllocationCombinations>(
    (result, [asset, limits]) => ({
      ...result,
      [asset]: createArrayFromLimits(limits),
    }),
    {},
  );

  const keys = Object.keys(allocationCombinations);

  const changes = dataRows.map((row) => parseDataRow(row, keys));

  return {
    allocationCombinations,
    changes,
    resultsLimit,
    minimalAcceptableReturn,
    sortByDesc: getSortByDescFn(sortBy),
  };
};
