import { backTestAllocationCombinations } from "./app/domain/backtest";
import { formatResults } from "./app/domain/format-results";
import { readJson } from "./app/utils/file-reader";
import {
  createBackTestParams,
  DataRow,
  ParamsFile,
} from "./app/utils/parse-params";

const main = async () => {
  console.log("Parsing input files...");

  const [dataRows, params] = await Promise.all([
    readJson<DataRow[]>(process.argv[2]),
    readJson<ParamsFile>(process.argv[3]),
  ]);

  const backtestParams = createBackTestParams(dataRows, params);

  console.log(`Testing across ${backtestParams.changes.length} changes...`);

  const bestResults = backTestAllocationCombinations(backtestParams);

  console.log("Best Results:");
  console.log(formatResults(bestResults));
};

main().catch(console.error);
