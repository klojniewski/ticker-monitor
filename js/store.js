const state = {
  pairs
}

const getExchangeDriverByName = function (exchangeName) {
  return exchangeDrivers.filter(exchange => exchange.name.toLowerCase() === exchangeName.toLowerCase())[0]
}

const actions = {
  init ({ commit }) {
    const requests = []
    state.pairs.forEach(pair => {
      pair.exchanges.forEach(exchange => {
        const exchangeDriver = getExchangeDriverByName(exchange)
        const requestUrl = exchangeDriver.getTickerUrl(pair.name)

        const exchangeRequest = {
          uri: requestUrl,
          parser: exchangeDriver.praseTicker,
          pair: pair.name,
          exchange
        }

        requests.push(exchangeRequest)
      })
    })

    return Promise.all(requests.map(req => axios.get(req.uri).then(resp => {
      return {
        pair: req.pair,
        exchange: req.exchange,
        ticker: req.parser(resp.data, req.pair)
      }
    }))).then(resp => commit('setCourses', resp))
  }
}

const mutations = {
  setCourses: (state, tickers) => {
    state.pairs.forEach(pair => {
      const pairCourses = []
      pair.exchanges.forEach(exchange => {
        const pairExchangeCourse = tickers.filter(ticker => {
          return ticker.pair === pair.name && ticker.exchange === exchange
        })[0]
        pairCourses.push({
          exchange: pairExchangeCourse.exchange,
          ticker: pairExchangeCourse.ticker
        })
      })
      pair.courses = pairCourses
    })
  }
}

const getters = {
  pairs: state => state.pairs
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
