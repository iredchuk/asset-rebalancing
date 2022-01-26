export type DataRow = Record<string, number>;

const parseDataRow = (
  dataRow: Record<string, string>,
  keys: string[],
  valueParser: (s: string) => number
): DataRow =>
  keys.reduce<DataRow>((result, key, index) => {
    if (!dataRow[key]) {
      throw new Error(`Key ${key} not found in a data row at index ${index}`);
    }

    result[key] = valueParser(dataRow[key].trim());
    return result;
  }, {});

export const parseData = (
  dataRows: Record<string, string>[],
  keys: string[],
  valueParser: (s: string) => number
): DataRow[] => dataRows.map((row) => parseDataRow(row, keys, valueParser));
