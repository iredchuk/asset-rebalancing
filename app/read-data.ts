import csv from "csvtojson";

export const readData = async (
  csvFilePath: string,
): Promise<Record<string, string>[]> => {
  if (!csvFilePath) {
    throw new Error("No CSV file specified");
  }

  return (await csv().fromFile(csvFilePath)) as Record<
    string,
    string
  >[];
};
