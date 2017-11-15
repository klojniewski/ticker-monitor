const sound = new Audio('./sounds/tick.wav')

const exchanges = [
  {
    id: 0,
    name: 'Poloniex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100,
    tickerUrl: 'https://poloniex.com/public?command=returnTicker',
    praseTicker: function (ticker, pair) {
      pair = pair.replace('XLM', 'STR')
      const pairTicker = ticker[pair.replace('-', '_')]
      return {
        ask: pairTicker.lowestAsk,
        bid: pairTicker.highestBid
      }
    },
    getTickerUrl: function () {
      return this.tickerUrl
    }
  },
  {
    id: 1,
    name: 'Bittrex',
    makerFee: 0.25 / 100,
    takerFee: 0.25 / 100,
    praseTicker: function (ticker, pair) {
      const responseTicker = ticker.query.results.json.result
      return {
        ask: parseFloat(responseTicker.Ask),
        bid: parseFloat(responseTicker.Bid)
      }
    },
    getTickerUrl: function (pairName) {
      return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%20%3D%20%27https%3A%2F%2Fbittrex.com%2Fapi%2Fv1.1%2Fpublic%2Fgetticker%3Fmarket%3D${pairName}%27&format=json&callback=`
    }
  }
]

const pairList = [
  {
    name: 'BTC-XLM',
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
    name: 'BTC-ETH',
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
    percentLimit: 3,
    playSounds: true
  },
  methods: {
    // E2
    getSellQty: function (coins, exchangeName) {
      return coins / (this.getTakerFee(exchangeName) + 1)
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
    },
    refresh: function () {
      pairList.forEach(pair => {
        exchanges.map(exchange => {
          return fetch(exchange.getTickerUrl(pair.name)).then(resp => resp.json()).then(ticker => {
            const pairTicker = exchange.praseTicker(ticker, pair.name)
            pair.courses[exchange.id].ask = pairTicker.ask
            pair.courses[exchange.id].bid = pairTicker.bid
          })
        })
      })
    },
    hasArbitrage: function (spread) {
      const hasArbitrage = spread > this.percentLimit
      if (hasArbitrage && this.playSounds) {
        sound.play()
      }
      return hasArbitrage
    }
  }
})

setInterval(() => {
  app.refresh()
}, 2 * 1000)// 2 seconds
