const pairs = [
  {
    name: 'ETH-BTC',
    exchanges: ['Poloniex', 'Bittrex', 'Abucoins'],
    courses: [],
    exchangePairs: [
      {
        buy: 'Poloniex',
        sell: 'Bittrex'
      },
      {
        buy: 'Bittrex',
        sell: 'Poloniex'
      },
      {
        buy: 'Poloniex',
        sell: 'Abucoins'
      },
      {
        buy: 'Bittrex',
        sell: 'Abucoins'
      }
    ],
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
    exchangePairs: [
      {
        buy: 'Bittrex',
        sell: 'Binance'
      },
      {
        buy: 'Binance',
        sell: 'Bittrex'
      }
    ],
    percentLimit: 3,
    coins: 6,
    transferFees: {
      DASH: 0.01,
      ETH: 0.00042
    }
  },
  {
    name: 'DASH-BTC',
    exchanges: ['Bittrex', 'Binance', 'Poloniex', 'Abucoins'],
    courses: [],
    exchangePairs: [
      {
        buy: 'Bittrex',
        sell: 'Binance'
      },
      {
        buy: 'Binance',
        sell: 'Bittrex'
      },
      {
        buy: 'Bittrex',
        sell: 'Poloniex'
      },
      {
        buy: 'Poloniex',
        sell: 'Bittrex'
      },
      {
        buy: 'Bittrex',
        sell: 'Abucoins'
      },
      {
        buy: 'Binance',
        sell: 'Abucoins'
      },
      {
        buy: 'Abucoins',
        sell: 'Poloniex'
      },
      {
        buy: 'Abucoins',
        sell: 'Bittrex'
      },
      {
        buy: 'Abucoins',
        sell: 'Binance'
      },
      {
        buy: 'Abucoins',
        sell: 'Poloniex'
      }
    ],
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
    exchangePairs: [
      {
        buy: 'Bittrex',
        sell: 'Binance'
      },
      {
        buy: 'Binance',
        sell: 'Bittrex'
      }
    ],
    percentLimit: 3,
    coins: 25,
    transferFees: {
      XRP: 0.15,
      ETH: 0.00042
    }
  }
]
