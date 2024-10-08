# Asset Allocation Rebalancing Backtester

A command-line tool to backtest possible asset allocations in an investment portfolio given historical data sample with periodic (e.g. yearly) returns for each asset class.

## Prerequisites

Node.js installed.

## Usage

```sh
npm start ./data/<data-file>.json ./data/<backtest-combinations-file>.json <resultsLimit>
```

## Input files

Example of a JSON data file with historical yearly returns.
Each array element contains an object where key is an asset name and value is change of the asset's price value in percent.

```json
[
  {
    "year": 1972,
    "stocks": 18.76,
    "bonds": 11.41,
    "gold": 42.57
  },
  {
    "year": 1973,
    "stocks": -14.31,
    "bonds": 4.32,
    "gold": 66.96
  }
  // ...
]
```

Example of backtest inputs JSON file that contains limits of asset allocations for every asset that will be used for backtesting.
The key of each asset should be equal to the respective header in the Data file.

```json
{
  "stocks": { "min": 0.5, "max": 1, "step": 0.1 },
  "bonds": { "min": 0, "max": 0.5, "step": 0.1 },
  "gold": { "min": 0.2, "max": 0.8, "step": 0.1 }
}
```

Backtest algorithm will iterate over all valid allocation combinations and print out first best results specified by the `resultsLimit` number.

That is, from the input file from the example above, allocations under test will be:

```json
[
  { "stocks": 0.5, "bonds": 0, "gold": 0.5 },
  { "stocks": 0.5, "bonds": 0.5, "gold": 0 },
  { "stocks": 0.7, "bonds": 0.3, "gold": 0 },
  { "stocks": 0.7, "bonds": 0, "gold": 0.3 },
  { "stocks": 1, "bonds": 0, "gold": 0 }
]
```

## Customization

By default backtesting outputs best results by the goemetric mean of total return and total return adjusted by subtracting maximal drawdown. When needed, `index.ts` can be adjusted to use any other comparer or filter (use `sortByDesc` and `filter` parameters of `backTestAllocationCombinations` function).
