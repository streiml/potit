<template>
  <nav id="nav" class="navbar sticky-top bg-light">
    <div class="btn-group" role="group">
      <button
        type="button"
        :class="{
          btn: true,
          'btn-success': true,
          disabled: player.selected.length == 0 && player.units.length == 0
        }"
        @click.prevent="undo()"
      >
        <i class="bi bi-arrow-counterclockwise mx-1"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="visually-hidden">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a
            :class="{
              'dropdown-item': true,
              disabled: player.selected.length == 0 && player.units.length == 0
            }"
            href=""
            @click.prevent="undo()"
            ><i class="bi bi-arrow-counterclockwise"></i> Undo
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="" @click.prevent="clear()"
            ><i class="bi bi-app"></i> Clear
          </a>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" href="" @click.prevent="close()"
            ><i class="bi bi-box-arrow-left"></i> Close</a
          >
        </li>
      </ul>
    </div>

    <units2
      :units="player.getActiveUnits(true)"
      :active="true"
      :color="player.color"
    ></units2>
    <button
      :class="{
        btn: true,
        'btn-success': true,
        disabled: player.unitsCount(true) > 0
      }"
      @click="done()"
    >
      <i class="bi bi-check2 text-white mx-1"></i>
    </button>
  </nav>
  <div class="boards">
    <classic-board
      v-if="settings.game == 'classic'"
      :board="player.board"
      :playerColor="player.color"
      :isVisible="true"
      :isActive="true"
      :cols="settings.cols"
      :rows="settings.rows"
      mode="set"
      @select="select"
    ></classic-board>
    <dart-board
      v-else
      :board="player.board"
      :playerColor="player.color"
      :isVisible="true"
      :isActive="true"
      mode="set"
      @select="select"
    ></dart-board>
  </div>
  <color-dialog @color="save"></color-dialog>
</template>

<script>
// @ is an alias to /src
import Units2 from '@/components/Units2.vue'
import ClassicBoard from '@/components/ClassicBoard.vue'
import DartBoard from '@/components/DartBoard.vue'
import ColorDialog from '@/components/ColorDialog.vue'
import Player from '@/classes/Player.js'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  name: 'EditPlayer',
  data: function () {
    let state = this.$store.state,
      players = state.players,
      settings = this.$store.state.settings,
      id = this.$route.params.id,
      player

    if (id === undefined || id == '') {
      player = new Player()
    } else {
      player = players[id]
    }

    return {
      settings: settings,
      player: player
    }
  },
  computed: {
    colorDialog() {
      return new Modal('#colorDialog', {})
    }
  },
  methods: {
    undo() {
      if (this.player.selected.length > 0) {
        this.player.selected = []
        this.player.neighbours = []
      } else {
        this.player.units.pop()
      }

      this.player.update()
    },
    clear() {
      this.player.clear()
    },
    close() {
      this.player.selected = []
      this.player.neighbours = []
      this.player.setUnits(this.player.ownUnits)
      this.$router.push('/playerlist')
    },
    done() {
      if (this.player.color == 'gray') {
        this.colorDialog.show()
      } else {
        this.save(this.player.color)
      }
    },
    save(color) {
      this.player.color = color
      this.player.setUnits(this.player.units)
      this.colorDialog.hide()
      this.$store.dispatch('editPlayer', this.player)
      this.$router.push('/playerlist')
    },
    select(pos) {
      let activeUnits = this.player.getActiveUnits(true)
      if (this.player.unitsCount(true)) {
        if (this.player.selected.includes(pos)) {
          this.player.select(null)
        } else if (this.player.neighbours.length > 0) {
          this.player.neighbours.forEach(u => {
            if (u.includes(pos)) this.player.addUnit(u)
          })
          this.player.select(null)
        } else if (
          activeUnits[4] == 0 &&
          activeUnits[3] == 0 &&
          activeUnits[2] == 0 &&
          activeUnits[1] > 0
        ) {
          this.player.addUnit([pos])
        } else {
          this.player.select(pos, true)
        }
      }
    }
  },
  components: {
    Units2,
    DartBoard,
    ClassicBoard,
    ColorDialog
  }
}
</script>

<style lang="scss">
.boards {
  overflow: auto;
  padding: 10px;
}
</style>
