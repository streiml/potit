<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/getting-started"
              >Getting Started</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="row">
    <div class="col">
      <select-game></select-game>
    </div>
    <div
      class="col"
      style="
        display: flex;
        flex-flow: column;
        justify-content: stretch;
        align-content: flex-start;
      "
    >
      <join-game></join-game>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import SelectGame from '@/components/SelectGame.vue'
import JoinGame from '@/components/JoinGame.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  name: 'HomeView',
  methods: {
    number(c, x, y) {
      if (c == 1) {
        return 72 + y - (x - 1) * 9
      } else if (c == 2) {
        return 82 - x - (y - 1) * 9
      } else if (c == 4) {
        return 9 - (y - 1) + (x - 1) * 9
      }
      return x + (y - 1) * 9
    }
  },
  components: {
    SelectGame,
    JoinGame
    //Board
  }
}
</script>

<style lang="scss"></style>
