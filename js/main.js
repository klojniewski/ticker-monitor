const exchanges = [
  {
    name: 'Poloniex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100
  },
  {
    name: 'Bittrex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100
  }
]

const pairList = [
  {
    name: 'XLM',
    courses: [
      {
        name: 'Poloniex',
        ask: 0.00000522,
        bid: 0.00000521
      },
      {
        name: 'Bittrex',
        ask: 0.0000054,
        bid: 0.00000538
      }
    ],
    coins: 5012.5
  },
  {
    name: 'ETH',
    courses: [
      {
        name: 'Poloniex',
        ask: 0.00000522,
        bid: 0.00000521
      },
      {
        name: 'Bittrex',
        ask: 0.0000054,
        bid: 0.00000538
      }
    ],
    coins: 10
  }
]

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    pairs: pairList,
    exchanges,
    percentLimit: 3
  },
  methods: {
    getSellQty: function (coins, exchangeName) {
      return coins - (coins * this.getTakerFee(exchangeName))
    },
    getTakerFee: function (exchangeName) {
      return this.getExchangeByName(exchangeName).takerFee
    },
    getExchangeByName: function (exchangeName) {
      return exchanges.filter(exchange => exchange.name === exchangeName)[0]
    },
    getSellCost: function (pair, exchangeName) {
      return pair.coins * this.getCourseByExchangeName(pair, exchangeName).ask
    },
    getCourseByExchangeName: function (pair, exchangeName) {
      return pair.courses.filter(exchange => exchange.name === exchangeName)[0]
    },
    getExchangesSpread: function (pair, buyExchangeName, sellExchangeName) {
      const buyExchange = this.getCourseByExchangeName(pair, buyExchangeName)
      const sellExchange = this.getCourseByExchangeName(pair, sellExchangeName)
      const spread = (sellExchange.bid * 100 / buyExchange.ask) - 100
      return Math.round(spread * 100) / 100
    }
  }
})
