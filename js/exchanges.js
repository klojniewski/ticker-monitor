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
      BTC: 0.0005,
      ETH: 0.005,
      DASH: 0.01,
      XRP: 0.15,
      XLM: 0.00001
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
      BTC: 0.00045,
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
      BTC: 0.001,
      ETH: 0.001,
      DASH: 0.002,
      XRP: 1,
      XLM: 0.006,
      NEO: 0
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
    praseTicker: function (resp) {
      return {
        ask: parseFloat(resp.askPrice),
        bid: parseFloat(resp.bidPrice)
      }
    },
    getTickerUrl: function (pairName) {
      const pairNameFormatted = pairName.replace('-', '')

      return `https://api.finvea.pl/ticker.php?market=binance&coin=${pairNameFormatted}`
    },
    withdrawal: {
      BTC: 0.001,
      BCH: 0.0005,
      ETH: 0.01,
      DASH: 0.002,
      XRP: 0.15,
      NEO: 0,
      XLM: 0.01
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
