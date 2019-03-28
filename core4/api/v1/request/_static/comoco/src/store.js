import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import { clone } from 'pnbi-base/core4/helper'
import { objectWithDefaults } from './helper'

import { jobStateDictionary, jobGroups } from './settings.js'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {
    queue: {

    },
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    }
  },
  actions: {},
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      Vue.prototype.$socket.sendObj({ 'type': 'interest', 'data': ['queue'] })
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      state.socket.message = message

      if (message.name === 'summary') {
        state.queue = normalizeData(message.data, 'state')
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  getters: {
    ...mapGettersJob(jobGroups),
    getJobsByGroupName: (state, getters) => (groupName) => {
      return getters[groupName]
    },
    getStateCounter: (state) => (stateName) => {
      if (state.queue.stat === undefined) return 0

      return stateName.reduce((previousValue, currentItem) => {
        previousValue += state.queue.stat[currentItem] || 0

        return previousValue
      }, 0)
    }
  }
})

// ================================================================= //
// Private methods
// ================================================================= //

/**
 *
 * @param {array} arr
 *
 * @returns {*}
 */
function mapGettersJob (arr) {
  return arr.reduce((computedResult, currentItem) => {
    computedResult[currentItem] = (state) => {
      return clone(state.queue[currentItem] || [])
    }

    return computedResult
  }, {})
}

/**
 *
 * @param {array} arr
 * @param {string} jobKey
 *
 * @returns {object}
 */
function normalizeData (arr, jobKey) {
  let jobs = {}
  let stat = objectWithDefaults(jobStateDictionary)

  arr.forEach((job) => {
    let jobState = job[jobKey]
    let key = jobStateDictionary[jobState] || 'other';

    (jobs[key] = jobs[key] || []).push(job)

    stat[jobState] += job['n']
  })

  return { 'stat': stat, ...jobs }
}
