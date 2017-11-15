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
    coins: 5012.5// C1
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
    // E2
    getSellQty: function (coins, exchangeName) {
      return coins - (coins * this.getTakerFee(exchangeName))
    },
    getTakerFee: function (exchangeName) {
      return this.getExchangeByName(exchangeName).takerFee
    },
    getExchangeByName: function (exchangeName) {
      return exchanges.filter(exchange => exchange.name === exchangeName)[0]
    },
    // F2
    getSellCost: function (pair, exchangeName) {
      return pair.coins * this.getCourseByExchangeName(pair, exchangeName).ask
    },
    getCourseByExchangeName: function (pair, exchangeName) {
      return pair.courses.filter(exchange => exchange.name === exchangeName)[0]
    },
    // G2
    getExchangesSpread: function (pair, buyExchangeName, sellExchangeName) {
      const buyExchange = this.getCourseByExchangeName(pair, buyExchangeName)
      const sellExchange = this.getCourseByExchangeName(pair, sellExchangeName)
      const spread = (sellExchange.bid * 100 / buyExchange.ask) - 100
      return Math.round(spread * 100) / 100
    },
    // PLValue - profit/loss value
    getPLValue: function (pair, buyExchangeName, sellExchangeName) {
      const coinsToSell = this.getSellQty(pair.coins, buyExchangeName)
      const sellExchange = this.getCourseByExchangeName(pair, sellExchangeName)
      const sellValue = coinsToSell * sellExchange.bid

      const sellFee = sellValue * this.getTakerFee(sellExchangeName)

      return sellValue - sellFee - this.getSellCost(pair, buyExchangeName)
    }
  }
})
