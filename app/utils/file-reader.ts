import assert from "assert";
import csv from "csvtojson";
import fs from "fs/promises";

export const readCsv = async (
  filePath: string
): Promise<Record<string, string>[]> => {
  assert(filePath, "No CSV file specified");
  return (await csv().fromFile(filePath)) as Record<string, string>[];
};

export const readJson = async <T>(filePath: string): Promise<T> => {
  assert(filePath, "No JSON file specified");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data) as T;
};
