import Vue from 'vue'
import Vuex from 'vuex'
import Axois from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    tokenSchueler: '',
    tokenLehrer:'',
    tokenLehrerBuchAdmin: '',
    tokenLehrerAdmin: '',
    schueler: '',
    lehrer: '',
    lehrerBuchAdmin: '',
    lehrerAdmin: ''
  }
}

export default new Vuex.Store({
  strict:true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    istEingeloggtSchueler: state =>{
      return state.tokenSchueler
    },
    istEingeloggtLehrer: state =>{
      return state.tokenLehrer
    },
    istEingeloggtLehrerBuchAdmin: state =>{
      return state.tokenLehrerBuchAdmin
    },
    istEingeloggtLehrerAdmin: state =>{
      return state.tokenLehrerAdmin
    },
    getSchueler: state =>{
      return state.schueler
    },
    getLehrer: state =>{
      return state.lehrer
    },
  },
  mutations: {
    SET_TOKENSCHUELER: (state, token) => {
      state.tokenSchueler = token
    },
    SET_SCHUELER: (state, schueler) => {
      state.schueler = schueler
    },
    SET_TOKENLEHRER: (state, token) => {
      state.tokenLehrer = token
    },
    SET_LEHRER: (state, lehrer) => {
      state.lehrer = lehrer
    },
    SET_TOKENLEHRERBUCHADMIN: (state, token) => {
      state.tokenLehrerBuchAdmin = token
    },
    SET_TOKENLEHRERADMIN: (state, token) => {
      state.tokenLehrerAdmin = token
    },
    RESET: state => {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    loginSchueler: ({commit}, {token, schueler}) => {
      commit('SET_TOKENSCHUELER', token)
      commit('SET_SCHUELER', schueler)

      Axois.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    loginLehrer: ({commit}, {token, lehrer}) => {
      commit('SET_TOKENLEHRER', token)
      commit('SET_LEHRER', lehrer)

      Axois.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    loginLehrerBuchAdmin: ({commit}, {token, lehrer}) => {
      commit('SET_TOKENLEHRERBUCHADMIN', token)
      commit('SET_LEHRER', lehrer)

      Axois.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    loginLehrerAdmin: ({commit}, {token, lehrer}) => {
      commit('SET_TOKENLEHRERADMIN', token)
      commit('SET_LEHRER', lehrer)

      Axois.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    logout:({commit}) =>{
      commit('RESET', '')
    }
  },
  modules: {
  }
})
