import { parseData } from "./parse-data";
import {
  createPortfolio,
  getPortfolioValue,
  rebalance,
  updatePortfolio,
} from "./portfolio";

const main = async () => {
  console.log("Parsing CSV...");
  const keys = ["stocks", "bonds", "cash", "reit", "gold"];
  const csvFilePath = process.argv[2];
  const changes = await parseData(csvFilePath, keys);

  console.log("Calculating...");
  const initialValue = 100000;
  const allocation = {
    stocks: 0.2,
    reit: 0.2,
    gold: 0.2,
    bonds: 0.2,
    cash: 0.2,
  };

  let portfolio = createPortfolio(initialValue, allocation);

  changes.forEach((change) => {
    portfolio = rebalance(updatePortfolio(portfolio, change), allocation);
  });

  const endValue = getPortfolioValue(portfolio);

  console.log(`Value of ${JSON.stringify(allocation)}: `, Math.round(endValue));
};

main().catch(console.error);
