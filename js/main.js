const sound = new Audio('./sounds/tick.wav')

Vue.filter('8places', value => parseFloat(value).toFixed(8))

Vue.filter('buyCurrency', (value, pairName) => {
  return `${parseFloat(value).toFixed(8)} ${pairName.split('-')[1]}`
})

Vue.filter('sellCurrency', (value, pairName) => {
  return `${parseFloat(value).toFixed(8)} ${pairName.split('-')[0]}`
})

const app = new Vue({
  el: '#app',
  store,
  data: {
    exchangeDrivers,
    percentLimit: 3,
    btcplnPrice: 55000,
    ethplnPrice: 3400,
    playSounds: true,
    freezeApp: false
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
    getBuyOrderValue: function (pair, exchangeName) {
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

      const value = sellValue - sellFee - this.getBuyOrderValue(pair, buyExchangeName)

      return value.toFixed(8)
    },
    hasArbitrage: function (spread) {
      const hasArbitrage = spread > this.percentLimit
      if (hasArbitrage && this.playSounds) {
        sound.play()
      }
      return hasArbitrage
    },
    getTotalTransferFees: function (pair, course) {
      // transfer fees needs to be printed in final currency to calculate P/L
      const finalCurrency = pair.name.split('-')[1]
      let total = 0
      for (let key in pair.transferFees) {
        let fee = pair.transferFees[key]
        // if fee is not in final currency - calculate to the final
        if (key !== finalCurrency) {
          fee = fee * course
        }
        total += fee
      }
      return total
    },
    getTotalWithdrawalFees: function (pair, buyExchangeName, sellExchangeName, course) {
      const pairNameArray = pair.name.split('-')
      const exchangeBuyCurrency = pairNameArray[0]
      const exchangeSellCurrency = pairNameArray[1]

      const exchangeBuy = this.getExchangeByName(buyExchangeName)
      const exchangeSell = this.getExchangeByName(sellExchangeName)

      const exchangeBuyWithdrawal = exchangeBuy.withdrawal[exchangeBuyCurrency] * course
      const exchangeSellWithdrawal = exchangeSell.withdrawal[exchangeSellCurrency]

      return exchangeBuyWithdrawal + exchangeSellWithdrawal
    },
    getPLNetValue: function (pair, buyExchangeName, sellExchangeName, course) {
      const PLGross = parseFloat(this.getPLValue(pair, buyExchangeName, sellExchangeName))
      const depositFees = this.getTotalTransferFees(pair, course)
      const withdrawalFees = this.getTotalWithdrawalFees(pair, buyExchangeName, sellExchangeName, course)
      const PLNet = PLGross - withdrawalFees - depositFees

      return PLNet
    },
    getPLNetValuePLN: function (PLNet, pairName) {
      const buyCurrency = pairName.split('-')[1]

      let profit = `${PLNet} ${buyCurrency}`
      if (buyCurrency === 'BTC') {
        profit = `${(PLNet * this.btcplnPrice).toFixed(2)} PLN`
      } else if (buyCurrency === 'ETH') {
        profit = `${(PLNet * this.ethplnPrice).toFixed(2)} PLN`
      }

      return profit
    },
    getExchangeLink: function (exchangeName, pair) {
      const pairName = pair.name
      return this.getExchangeByName(exchangeName).getExchangeUrl(pairName)
    }
  }
})

setInterval(() => {
  if (!app.freezeApp) {
    app.$store.dispatch('init')
  }
}, 4 * 1000)// 4 seconds
