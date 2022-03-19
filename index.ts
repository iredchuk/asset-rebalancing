import assert from "assert";
import { readJson } from "./app/utils/file-reader";
import { DataRow, parseData } from "./app/utils/parse-data";
import {
  AllocationCombinations,
  backTestAllocationCombinations,
} from "./app/domain/backtest";
import { formatResults } from "./app/domain/format-results";

const main = async () => {
  console.log("Parsing input files...");

  const allocationCombinations = await readJson<AllocationCombinations>(
    process.argv[3]
  );
  const dataRows = await readJson<DataRow[]>(process.argv[2]);
  const keys = Object.keys(allocationCombinations);
  const changes = parseData(dataRows, keys);
  const resultsLimit = parseInt(process.argv[4], 10);
  assert(resultsLimit > 0, "results limit not specified");

  console.log(`Testing across ${changes.length} changes...`);

  const bestResults = backTestAllocationCombinations({
    allocationCombinations,
    changes,
    resultsLimit,
    sortByDesc: (result) => result.totalReturn * (1 - result.maxDrawdown),
  });

  console.log("Best Results:");
  console.log(formatResults(bestResults));
};

main().catch(console.error);
