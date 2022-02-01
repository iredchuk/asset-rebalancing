# asset-rebalancing

## Usage

```sh
npm start ./data/<data-file>.csv ./data/<inputs-file>.json <resultsLimit>
```

### Data file example

```csv
year,stocks,bonds,gold
1972,18.76%,11.41%,42.57%
1973,-14.31%,4.32%,66.96%
1974,-25.90%,-4.38%,63.47%
```

### Inputs file example

```json
{
  "stocks": [0.5, 0.6, 0.7, 0.8, 0.9, 1],
  "bonds": [0, 0.1, 0.2, 0.3, 0.4, 0.5],
  "Gold": [0, 0.1, 0.2, 0.3, 0.4, 0.5]
}
```

Backtest algorithm will iterate over all valid allocation combinations and print out first best results specified by `resultsLimit` number.
