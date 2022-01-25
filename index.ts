import { parseData } from "./parse-data";

const main = async () => {
  const keys = ["stocks", "bonds", "cash", "reit", "gold"];
  const csvFilePath = process.argv[2];
  const result = await parseData(csvFilePath, keys);
  console.log(result);
};

main().catch(console.error);
