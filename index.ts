import assert from "assert";
import { readCsv, readJson } from "./app/utils/file-reader";
import { parseData } from "./app/utils/parse-data";
import { parsePercentValue } from "./app/utils/value-parsers";
import {
  AllocationCombinations,
  backTestAllocationCombinations,
} from "./app/domain/backtest";
import {
  byPortfolioValue,
  bySortinoRatio,
} from "./app/domain/result-comparers";
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

  const initialValue = 1;
  const averageInflationRate = 0.04;

  console.log(`Testing across ${changes.length} changes by Portfolio Value...`);

  const bestResultsByValue = backTestAllocationCombinations({
    initialValue,
    allocationCombinations,
    changes,
    minAcceptedReturn: averageInflationRate,
    resultsLimit,
    resultsComparer: byPortfolioValue,
  });

  console.log("=== Best results by Portfolio Value ===");
  console.log(formatResults(bestResultsByValue));
  console.log("=====");

  console.log(`Testing across ${changes.length} changes by Sortino Ratio...`);

  const bestResultsBySortinoRatio = backTestAllocationCombinations({
    initialValue,
    allocationCombinations,
    changes,
    minAcceptedReturn: averageInflationRate,
    resultsLimit,
    resultsComparer: bySortinoRatio,
  });

  console.log("=== Best results by Sortino Ratio ===");
  console.log(formatResults(bestResultsBySortinoRatio));
  console.log("=====");
};

main().catch(console.error);
