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
    name: 'XLM-ETH',
    exchanges: ['Bittrex', 'Binance'],
    courses: [],
    percentLimit: 2,
    coins: 10000,
    transferFees: {
      XLM: 0.00001,
      ETH: 0.00099
    }
  },
  {
    name: 'ETH-BTC',
    exchanges: ['Poloniex', 'Bittrex', 'Binance'],
    courses: [],
    percentLimit: 2,
    coins: 10,
    transferFees: {
      ETH: 0.00099,
      BTC: 0.00026848
    }
  }
  // {
  //   name: 'XEM-BTC',
  //   exchanges: ['Bittrex', 'Poloniex'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 5000,
  //   transferFees: {
  //     XEM: 15,
  //     BTC: 0.00099
  //   }
  // },
  // {
  //   name: 'XRP-ETH',
  //   exchanges: ['Bittrex', 'Binance'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 25,
  //   transferFees: {
  //     XRP: 0.15,
  //     ETH: 0.00099
  //   }
  // },
  // {
  //   name: 'XRP-BTC',
  //   exchanges: ['Bittrex', 'Binance', 'Poloniex'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 25,
  //   transferFees: {
  //     XRP: 0.15,
  //     BTC: 0.00099
  //   }
  // },
  // {
  //   name: 'ETC-BTC',
  //   exchanges: ['Bittrex', 'Binance', 'Poloniex'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 160,
  //   transferFees: {
  //     ETC: 0.001,
  //     BTC: 0.00099
  //   }
  // },
  // {
  //   name: 'ETC-ETH',
  //   exchanges: ['Bittrex', 'Binance', 'Poloniex'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 160,
  //   transferFees: {
  //     ETC: 0.001,
  //     ETH: 0.00099
  //   }
  // },
  // {
  //   name: 'ADA-BTC',
  //   exchanges: ['Bittrex', 'Binance'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 160,
  //   transferFees: {
  //     ADA: 0.001,
  //     BTC: 0.00099
  //   }
  // },
  // {
  //   name: 'ADA-ETH',
  //   exchanges: ['Bittrex', 'Binance'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 160,
  //   transferFees: {
  //     ADA: 0.001,
  //     ETH: 0.00099
  //   }
  // },
  // {
  //   name: 'BTG-BTC',
  //   exchanges: ['Bittrex', 'Binance'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 25,
  //   transferFees: {
  //     BTG: 0.00099,
  //     BTC: 0.00099
  //   }
  // },
  // {
  //   name: 'NEO-BTC',
  //   exchanges: ['Bittrex', 'Binance', 'Kucoin'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 25,
  //   transferFees: {
  //     NEO: 0.01,
  //     ETH: 0.00099
  //   }
  // },
  // {
  //   name: 'NEO-ETH',
  //   exchanges: ['Bittrex', 'Binance', 'Kucoin'],
  //   courses: [],
  //   percentLimit: 3,
  //   coins: 50,
  //   transferFees: {
  //     NEO: 0.01,
  //     ETH: 0.00099
  //   }
  // }
]

const getExchangeDriverByNameTest = function (exchangeName) {
  return exchangeDrivers.filter(exchange => exchange.name.toLowerCase() === exchangeName.toLowerCase())[0]
}

pairs.forEach(pair => {
  pair.exchangePairs = []
  pair.exchanges.forEach(exchangeBuy => {
    const exchangeBuyObject = getExchangeDriverByNameTest(exchangeBuy)
    pair.exchanges.forEach(exchangeSell => {
      const exchangeSellObject = getExchangeDriverByNameTest(exchangeSell)
      if (exchangeBuy !== exchangeSell && exchangeBuyObject.active && exchangeSellObject.active) {
        pair.exchangePairs.push({
          buy: exchangeBuy,
          sell: exchangeSell,
          soundAlerts: false
        })
      }
    })
  })
})
