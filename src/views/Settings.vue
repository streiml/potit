<template>
  <nav id="nav" class="navbar navbar-light bg-light">
    <router-link to="/" class="btn btn-outline-success" type="button">
      <i class="bi bi-house-fill"></i>
    </router-link>
    <router-link
      :to="Object.keys(players).length > 0 ? '/playerlist' : '/player'"
      :class="{
        btn: true,
        'btn-outline-success': true,
        disabled: Object.values(settings.units).reduce((a, b) => a + b, 0) == 0
      }"
      type="button"
    >
      <i v-if="Object.keys(players).length > 0" class="bi bi-people-fill"></i>
      <i v-else class="bi bi-person-fill-add"></i>
    </router-link>
  </nav>
  <form class="form-floating">
    <div class="bg-light px-2 py-4">
      <h3>Board</h3>
      <div v-if="settings.game == 'classic'" class="mb-3">
        <label for="rows" class="form-label">Rows</label>
        <span class="badge text-bg-primary ms-2"
          >A - {{ String.fromCharCode(64 + rows) }}</span
        >
        <input
          type="range"
          class="form-range"
          min="6"
          max="26"
          step="1"
          v-model.number="rows"
          id="rows"
        />
      </div>
      <div v-if="settings.game == 'classic'" class="mb-3">
        <label for="cols" class="form-label">Columns</label>
        <span class="badge text-bg-primary ms-2">1 - {{ cols }}</span>
        <input
          type="range"
          class="form-range"
          min="6"
          max="26"
          step="1"
          v-model.number="cols"
          id="cols"
        />
      </div>
      <div
        v-if="settings.game == 'darts'"
        class="form-check form-switch form-check-reverse text-start"
      >
        <label for="margin" class="form-label">Bull</label>
        <span class="badge text-bg-primary ms-2">{{
          settings.sonar ? 'Enabled' : 'Disabled'
        }}</span>
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="sonar"
          v-model="settings.sonar"
        />
        <p v-if="settings.sonar">Units can be revealed</p>
      </div>
    </div>
    <div class="bg-white px-2 py-4">
      <h3>Units</h3>
      <div v-for="i in [4, 3, 2, 1]" class="mb-3" :key="i">
        <!--<label :for="'unit' + i" class="form-label">Units {{ i }}</label>-->
        <div
          :style="{
            display: 'inline-grid',
            gridTemplateColumns: 'repeat(' + i + ', ' + 25 + 'px)'
          }"
        >
          <div
            v-for="i in Number(i)"
            :key="i"
            :style="{
              outline: '1px solid white',
              backgroundColor: $PlayerColor['teal']
            }"
          >
            &nbsp;
          </div>
        </div>
        <span class="badge text-bg-primary ms-2">{{ settings.units[i] }}</span>
        <input
          type="range"
          class="form-range"
          min="0"
          :max="max(i)"
          step="1"
          v-model.number="settings.units[i]"
          :id="'unit' + i"
        />
      </div>
      <div class="form-check form-switch form-check-reverse text-start">
        <label for="margin" class="form-label">Spacing</label>
        <span class="badge text-bg-primary ms-2">{{
          settings.margin ? 'Yes' : 'No'
        }}</span>
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="margin"
          v-model="settings.margin"
        />
      </div>
      <div v-if="settings.game == 'classic'" style="width: 100px">
        <classic-board
          v-if="settings.margin"
          :board="[1, 8, 0, 0, 8, 8, 8, 8, 0, 0, 8, 1, 0, 0, 8, 1]"
          playerColor="teal"
          :isVisible="true"
          :isActive="false"
          :cols="4"
          :rows="4"
          mode="set"
          size="thumb"
        ></classic-board>
        <classic-board
          v-else
          :board="[1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0]"
          playerColor="teal"
          :isVisible="true"
          :isActive="false"
          :cols="4"
          :rows="4"
          mode="set"
          size="thumb"
        ></classic-board>
      </div>
      <div v-else style="max-width: 200px; width: 200px">
        <dart-board
          :board="drawDartboard()"
          playerColor="teal"
          :isVisible="true"
          :isActive="false"
          mode="set"
        ></dart-board>
      </div>
    </div>
    <div class="bg-light px-2 py-4">
      <h3>Game</h3>
      <div class="mb-3">
        <label for="rows" class="form-label">Shots</label>
        <span class="badge text-bg-primary ms-2">{{ settings.shots }}</span>
        <input
          type="range"
          class="form-range"
          min="1"
          max="4"
          step="1"
          v-model.number="settings.shots"
          id="shots"
        />
      </div>
    </div>
  </form>
</template>

<script>
// @ is an alias to /src
import ClassicBoard from '@/components/ClassicBoard.vue'
import DartBoard from '@/components/DartBoard.vue'
import Player from '@/classes/Player.js'

export default {
  name: 'Settings',
  data: function () {
    let state = this.$store.state

    return {
      settings: state.settings,
      players: state.players,
      rows: state.settings.rows,
      cols: state.settings.cols,
      size: 10
    }
  },
  watch: {
    rows(n) {
      this.settings.rows = n

      if (this.max(1) < this.settings.units[1])
        this.settings.units[1] = this.max(1)
      if (this.max(2) < this.settings.units[2])
        this.settings.units[2] = this.max(2)
      if (this.max(3) < this.settings.units[3])
        this.settings.units[3] = this.max(3)
      if (this.max(4) < this.settings.units[4])
        this.settings.units[4] = this.max(4)
    },
    cols(n) {
      this.settings.cols = n
      if (this.max(1) < this.settings.units[1])
        this.settings.units[1] = this.max(1)
      if (this.max(2) < this.settings.units[2])
        this.settings.units[2] = this.max(2)
      if (this.max(3) < this.settings.units[3])
        this.settings.units[3] = this.max(3)
      if (this.max(4) < this.settings.units[4])
        this.settings.units[4] = this.max(4)
    }
  },
  methods: {
    bgColor(i) {
      if (this.settings.margin) {
        if ([3, 5, 9, 13, 23, 24].includes(i)) return this.$PlayerColor['teal']
        if ([7, 8, 19].includes(i)) return 'white'
        return 'rgb(200, 200, 200)'
      } else {
        if ([1, 6, 7, 8, 10, 12, 13, 18, 21, 22, 23, 24].includes(i))
          return this.$PlayerColor['teal']
        return 'white'
      }
    },
    max(units) {
      let count =
        Math.max(parseInt((this.settings.rows * this.settings.cols) / 36), 1) *
        3

      return units < 3 ? Math.min(count * 2, 20) : Math.min(count, 10)
    },
    drawDartboard() {
      let player = new Player()
      if (this.settings.margin) {
        player.addUnit([0])
        player.addUnit([10, 11])
        player.addUnit([51, 47])
      } else {
        player.addUnit([14, 15])
        player.addUnit([5, 9])
        player.addUnit([65, 66])
        player.addUnit([47, 51])
        player.addUnit([30, 31])
        player.addUnit([40, 41, 42])
      }
      return player.board
    }
  },
  components: {
    DartBoard,
    ClassicBoard
  }
}
</script>

<style lang="scss" scoped>
.form-label {
  font-weight: bold;
}
form .bg-light {
  background-color: #efefef !important;
}
</style>
