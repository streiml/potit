<template>
  <h3 class="mt-2">New Game</h3>
  <div class="container-fluid">
    <a
      href=""
      class="text-decoration-none text-reset"
      @click.prevent="select('classic')"
    >
      <div class="row border rounded py-2">
        <div class="w-auto">
          <classic-board
            style="width: 100px"
            :board="[1, 8, 0, 0, 8, 8, 8, 8, 0, 0, 8, 1, 0, 0, 8, 1]"
            playerColor="teal"
            :isVisible="true"
            :isActive="false"
            :cols="4"
            :rows="4"
            mode="set"
            size="thumb"
          ></classic-board>
        </div>
        <div class="" style="width: min-content; flex-grow: 1">
          <h4>Classic</h4>
          <p>Play on a classic board</p>
        </div>
      </div>
    </a>
    <a
      href=""
      class="text-decoration-none text-reset"
      @click.prevent="select('darts')"
    >
      <div class="row mt-2 border rounded py-2">
        <div class="w-auto">
          <dart-board
            style="width: 100px"
            :board="[]"
            playerColor="gray"
            :isVisible="true"
            :isActive="true"
            size="thumb"
          ></dart-board>
        </div>
        <div class="" style="width: min-content; flex-grow: 1">
          <h4>Darts</h4>
          <p>Play on a dartboard</p>
        </div>
      </div>
    </a>
  </div>
</template>
<script>
import ClassicBoard from '@/components/ClassicBoard.vue'
import DartBoard from '@/components/DartBoard.vue'

export default {
  name: 'SelectGame',
  data: function () {
    let settings = this.$store.state.settings
    settings.rows = 4
    settings.cols = 4

    return {
      settings: settings
    }
  },
  methods: {
    select(game) {
      this.$store.commit('selectGame', game)
      this.$router.push('/settings')
    }
  },
  components: {
    DartBoard,
    ClassicBoard
  }
}
</script>

<style lang="scss" scoped>
.row:hover {
  background-color: lightgray !important;
}
</style>
