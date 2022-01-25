import csv from "csvtojson";

export type DataRow = Record<string, number>;

const parseValue = (str: string): number =>
  0.01 * parseFloat(str.replace("%", ""));

const normalizeDataRow = (
  dataRow: Record<string, string>,
  keys: string[]
): DataRow =>
  keys.reduce<DataRow>((result, key) => {
    result[key] = parseValue(dataRow[key]);
    return result;
  }, {});

const normalizeData = (
  dataRows: Record<string, string>[],
  keys: string[]
): DataRow[] => dataRows.map((row) => normalizeDataRow(row, keys));

export const parseData = async (
  csvFilePath: string,
  keys: string[]
): Promise<DataRow[]> => {
  if (!csvFilePath) {
    throw new Error("No CSV file specified");
  }

  const dataRows = (await csv().fromFile(csvFilePath)) as Record<
    string,
    string
  >[];

  return normalizeData(dataRows, keys);
};
