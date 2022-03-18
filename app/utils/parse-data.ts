import assert from "assert";

export type DataRow = Record<string, number>;

const parseDataRow = (
  dataRow: Record<string, number>,
  keys: string[],
): DataRow =>
  keys.reduce<DataRow>((result, key, index) => {
    assert(
      dataRow[key],
      `Key ${key} not found in a data row at index ${index}`
    );
    return { ...result, [key]: dataRow[key] * 0.01 };
  }, {});

export const parseData = (
  dataRows: Record<string, number>[],
  keys: string[],
): DataRow[] => dataRows.map((row) => parseDataRow(row, keys));
