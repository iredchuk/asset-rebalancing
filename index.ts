import assert from "assert";
import { readCsv, readJson } from "./app/file-reader";
import { parseData } from "./app/parse-data";
import { parsePercentValue } from "./app/value-parsers";
import {
  AllocationCombinations,
  backTestAllocationCombinations,
} from "./app/backtest";
import { byEndValue } from "./app/result-comparers";
import { formatResults } from "./app/formatResults";

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

  console.log(
    `Testing ${Object.keys(allocationCombinations).length} assets across ${
      changes.length
    } changes...`
  );

  const initialValue = 1;

  const bestResults = backTestAllocationCombinations({
    initialValue,
    allocationCombinations,
    changes,
    resultsLimit,
    resultsComparer: byEndValue,
  });

  console.log("Best results:");
  console.log(formatResults(bestResults));
};

main().catch(console.error);
