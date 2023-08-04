<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="colorDialog"
    tabindex="-1"
    aria-labelledby="colorDialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Choose Color</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close()"
          ></button>
        </div>
        <div class="modal-body">
          <div class="colors">
            <template
              :class="name"
              v-for="(color, name) in $PlayerColor"
              :key="name"
            >
              <input
                type="radio"
                class="btn-check"
                name="color"
                :disabled="colorInUse(name)"
                :id="name"
                v-model="picked"
                v-if="name != 'gray'"
                :value="name"
              />
              <label
                v-if="name != 'gray'"
                class="btn"
                :style="{
                  '--bs-btn-bg': colorInUse(name) ? 'transparent' : color,
                  '--bs-btn-active-bg': colorInUse(name)
                    ? 'transparent'
                    : color,
                  //'box-shadow': '0 0 3px 3px ' + color
                  '--bs-btn-border-color': color
                }"
                :for="name"
              ></label>
            </template>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            :disabled="picked == null"
            data-bs-dismiss="modal"
            class="btn btn-primary mx-auto"
            @click="save()"
          >
            <i class="bi bi-check2 text-white mx-1"></i> Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import { Modal } from 'bootstrap'
import Player from '@/classes/Player.js'

export default {
  name: 'ColorDialog',
  data: function () {
    /*
    let players = {},
      player = new Player()

    player.color = 'cyan'
    players[player.getId()] = player
*/
    return {
      //players: Object.values(this.$store.state.players)
      players: Object.values(this.$store.state.players),
      picked: null
      //modal: new Modal('#colorDialog', {})
    }
  },
  methods: {
    colorInUse(name) {
      if (this.mode == 'enemy') {
        return this.players.filter(player => player.color == name).length == 0
      }
      return this.players.filter(player => player.color == name).length > 0
    },
    close() {},
    save() {
      this.$emit('color', this.picked)
    }
  },
  props: ['color', 'mode'],
  emits: ['color']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.colors {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.btn-check:checked + .btn {
  box-shadow: 0 0 5px 5px #444;
  opacity: 1 !important;
}

.colors > label {
  margin: 5px;
  aspect-ratio: 1;
  opacity: 0.8;
  border-radius: 50%;
}
</style>
