# Asset Allocation Rebalancing Backtester

A command-line tool to backtest possible asset allocations in an investment portfolio given historical data sample with periodic (e.g. yearly) returns for each asset class.

## Prerequisites

Node.js installed.

## Usage

```sh
npm start ./data/<data-file>.json ./data/<params-file>.json <resultsLimit>
```

## Input Files

### Data File

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

### Params File

Params file contains several options:

- `sortBy` - how results are sorted; the options are: `Return`, `MaxDrawdown` and `Sortino`

- `resultsLimit` - a number that defines the amount of top results printed out

- `allocationLimits` - defines allocation combinations for each asset via allocation limits and change step; the key of each asset should be equal to the respective header in the Data file.

Example of the params file:

```json
{
  "sortBy": "Return",
  "resultsLimit": 10,
  "allocationLimits": {
    "stocks": { "min": 0.5, "max": 1, "step": 0.1 },
    "bonds": { "min": 0.1, "max": 0.5, "step": 0.1 },
    "gold": { "min": 0.2, "max": 0.6, "step": 0.1 }
  }
}
```

In the example above, the algorithm will test the following allocations for gold: 0.2, 0.3, 0.4, 0.5, 0.6.
