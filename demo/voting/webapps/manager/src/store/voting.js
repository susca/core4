/* import sim from '@/api/sim' */
import { clone, unique } from 'pnbi-base/src/helper'
import Api from '@/api/api'
import Vue from 'vue'
import axios from 'axios'
// import router from '@/router.js'
const state = {
  sse: null,
  questions: [],
  current: null,
  results: null,
  result: null
}

const actions = {
  dummyVote ({ commit, dispatch, getters }, sid) {
    // const current = getters.question
    const shuffleArray = arr => arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])

    const ids = [
      'fab',
      'nal',
      'mam',
      'wch',
      'adi',
      'ben',
      'agr',
      'eha',
      'she',
      'kjü',
      'mkr',
      'lkr',
      'hlo',
      'vme',
      'mmo',
      'mmr',
      'mra',
      'osc',
      'mse',
      'lst',
      'mtu',
      'ewi',
      'bzi'
    ]
    const random = shuffleArray(ids)[0]
    Api.dummyVote({ id: random })
  },
  fetchQuestions ({ commit, dispatch, getters }, sid) {
    Api.fetchQuestions().then(val => {
      commit('set_questions', val)
      const qs = getters.questions
      if (sid != null) {
        dispatch('setCurrentQuestion', { session_id: sid })
      } else {
        dispatch('setCurrentQuestion', { session_id: qs[0].session_id })
      }
      qs.forEach(val => {
        if (val.state === 'OPEN') {
          dispatch('stopQuestion', val)
        }
      })
    })
  },
  fetchResult ({ commit, dispatch, getters }, sid) {
    Api.fetchResult().then(val => {
      commit('set_result', val)
    })
  },
  setCurrentResult ({ commit, getters }, payload) {
    const result = getters.results.filter(val => val.session_id === payload.session_id)
    commit('set_current_result', result)
  },
  saveQuestion ({ commit, dispatch }, payload) {
    Api.saveQuestion(payload).then(val => {
      dispatch('showNotification', {
        text: 'Die Frage wurde gespeichert.'
      }, { root: true })
      dispatch('fetchQuestions')
    })
  },
  deleteQuestion ({ commit, dispatch }, sessionId) {
    Api.deleteQuestion(sessionId).then(val => {
      dispatch('showNotification', {
        text: 'Die Frage wurde gelöscht.'
      })
      commit('delete_question', sessionId)
    })
  },
  startQuestion ({ commit, dispatch, getters }, payload) {
    const next = payload || getters.question
    Api.startQuestion(next.session_id).then(val => {
      commit('set_current_question', val)
      const path = (`${axios.defaults.baseURL}/poll/${next.session_id}?token=secret_token`).replace('//poll', '/poll') // ????
      Vue.SSE(path, { format: 'json' })
        .then(sse => {
          commit('set_server_side_events', sse)
          dispatch('showNotification', {
            text: `Die Frage "${payload.question}" wurde gestartet.`
          }, { root: true })
          sse.onError(e => {
            console.error('lost connection; giving up!', e)
            sse.close()
          })
          sse.subscribe('', message => {
            const seconds = (new Date(message.timestamp).getTime() - new Date(getters.question.started_at).getTime()) / 1000
            console.info(Object.assign(message, { seconds }))
            commit('update_current_question', Object.assign(message, { seconds }))
          })
        })
        .catch(err => {
          console.warn(err)
          dispatch('fetchQuestions', next.session_id)
        })
    })
  },
  stopQuestion ({ commit, dispatch, getters }, payload) {
    return new Promise(resolve => {
      const next = payload || getters.question
      Api.stopQuestion(next.session_id).then(val => {
        try {
          getters.sse.close()
        } catch (err) {}
        dispatch('showNotification', {
          text: `Die Frage "${next.question}" wurde gestoppt.`
        }, { root: true })
        commit('update_current_question', { state: 'CLOSED' })
        resolve()
        // commit('set_current_question', null)
      }).catch(err => {
        console.error('Failed to connect to server', err)
      })
    })
  },
  resetQuestion ({ commit, dispatch, getters }, payload) {
    const next = payload || getters.question
    Api.resetQuestion(next.session_id).then(val => {
      try {
        getters.sse.close()
      } catch (err) {}
      dispatch('showNotification', {
        text: `Die Frage "${next.question}" wurde zurückgesetzt.`
      }, { root: true })
      dispatch('fetchQuestions', next.session_id)
      // commit('set_current_question', null)
    }).catch(err => {
      console.error('Error resetting question', err)
    })
  },
  updateCurrentQuestion ({ commit, getters }, payload) {
    commit('update_current_question', payload)
  },
  setCurrentQuestion ({ commit, getters }, payload) {
    if (payload && payload.session_id != null) {
      const current = getters.questions.find(val => val.session_id === payload.session_id)
      commit('set_current_question', current)
    } else {
      commit('set_current_question', null)
    }
  }
}

const mutations = {
  set_server_side_events (state, payload) {
    state.sse = payload
  },
  set_questions (state, payload) {
    state.questions = payload
  },
  delete_question (state, payload) {
    state.questions = state.questions.filter(
      val => val.session_id !== payload
    )
  },
  set_result (state, payload) {
    state.results = payload
  },
  set_current_result (state, payload) {
    state.result = payload
  },
  set_current_question (state, payload) {
    state.current = payload
  },
  update_current_question (state, payload) {
    const next = Object.assign({}, clone(state.current), payload)
    state.current = next
  }
}

const getters = {
  sse (state) {
    return state.sse
  },
  peopleCount (state) {
    const question = state.questions.find(val => {
      if (val.data.q != null) {
        const q = Number.parseInt(val.data.q)
        if (isNaN(q) === false) {
          return true
        }
      }
      return false
    })
    if (question != null) {
      return question.data.q
    }
    return 150
  },
  questions (state) {
    return state.questions
  },
  question (state) {
    return state.current
  },
  results (state) {
    return state.results
  },
  clusteredResults (state) {
    const COUNTRIES_ALL = {
      'Germany': { all: 108, real: 0 },
      'Ukraine': { all: 5, real: 0 },
      'Switzerland': { all: 7, real: 0 },
      'China': { all: 2, real: 0 },
      'France': { all: 9, real: 0 },
      'Poland': { all: 12, real: 0 },
      'United Kingdom': { all: 1, real: 0 },
      'Italy': { all: 13, real: 0 },
      'United States': { all: 3, real: 0 },
      'Austria': { all: 8, real: 0 },
      'United Arab Emirates': { all: 5, real: 0 },
      'Spain': { all: 3, real: 0 },
      'Belgium': { all: 9, real: 0 },
      'Russia': { all: 5, real: 0 },
      'Korea': { all: 1, real: 0 },
      'India': { all: 1, real: 0 },
      'not specified': { all: 5, real: 0 }
    }
    // SEX
    const MALES_ALL = 16
    const FEMALES_ALL = 7
    const U_30 = 8
    const UE_30 = 15
    if (state.results != null) {
      const results = unique(state.results.map(val => val.session_id))
      const cluster = results.map(val => {
        const resultCompleteRaw = state.results.filter(val2 => val2.session_id === val)
        const ret = {
          session_id: val,
          question: state.questions.find(val3 => val3.session_id === val),
          result: resultCompleteRaw,
          detail: []
        }
        const sex = {
          m: 0,
          w: 0,
          unter30: 0,
          ueber30: 0
        }
        resultCompleteRaw.forEach(val => {
          if (val.user_data.id) {
            ret.detail.push(val.user_data)
          }
          try {
            if (val.user_data.sex === 'm') {
              sex.m++
            } else {
              sex.w++
            }
            if (val.user_data.u30) {
              sex.unter30++
            } else {
              sex.ueber30++
            }
          } catch (err) {
          }
        })

        ret.sex = [sex.m / MALES_ALL, sex.w / FEMALES_ALL].map(val => val * 100) // Geschlecht in % von allen wählern
        ret.age = [sex.unter30 / U_30, sex.ueber30 / UE_30].map(val => val * 100) // Geschlecht in % von allen wählern
        // SEX END
        // Age

        resultCompleteRaw.forEach(val => {
          // console.log(val.user_data.country)
          try {
            COUNTRIES_ALL[val.user_data.country].real = COUNTRIES_ALL[val.user_data.country].real + 1
          } catch (err) {}
        })
        ret.countries = {
          categories: [],
          series: []
        }
        Object.keys(COUNTRIES_ALL).forEach(countryName => {
          if (COUNTRIES_ALL[countryName].real >= 0) {
            ret.countries.categories.push(countryName)
            ret.countries.series.push(COUNTRIES_ALL[countryName].real / COUNTRIES_ALL[countryName].all * 100)
          }
        })

        // console.log(countries)
        // TODO
        // 1. Distict countries for voting for categories ["Germany", "Italy", "Switzerland"]
        // 2. Series Array mit selber Reihenfolge wie categories [20, 10, 5]

        /*         ret.countries = {
          categories: ['Germany', 'Italy', 'Switzerland'],
          series: [20, 10, 5]
        } */
        // use in Result.vue to populate Countries Array
        // console.log('COUNTRIES_ALL', COUNTRIES_ALL, val)
        // ret.countries = [20, 40, 50, 30]
        // Countries END
        return ret
      })

      return cluster
    }

    return null
  },
  result (state) {
    return state.result
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}