import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    isConnected: false,
    settings: {
      game: 'classic',
      rows: 6,
      cols: 6,
      units: { 1: 1, 2: 0, 3: 0, 4: 0 },
      overflow: true,
      margin: true,
      shots: 3,
      sonar: false
    },
    order: [],
    current: null,
    players: {},
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      portrait: window.screen.orientation.type === 'portrait-primary'
    }
  },
  getters: {
    getPlayerCount: state => {
      return state.settings.players
    },
    getActiveUnits: state => playerId => {
      let units = state.players[playerId].units,
        count = { 1: 0, 2: 0, 3: 0, 4: 0 }

      units.forEach(unit => {
        if (
          unit.filter(val => {
            return val < 1000
          }).length > 0
        ) {
          count[unit.length]++
        }
      })

      return count
    }
  },
  mutations: {
    /*
    SOCKET_CONNECT(state) {
      state.isConnected = true
      console.log(state.isConnected)
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false
      console.log(state.isConnected)
    },*/
    // initialiseStore(state) {
    //   // Check if the ID exists
    //   if (localStorage.getItem('store')) {
    //     // Replace the state object with the stored item
    //     this.replaceState(
    //       Object.assign(state, JSON.parse(localStorage.getItem('store')))
    //     )
    //   }
    // }
    selectGame(state, game) {
      state.settings.game = game
      state.settings.margin = true
      state.settings.shots = 3
      state.settings.units = { 1: 0, 2: 0, 3: 0, 4: 0 }
      state.settings.overflow = false
      state.settings.sonar = false
      state.settings.rows = 6
      state.settings.cols = 6
      state.players = {}
      state.order = []
      state.current = null

      if (game == 'darts') {
        state.settings.overflow = true
        state.settings.rows = 20
        state.settings.cols = 4
        state.settings.sonar = true
      }
    },
    initBoard(state, playerId) {
      let length = state.settings.rows * state.settings.cols,
        board = Array(length).fill(0),
        cols = state.settings.cols,
        rows = state.settings.rows,
        overflow = state.settings.overflow,
        margin = state.settings.margin,
        units = state.players[playerId].units

      // 1. Units setzen (Treffer aktiv, getroffen, versenkt) Spielerfarbe
      units.map(unit => unit.map(pos => (board[pos] = 1)))

      // 2. Rahmen um Units (grau)
      if (margin) {
        units.forEach(unit =>
          unit.forEach(function (pos) {
            let col = pos % cols,
              above = pos - cols,
              below = pos + cols

            if (overflow && above < 0) above = length - cols + col
            if (overflow && below >= length) below = col

            // above
            if (col > 0 && above - 1 > 0 && board[above - 1] < 1)
              board[above - 1] = -1
            if (above > 0 && board[above] < 1) board[above] = -1
            if (col + 1 < cols && above + 1 > 0 && board[above + 1] < 1)
              board[above + 1] = -1

            // in line
            if (col > 0 && pos - 1 >= 0 && board[pos - 1] < 1)
              board[pos - 1] = -1
            if (col + 1 < cols && pos + 1 < length && board[pos + 1] < 1)
              board[pos + 1] = -1

            // below
            if (col > 0 && below - 1 < length && board[below - 1] < 1)
              board[below - 1] = -1
            if (below < length && board[below] < 1) board[below] = -1
            if (col + 1 < cols && below + 1 < length && board[below + 1] < 1)
              board[below + 1] = -1
          })
        )
      }

      state.players[playerId].board = board
    },
    shoot(state, pos) {
      let playerId = state.current,
        length = state.settings.cols * state.settings.rows,
        board = state.players[playerId].board,
        units = state.players[playerId].units,
        index = -1

      if (pos >= 0 && pos < length) {
        // Daneben
        if (board[pos] < 1) board[pos] = 5
        // Treffer
        if (board[pos] == 1 || board[pos] == 2) {
          board[pos] = 3

          units.forEach((unit, i) => {
            let j = unit.indexOf(pos)

            if (j != -1) {
              index = i
              units[i][j] += 1000
            }
          })
          // Versenkt
          if (
            index >= 0 &&
            units[index].reduce((a, b) => a + b, 0) >=
              1000 * units[index].length
          ) {
            units[index].forEach(val => (board[val - 1000] = 4))
          }
        }
      }
    },
    reveal(state, pos) {
      let board = state.players[state.current].board,
        length = state.settings.cols * state.settings.rows

      if (pos >= 0 && pos < length) board[pos] = 2
    }
  },
  actions: {
    revealAll({ commit, state }) {
      Object.values(state.players).forEach(player => {
        player.finish()
      })
    },
    potit({ commit, state }) {
      let player = state.players[state.current],
        board = player.board,
        selected = state.selected

      selected.forEach(pos => {
        if (pos == 'bull') {
          commit('reveal', board.indexOf(1))
        } else {
          commit('shoot', pos)
        }
      })

      state.players[state.current].selected = []
    },
    setEnemies({ commit, state }, enemies) {
      Object.entries(enemies).forEach(([id, enemy]) => {
        state.players[id].setEnemy(enemy, state.players[enemy].ownUnits)
      })
    },
    editPlayer({ commit, state }, player) {
      state.players[player.id] = player
      state.current = player.id
    },
    current({ commit, state }, id) {
      state.current = id
    },
    select({ commit, state }, pos) {
      if (pos != null) {
        state.selected.push(pos)
      } else {
        state.selected = []
      }
    },
    start({ commit, state }, payload) {
      state.order = Object.keys(state.players)
      state.current = state.order[0]
      router.push('/game')
    }
  },
  modules: {}
})
