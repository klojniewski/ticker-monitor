const pairs = [
  {
    name: 'XLM-BTC',
    exchanges: ['Bittrex', 'Binance', 'Poloniex'],
    courses: [],
    percentLimit: 3,
    coins: 10000,
    transferFees: {
      XLM: 0.00001,
      BTC: 0.001
    }
  },
  {
    name: 'ETH-BTC',
    exchanges: ['Poloniex', 'Bittrex', 'Abucoins'],
    courses: [],
    percentLimit: 3,
    coins: 10,
    transferFees: {
      ETH: 0.00042,
      BTC: 0.00026848
    }
  },
  {
    name: 'DASH-ETH',
    exchanges: ['Bittrex', 'Binance'],
    courses: [],
    percentLimit: 3,
    coins: 5,
    transferFees: {
      DASH: 0.01,
      ETH: 0.00042
    }
  },
  {
    name: 'DASH-BTC',
    exchanges: ['Bittrex', 'Binance', 'Poloniex', 'Abucoins'],
    courses: [],
    percentLimit: 3,
    coins: 6,
    transferFees: {
      DASH: 0.01,
      BTC: 0.00026848
    }
  },
  {
    name: 'XRP-ETH',
    exchanges: ['Bittrex', 'Binance'],
    courses: [],
    percentLimit: 3,
    coins: 25,
    transferFees: {
      XRP: 0.15,
      ETH: 0.00042
    }
  },
  {
    name: 'NEO-ETH',
    exchanges: ['Bittrex', 'Binance'],
    courses: [],
    percentLimit: 3,
    coins: 10000,
    transferFees: {
      NEO: 0.01,
      ETH: 0.00042
    }
  }
]

pairs.forEach(pair => {
  pair.exchangePairs = []
  pair.exchanges.forEach(exchangeBuy => {
    pair.exchanges.forEach(exchangeSell => {
      if (exchangeBuy !== exchangeSell) {
        pair.exchangePairs.push({
          buy: exchangeBuy,
          sell: exchangeSell
        })
      }
    })
  })
})
