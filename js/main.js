const sound = new Audio('./sounds/tick.wav')

Vue.filter('8places', value => parseFloat(value).toFixed(8))

Vue.filter('currency', (value, pairName) => {
  return `${parseFloat(value).toFixed(8)} ${pairName.split('-')[1]}`
})

const app = new Vue({
  el: '#app',
  store,
  data: {
    exchangeDrivers,
    percentLimit: 3,
    playSounds: true
  },
  computed: {
    pairs () {
      return this.$store.getters.pairs
    }
  },
  created () {
    this.$store.dispatch('init')
  },
  methods: {
    // E2
    getSellQty: function (coins, exchangeName) {
      const value = coins / (this.getTakerFee(exchangeName) + 1)
      return value.toFixed(8)
    },
    getTakerFee: function (exchangeName) {
      return this.getExchangeByName(exchangeName).takerFee
    },
    getExchangeByName: function (exchangeName) {
      exchangeName = exchangeName.toLowerCase()
      return exchangeDrivers.filter(exchange => exchange.name.toLowerCase() === exchangeName)[0]
    },
    // F2
    getSellCost: function (pair, exchangeName) {
      const value = pair.coins * this.getCourseByExchangeName(pair, exchangeName).ask
      return value.toFixed(8)
    },
    getCourseByExchangeName: function (pair, exchangeName) {
      return pair.courses.filter(exchange => exchange.exchange === exchangeName)[0].ticker
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

      const value = sellValue - sellFee - this.getSellCost(pair, buyExchangeName)

      return value.toFixed(8)
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
  app.$store.dispatch('init')
}, 2 * 1000)// 2 seconds
