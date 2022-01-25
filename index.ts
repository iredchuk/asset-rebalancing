import { parseData } from "./parse-data";

const main = async () => {
  const keys = ["stocks", "bonds", "cash", "reit", "gold"];
  const csvFilePath = process.argv[2];
  const data = await parseData(csvFilePath, keys);
  console.log(data);
};

main().catch(console.error);
