# Asset Allocation Rebalancing Backtester

A command-line tool to backtest possible asset allocations in an investment portfolio given historical data sample with periodic (e.g. yearly) returns for each asset class.

## Prerequisites

Node.js installed.

## Usage

```sh
npm start ./data/<data-file>.csv ./data/<inputs-file>.json <resultsLimit>
```

## Input files

> Example of a CSV data file with historical yearly returns

```csv
year,stocks,bonds,gold
1972,18.76%,11.41%,42.57%
1973,-14.31%,4.32%,66.96%
1974,-25.90%,-4.38%,63.47%
```

> Example of backtest inputs JSON file that contains asset allocation combinations for every asset that will be used for backtesting

The key of each asset should be equal to the respective header in the Data file.

```json
{
  "stocks": [0.5, 0.7, 1],
  "bonds": [0, 0.3, 0.5],
  "gold": [0, 0.3, 0.5]
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

By default backtesting outputs best results by maximal Portfolio Value that have Sortino Ratio at least 1 (with minumum acceptable return 4%). When needed, `index.ts` can be adjusted to use any other comparer, filter or MAR.

If the CSV file with returns data has different format, you might need to adjust the parser in `app/utils/value-parsers.ts`.
