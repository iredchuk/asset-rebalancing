import assert from "assert";
import { readCsv, readJson } from "./app/utils/file-reader";
import { parseData } from "./app/utils/parse-data";
import { parsePercentValue } from "./app/utils/value-parsers";
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
  const keys = Object.keys(allocationCombinations);
  const dataRows = await readCsv(process.argv[2]);
  const changes = parseData(dataRows, keys, parsePercentValue);
  const resultsLimit = parseInt(process.argv[4], 10);
  assert(resultsLimit > 0, "results limit not specified");

  console.log(`Testing across ${changes.length} changes...`);

  const bestResultsBySortinoRatio = backTestAllocationCombinations({
    allocationCombinations,
    changes,
    minAcceptableReturn: 0.04,
    resultsLimit,
    sortByDesc: (result) => result.totalReturn,
    filter: (result) => result.sortinoRatio >= 1,
  });

  console.log("=== Best results ===");
  console.log(formatResults(bestResultsBySortinoRatio));
  console.log("=====");
};

main().catch(console.error);
