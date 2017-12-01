const exchangeDrivers = [
  {
    id: 0,
    name: 'Poloniex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100,
    tickerUrl: 'https://poloniex.com/public?command=returnTicker',
    praseTicker: function (ticker, pair) {
      pair = pair.replace('BCC', 'BCH')
      pair = pair.replace('XLM', 'STR')

      pair = pair.split('-')
      const pairName = `${pair[1]}_${pair[0]}`
      const pairTicker = ticker[pairName]

      const askValue = parseFloat(pairTicker.lowestAsk)
      const bidValue = parseFloat(pairTicker.highestBid)

      return {
        ask: askValue,
        bid: bidValue
      }
    },
    getTickerUrl: function () {
      return this.tickerUrl
    },
    withdrawal: {
      BTC: 0.00010000,
      ETH: 0.00500000,
      DASH: 0.01000000,
      XRP: 0.15000000
    }
  },
  {
    id: 1,
    name: 'BitBay',
    makerFee: 0.43 / 100,
    takerFee: 0.43 / 100,
    praseTicker: function (ticker, pair) {
      return {
        ask: ticker.ask,
        bid: ticker.bid
      }
    },
    getTickerUrl: function (pairName) {
      pairName = pairName.replace('-', '')
      return `https://bitbay.net/API/Public/${pairName}/ticker.json`
    },
    withdrawal: {
      BTC: 0.00045000,
      ETH: 0.00126,
      DASH: 0.001
    }
  },
  {
    id: 2,
    name: 'Bittrex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100,
    praseTicker: function (ticker, pair) {
      const responseTicker = ticker.result
      return {
        ask: responseTicker.Ask,
        bid: responseTicker.Bid
      }
    },
    getTickerUrl: function (pairNameOrygial) {
      const pairArray = pairNameOrygial.split('-')
      const pairName = `${pairArray[1]}-${pairArray[0]}`
      return `https://api.finvea.pl/ticker.php?market=bittrex&coin=${pairName}`
    },
    withdrawal: {
      BTC: 0.00100000,
      ETH: 0.00200000,
      DASH: 0.00200000,
      XRP: 5.00000000
    }
  },
  {
    id: 3,
    name: 'Bitmarket',
    makerFee: 0.45 / 100,
    takerFee: 0.45 / 100,
    praseTicker: function (ticker, pair) {
      return {
        ask: parseFloat(ticker.ask),
        bid: parseFloat(ticker.bid)
      }
    },
    getTickerUrl: function (pairName) {
      const pairNameFormatted = pairName.replace('-', '')

      return `https://api.finvea.pl/ticker.php?market=bitmarket&coin=${pairNameFormatted}`
    },
    withdrawal: {
      BTC: 0.0008,
      LTC: 0.005,
      BCH: 0.0008
    }
  },
  {
    id: 4,
    name: 'Binance',
    makerFee: 0.1 / 100,
    takerFee: 0.1 / 100,
    praseTicker: function (resp, pair) {
      const ticker = resp.query.results.json

      return {
        ask: parseFloat(ticker.asks[0].json[0]),
        bid: parseFloat(ticker.bids[0].json[0])
      }
    },
    getTickerUrl: function (pairName) {
      const pairNameFormatted = pairName.replace('-', '')

      return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%20%3D%20%27
      https%3A%2F%2Fwww.binance.com%2Fapi%2Fv1%2Fdepth%3Fsymbol%3D${pairNameFormatted}%27&format=json&callback=`
    },
    withdrawal: {
      BTC: 0.0005,
      BCH: 0.0005,
      ETH: 0.005,
      DASH: 0.002,
      XRP: 0.15,
      LTC: 0.001
    }
  },
  {
    id: 5,
    name: 'Abucoins',
    makerFee: 0,
    takerFee: 0.1 / 100,
    praseTicker: function (ticker, pair) {
      return {
        ask: parseFloat(ticker.asks[0][0]),
        bid: parseFloat(ticker.bids[0][0])
      }
    },
    getTickerUrl: function (pairName) {
      return `https://api.abucoins.com/products/${pairName}/book`
    },
    withdrawal: {
      BTC: 0.0002,
      BCH: 0.0001,
      ETH: 0.005,
      DASH: 0.01,
      XRP: 0.02,
      LTC: 0.001
    }
  }
]
