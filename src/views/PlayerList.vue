<template>
  <nav id="nav" class="navbar navbar-light bg-light">
    <router-link to="/settings" class="btn btn-outline-success" type="button">
      <i class="bi bi-gear-fill"></i>
    </router-link>
    <button
      :class="{
        btn: true,
        'btn-success': true,
        disabled: Object.keys(players).length == 0
      }"
      @click="startGame()"
    >
      <i class="bi bi-play-fill text-white"></i>
    </button>
  </nav>
  <h2>Players</h2>
  <table class="table table-sm">
    <thead>
      <tr>
        <th scope="col"><i class="bi bi-grid-3x3"></i></th>
        <th scope="col"><i class="bi bi-person-fill"></i></th>
        <th scope="col">
          <span
            style="font-weight: normal"
            v-if="Object.keys(players).length == 0"
            >vs.</span
          >
        </th>
        <th scope="col"><i class="bi bi-person-fill"></i></th>
        <th scope="col" style="text-align: right">
          <button
            v-if="Object.keys(players).length == 0"
            class="btn btn-outline-primary border-0 ms-1"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            v-if="Object.keys(players).length == 0"
            class="btn btn-outline-primary border-0 ms-1"
          >
            <i class="bi bi-trash"></i>
          </button>
        </th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="(player, id) in players" :key="id">
        <td><i class="bi bi-check2"></i></td>
        <td>
          <button
            class="btn btn-outline-primary border-0 avatar"
            @click="changeColor(id)"
            :style="{ background: $PlayerColor[player.color] }"
          >
            &nbsp;
          </button>
        </td>
        <td>vs.</td>
        <td>
          <button
            class="btn btn-outline-primary border-0 avatar"
            @click="changeEnemy(id)"
            :style="{
              background:
                id in this.enemies && this.enemies[id] != null
                  ? $PlayerColor[this.players[this.enemies[id]].color]
                  : $PlayerColor['gray']
            }"
          >
            &nbsp;
          </button>
        </td>
        <td style="text-align: right">
          <button
            @click.prevent="editPlayer(id)"
            class="btn btn-outline-primary border-0"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            @click.prevent="deletePlayer(id)"
            class="btn btn-outline-primary border-0 ms-1"
          >
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="Object.keys(players).length < 9" class="clearfix">
    <button class="btn btn-primary float-end" @click="addPlayer()">
      <i class="bi bi-person-fill-add"></i>
    </button>
  </div>
  <!--
  <h2>Players</h2>
  <div class="container-fluid">
    <div class="cards row row-cols-auto g-1">
      <div v-for="(player, id) in players" :key="id" class="col text-center">
        <div class="card">
          <div class="card-body">
            <i
              class="bi bi-person-fill-check"
              :style="{
                fontSize: '60px',
                color: $PlayerColor[player.color]
              }"
            ></i>
          </div>
          <div class="card-footer px-0">
            <a
              href="#"
              @click.prevent="editPlayer(id)"
              class="btn btn-outline-primary"
              ><i class="bi bi-pencil-fill fs-6"></i
            ></a>
            <a
              href="#"
              @click.prevent="deletePlayer(id)"
              class="btn btn-outline-danger ms-1"
              ><i class="bi bi-trash fs-6"></i
            ></a>
          </div>
        </div>
      </div>
      <div v-if="Object.keys(players).length < 9" class="col">
        <div class="add-player" @click.prevent="addPlayer()">
          <i
            class="bi bi-person-fill-add text-white"
            style="font-size: 60px"
          ></i>
        </div>
      </div>
    </div>
  </div>
  -->
  <h2>Invite Player</h2>
  <p>Code</p>
  <button type="button" class="btn btn-success">Share Link</button>
  <h2>Settings</h2>
  <color-dialog :mode="colorMode" @color="save"></color-dialog>
</template>

<script>
// @ is an alias to /src
import ColorDialog from '@/components/ColorDialog.vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Player from '@/classes/Player.js'
export default {
  name: 'Player',
  data: function () {
    /*
    let store = this.$store.state,
      players = {},
      player = new Player(),
      first = player.getId(),
      units = null

    //this.$store.dispatch('current', player.getId())
    player.addUnit([0])
    player.addUnit([1, 2])
    player.addUnit([4, 5, 6])
    player.addUnit([8, 9, 10, 11])
    player.color = 'red'
    players[first] = player

    player = new Player()
    player.addUnit([26])
    player.addUnit([28, 29])
    player.addUnit([32, 33, 34])
    player.addUnit([36, 37, 38, 39])
    player.color = 'cyan'
    units = player.ownUnits
    //player.setEnemy(first, players[first].ownUnits)
    players[player.getId()] = player

    //players[first].setEnemy(player.getId(), units)

    this.$store.dispatch('editPlayer', players[first])
    this.$store.dispatch('editPlayer', player)

    player = new Player()
    player.addUnit([26])
    player.addUnit([28, 29])
    player.addUnit([32, 33, 34])
    player.addUnit([36, 37, 38, 39])
    player.color = 'green'
    units = player.ownUnits
    //player.setEnemy(first, players[first].ownUnits)
    players[player.getId()] = player

    this.$store.dispatch('editPlayer', player)
    //this.$store.dispatch('start')
    this.getEnemies()
*/
    return {
      players: this.$store.state.players,
      //players: players,
      enemies: this.getEnemies(),
      //enemies: {},
      colorMode: 'player',
      selectEnemy: false,
      selectedPlayerId: null
    }
  },
  computed: {
    colorDialog() {
      return new Modal('#colorDialog', {})
    }
  },
  methods: {
    startGame() {
      this.$store.dispatch('setEnemies', this.enemies)
      this.$store.dispatch('start')
    },
    deletePlayer(id) {
      Object.values(this.players).forEach(player => {
        if (player.enemyId == id) player.enemyId = null
      })
      delete this.players[id]
      this.getEnemies()
    },
    addPlayer() {
      this.$router.push({ name: 'EditPlayer', params: {} })
    },
    editPlayer(id) {
      this.$router.push({ name: 'EditPlayer', params: { id } })
    },
    changeColor(id) {
      this.selectedPlayerId = id
      this.colorMode = 'player'
      this.colorDialog.show()
    },
    changeEnemy(id) {
      this.selectedPlayerId = id
      this.selectEnemy = true
      this.colorMode = 'enemy'
      this.colorDialog.show()
    },
    getEnemies() {
      let players = this.$store.state.players,
        values = Object.values(this.$store.state.players),
        current,
        next1,
        next2,
        enemies = {}

      values.forEach(player => {
        enemies[player.id] = null
      })

      values.sort((a, b) => a.enemyId == null)
      while (values.length > 0) {
        current = values[0]
        if (current.enemyId != null) {
          // Fixe Zuweisung
          enemies[current.id] = current.enemyId
          if (values.length >= 3 && current.id != current.enemyId) {
            next1 = players[current.enemyId]
            next2 = values
              .filter(
                player =>
                  player.id != current.id && player.id != current.enemyId
              )
              .sort((a, b) => a.enemyId == null)
              .pop()
            if (next1.enemyId != null) {
              // 2.er ist fix gesetzt
              if (players[next1.enemyId].enemyId == current.id) {
                // Triple fertig fix gesetzt nichts machen
                enemies[next1.id] = next1.enemyId
                enemies[next1.enemyId] = current.id
                values.splice(values.map(p => p.id).indexOf(next1.id), 1)
                values.splice(values.map(p => p.id).indexOf(next1.enemyId), 1)
              } else if (players[next1.enemyId].enemyId == null) {
                // 3. Spieler setzen
                enemies[next1.id] = next1.enemyId
                enemies[next1.enemyId] = current.id
                values.splice(values.map(p => p.id).indexOf(next1.id), 1)
                values.splice(values.map(p => p.id).indexOf(next1.enemyId), 1)
              }
            } else if (next2.enemyId == null) {
              // Triple offen, 2 Spieler fertig setzen
              enemies[next1.id] = next2.id
              enemies[next2.id] = current.id
              values.splice(values.map(p => p.id).indexOf(next1.id), 1)
              values.splice(values.map(p => p.id).indexOf(next2.id), 1)
            }
          } else if (
            values.length > 1 &&
            (values.length - 2 == 0 || values.length - 2 > 2)
          ) {
            // Paaring möglich
            next1 = players[current.enemyId]
            if (next1.enemyId == null) {
              // Gegener hat noch keine Fixe Zuteilung
              enemies[current.enemyId] = current.id
              values.splice(values.map(p => p.id).indexOf(current.enemyId), 1)
            }
          }
        } else {
          // Frei
          if (
            values.length > 1 &&
            (values.length % 2 == 0 || values.length - 2 >= 3)
          ) {
            // Paaring möglich
            next1 = values[1]
            enemies[current.id] = next1.id
            enemies[next1.id] = current.id
            values.splice(1, 1)
          } else if (values.length >= 3) {
            // Triple Paaring
            next1 = values[1]
            next2 = values[2]
            enemies[current.id] = next1.id
            enemies[next1.id] = next2.id
            enemies[next2.id] = current.id
            values.splice(1, 2)
          } else {
            // Nur noch ein Spieler übrig
            enemies[current.id] = current.id
          }
        }
        values.splice(0, 1)
      }
      this.enemies = enemies
      return enemies
    },
    save(color) {
      let id = null

      if (this.selectEnemy) {
        this.players[this.selectedPlayerId].enemyId = Object.values(
          this.players
        ).filter(player => player.color == color)[0].id
        this.enemies = this.getEnemies()
      } else {
        this.players[this.selectedPlayerId].color = color
      }

      this.selectedPlayerId = null
      this.selectEnemy = false
    }
  },
  components: {
    ColorDialog
  }
}
</script>

<style lang="scss">
.table {
  text-align: center;
  tbody,
  thead {
    vertical-align: middle !important;
  }
}
.bi-x-circle {
  color: red;
}
.bi-check2 {
  color: green;
}
.avatar {
  width: 30px;
  aspect-ratio: 1;
  border-radius: 50%;
  text-align: center;
  font-size: 0px;
  display: inline-block;
}
</style>
