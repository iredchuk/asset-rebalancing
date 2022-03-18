import assert from "assert";
import fs from "fs/promises";

export const readJson = async <T>(filePath: string): Promise<T> => {
  assert(filePath, "No JSON file specified");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data) as T;
};
