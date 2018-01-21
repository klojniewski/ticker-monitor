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
    percentLimit: 2,
    btcplnPrice: 36000,
    ethplnPrice: 3200,
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
    getSellQty: function (coins) {
      coins = parseFloat(coins)
      return coins.toFixed(8)
    },
    getBuyQty: function (pair, exchangeName) {
      const coins = parseFloat(pair.coins)
      const buyCurrency = pair.name.split('-')[0]
      const exchangeBuy = this.getExchangeByName(exchangeName)

      const value = exchangeBuy.upfrontFee
        ? coins
        : coins * this.getTakerFee(exchangeName) + coins

      return (value + exchangeBuy.withdrawal[buyCurrency]).toFixed(8)
    },
    getTakerFee: function (exchangeName) {
      return this.getExchangeByName(exchangeName).takerFee
    },
    getExchangeByName: function (exchangeName) {
      exchangeName = exchangeName.toLowerCase()
      return exchangeDrivers.filter(exchange => exchange.name.toLowerCase() === exchangeName)[0]
    },
    getBuyOrderValue: function (pair, exchangeName) {
      const exchangeBuy = this.getExchangeByName(exchangeName)
      const askPrice = this.getCourseByExchangeName(pair, exchangeName).ask

      const buyQty = this.getBuyQty(pair, exchangeName)

      const value = exchangeBuy.upfrontFee
        ? buyQty * askPrice * (1 + exchangeBuy.takerFee)
        : buyQty * askPrice

      return value.toFixed(8)
    },
    getSellOrderValue: function (pair, exchangeName) {
      const coinsToSell = this.getSellQty(pair.coins)
      const sellExchange = this.getCourseByExchangeName(pair, exchangeName)
      const sellValue = coinsToSell * sellExchange.bid

      const sellFee = sellValue * this.getTakerFee(exchangeName)

      return sellValue - sellFee
    },
    getCourseByExchangeName: function (pair, exchangeName) {
      const exchange = pair.courses.filter(exchange => exchange.exchange === exchangeName)[0]
      return exchange ? exchange.ticker : 0
    },
    getExchangesSpread: function (pair, buyExchangeName, sellExchangeName) {
      const buyExchange = this.getCourseByExchangeName(pair, buyExchangeName)
      const sellExchange = this.getCourseByExchangeName(pair, sellExchangeName)
      const spread = (sellExchange.bid * 100 / buyExchange.ask) - 100
      return Math.round(spread * 100) / 100
    },
    // PLValue - profit/loss value
    getPLValue: function (pair, buyExchangeName, sellExchangeName) {
      const sellOrderValue = this.getSellOrderValue(pair, sellExchangeName)
      const buyOrderValue = this.getBuyOrderValue(pair, buyExchangeName)

      const value = sellOrderValue - buyOrderValue

      return value.toFixed(8)
    },
    hasArbitrage: function (spread, playSounds, percentLimit) {
      const hasArbitrage = spread >= percentLimit
      if (hasArbitrage && playSounds) {
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
    getPLNValue: function (cryptoValue, pairName) {
      let profit
      const buyCurrency = pairName.split('-')[1]

      switch (buyCurrency) {
        case 'BTC':
          profit = `${(cryptoValue * this.btcplnPrice).toFixed(2)} PLN`
          break
        case 'ETH':
          profit = `${(cryptoValue * this.ethplnPrice).toFixed(2)} PLN`
          break
        default:
          profit = `${cryptoValue} ${buyCurrency}`
      }

      return profit
    },
    getExchangeLink: function (exchangeName, pair) {
      const pairName = pair.name
      return this.getExchangeByName(exchangeName).getExchangeUrl(pairName)
    },
    isActiveExchange: function (exchangeBuyName, exchangeSellName) {
      const exchangeBuy = this.getExchangeByName(exchangeBuyName)
      const exchangeSell = this.getExchangeByName(exchangeSellName)
      return exchangeBuy.active && exchangeSell.active
    }
  }
})

setInterval(() => {
  if (!app.freezeApp) {
    app.$store.dispatch('init')
  }
}, 4 * 1000)// 4 seconds
