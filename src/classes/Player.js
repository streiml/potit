import { uuid } from 'vue-uuid'
import store from '@/store'

export default class Player {
  id = null
  enemyId = null
  color = 'gray'
  board = []
  ownUnits = []
  units = []
  selected = []
  neighbours = []
  shots = []
  activeUnits = []
  finished = false

  constructor() {
    this.id = uuid.v1()
    this.board = Array(
      store.state.settings.rows * store.state.settings.cols + 4
    ).fill(0)
  }

  getId() {
    return this.id
  }

  finish() {
    this.finished = true
    this.update()
    console.log(this.color)
    console.log(this.board)
  }

  setUnits(units) {
    this.units = units.filter(x => true)
    this.ownUnits = units.filter(x => true)
    this.update()
  }

  addUnit(units) {
    this.units.push(units)
    this.update()
  }

  setEnemy(id, units) {
    this.enemyId = id
    this.units = units.filter(x => true)
  }

  revertShot() {
    this.shots.pop()
    this.selected = []
    this.update()
  }

  addShots(shots) {
    this.shots.push(shots)
    this.selected = []
    return this.update()
  }

  select(pos, neighbours = false) {
    if (pos == null) {
      this.selected = []
      this.neighbours = []
    } else if (this.selected.includes(pos))
      this.selected.splice(this.selected.indexOf(pos), 1)
    else if (this.selected.length < store.state.settings.shots)
      this.selected.push(pos)

    if (neighbours) {
      this.neighbours = []
      for (var i = 4; i > 1; i--) {
        if (this.getActiveUnits(true)[i] > 0) {
          this.neighbours = this.getNeibours(pos, i)
          break
        }
      }
    }

    this.update()
  }

  clear() {
    this.selected = []
    this.units = []
    this.neighbours = []
    this.update()
  }

  getActiveUnits(reverse = false) {
    let count = { 1: 0, 2: 0, 3: 0, 4: 0 }

    if (reverse) count = { ...store.state.settings.units }
    this.activeUnits.forEach(unit => {
      count[unit.length] += reverse ? -1 : 1
    })

    return count
  }

  unitsCount(reverse = false) {
    return Object.values(this.getActiveUnits(reverse)).reduce((a, b) => a + b)
  }

  getPoints() {
    let points = this.getDamaged(),
      hits = this.getActiveUnits(true),
      value = points + +hits[1] + hits[2] * 2.1 + hits[3] * 3.2 + hits[4] * 4.3

    return value
  }

  getDamaged() {
    return this.board.reduce((a, b) => {
      if (b == 3 || b == 4) return a + 1
      else return a
    }, 0)
  }
  // 3. Welche Felder sind zusätzlich dadurch deaktiviert? (grau)
  // Ist das Feld sichtbar?
  // -1 = deaktiviert/grau
  // 0 = neutral
  // 1 = aktiv/unsichtbar
  // 2 = aktiv/sichtbar
  // 3 = getroffen
  // 4 = versenkt
  // 5 = daneben
  // 6 = selection
  // 7 = choice
  // 8 = margin
  update() {
    let settings = store.state.settings,
      length = settings.rows * settings.cols,
      board = Array(length + 4).fill(0),
      cols = settings.cols,
      overflow = settings.overflow,
      margin = settings.margin,
      activeUnits = [],
      strikes = {},
      success = false

    // 1. Units setzen (Treffer aktiv, getroffen, versenkt) Spielerfarbe
    this.units.forEach(unit =>
      unit.forEach(pos => (board[pos] = this.finished ? 2 : 1))
    )

    // 2. Rahmen um Units (grau)
    if (margin) {
      this.units.forEach(unit =>
        unit.forEach(function (pos) {
          let col = pos % cols,
            above = pos - cols,
            below = pos + cols

          if (overflow && above < 0) above = length - cols + col
          if (overflow && below >= length) below = col

          // above
          if (col > 0 && above - 1 >= 0 && board[above - 1] < 1)
            board[above - 1] = 8
          if (above >= 0 && board[above] < 1) board[above] = 8
          if (col + 1 < cols && above + 1 > 0 && board[above + 1] < 1)
            board[above + 1] = 8

          // in line
          if (col > 0 && pos - 1 >= 0 && board[pos - 1] < 1) board[pos - 1] = 8
          if (col + 1 < cols && pos + 1 < length && board[pos + 1] < 1)
            board[pos + 1] = 8

          // below
          if (col > 0 && below - 1 < length && board[below - 1] < 1)
            board[below - 1] = 8
          if (below < length && board[below] < 1) board[below] = 8
          if (col + 1 < cols && below + 1 < length && board[below + 1] < 1)
            board[below + 1] = 8
        })
      )
    }

    this.units.forEach((unit, index) => (strikes[index] = 0))
    this.shots.forEach(shots => {
      success = false
      shots.forEach(shot => {
        // Daneben
        if (shot < length) {
          board[shot] = 5
          this.units.forEach((unit, index) => {
            if (unit.includes(shot)) {
              success = true
              board[shot] = 3
              strikes[index]++
            }
          })
        } else {
          //revealed
          if (board.indexOf(1) >= 0) {
            board[board.indexOf(1)] = 2
            success = true
          }
        }
      })
    })

    for (const index in strikes) {
      if (this.units[index].length == strikes[index]) {
        this.units[index].forEach(val => (board[val] = 4))
      } else {
        activeUnits.push(this.units[index])
      }
    }

    this.neighbours.forEach(units => units.forEach(p => (board[p] = 7)))

    this.selected.forEach(pos => (board[pos] = 6))

    this.board = board
    this.activeUnits = activeUnits
    return success
  }

  getNeibours(pos, len) {
    let rows = store.state.settings.rows,
      cols = store.state.settings.cols,
      overflow = store.state.settings.overflow,
      length = store.state.settings.rows * store.state.settings.cols,
      col = pos % cols,
      row = (pos / cols) | 0,
      board = this.board,
      cells = [],
      temp = [pos],
      i

    // East
    for (i = 1; i < len; i++) {
      if (col + i < cols && board[pos + i] == 0) {
        temp.push(pos + i)
      }
    }

    cells.push(temp.length == len ? temp : [])

    // West
    temp = [pos]
    for (i = 1; i < len; i++) {
      if (col - i >= 0 && board[pos - i] == 0) {
        temp.push(pos - i)
      }
    }
    cells.push(temp.length == len ? temp.reverse() : [])

    // North
    temp = [pos]
    for (let i = 1; i < len; i++) {
      if (row - i >= 0 && board[pos - i * cols] == 0) {
        temp.push(pos - i * cols)
      } else if (overflow && board[length + (pos - i * cols)] == 0) {
        temp.push(length + (pos - i * cols))
      }
    }
    cells.push(temp.length == len ? temp : [])

    // South
    temp = [pos]
    for (let i = 1; i < len; i++) {
      if (row + i < rows && board[pos + i * cols] == 0) {
        temp.push(pos + i * cols)
      } else if (overflow && board[pos + i * cols - length] == 0) {
        temp.push(pos + i * cols - length)
      }
    }
    cells.push(temp.length == len ? temp : [])

    return cells
  }

  hasFinished() {
    return this.activeUnits.length == 0
  }
}
