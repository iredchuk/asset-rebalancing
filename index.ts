import { readCsv, readJson } from "./app/file-reader";
import { parseData } from "./app/parse-data";
import { parsePercentValue } from "./app/value-parsers";
import {
  AllocationCombinations,
  backTestAllocationCombinations,
} from "./app/backtest";

const main = async () => {
  console.log("Parsing input files...");

  const keys = ["stocks", "bonds", "cash", "reit", "gold"];
  const dataRows = await readCsv(process.argv[2]);
  const changes = parseData(dataRows, keys, parsePercentValue);

  const allocationCombinations = await readJson<AllocationCombinations>(
    process.argv[3]
  );

  console.log(
    `Testing ${Object.keys(allocationCombinations).length} assets across ${
      changes.length
    } changes...`
  );

  const initialValue = 100000;
  const bestResult = backTestAllocationCombinations(
    initialValue,
    allocationCombinations,
    changes
  );

  console.log("Best result: ", JSON.stringify(bestResult, null, 2));
};

main().catch(console.error);
