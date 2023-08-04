<template>
  <transition class="animate__animated animate__slow animate__heartBeat">
    <div class="thumbs" v-if="thumbsUp">
      <i class="bi bi-hand-thumbs-up-fill"></i>
    </div>
  </transition>
  <transition class="animate__animated animate__slow animate__heartBeat">
    <div class="thumbs" v-if="thumbsDown">
      <i class="bi bi-hand-thumbs-down-fill"></i>
    </div>
  </transition>
  <nav id="nav" class="navbar sticky-top bg-light">
    <div>
      <div class="btn-group ms-2">
        <button
          type="button"
          class="btn btn-success"
          :disabled="player.selected.length == 0"
          @click="undo()"
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
                disabled: player.selected.length == 0
              }"
              href=""
              @click.prevent="undo()"
              ><i class="bi bi-arrow-counterclockwise"></i> Undo
            </a>
          </li>
          <li>
            <a
              :class="{
                'dropdown-item': true,
                disabled: players[order[0]].shots.length == 0
              }"
              href=""
              data-bs-toggle="modal"
              data-bs-target="#backDialog"
              ><i class="bi bi-backspace"></i> Back
            </a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item" href="" @click.prevent="exit(true)"
              ><i class="bi bi-box-arrow-left"></i> Exit</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper px-2">
      <Carousel
        ref="slider"
        @slide-end="playerChanged"
        :items-to-show="$store.state.screen.portrait ? 1.3 : 2"
        :wrapAround="Object.values(players).length > 1 ? true : false"
      >
        <Slide v-for="(player, id) in players" :key="id">
          <units2
            :units="player.getActiveUnits()"
            :active="id == order[active]"
            :color="player.color"
            @click="showRanking()"
          ></units2>
        </Slide>
      </Carousel>
    </div>
    <div>
      <button
        :class="{
          btn: true,
          'me-2': true,
          'btn-success': true,
          disabled: currentSlideIndex != active
        }"
        @click="potit"
      >
        <i class="bi bi-check2 text-white mx-1"></i>
      </button>
    </div>
  </nav>
  <div class="content">
    <div class="boards">
      <template v-for="(player, id) in players" :key="id">
        <classic-board
          v-if="settings.game == 'classic'"
          :board="player.board"
          :playerColor="player.color"
          :enemyColor="players[player.enemyId].color"
          :isVisible="order[currentSlideIndex] == id"
          :isActive="order[active] == id"
          size="fluid"
          :cols="settings.cols"
          :rows="settings.rows"
          mode="play"
          @select="select"
        ></classic-board>
        <dart-board
          v-else
          :board="player.board"
          :playerColor="player.color"
          :enemyColor="players[player.enemyId].color"
          :isVisible="order[currentSlideIndex] == id"
          :isActive="order[active] == id"
          size="fluid"
          mode="play"
          @select="select"
        ></dart-board>
      </template>
    </div>
    <div class="ranking">
      <h3 class="text-center mt-1 fs-4">
        Round {{ players[order[order.length - 1]].shots.length + 1 }}
      </h3>
      <ranking :players="players" mode="play"></ranking>
    </div>
  </div>

  <div
    class="modal fade"
    id="rankingDialog"
    tabindex="-1"
    data-bs-backdrop="static"
    aria-labelledby="rankingDialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            <span v-if="finished">Congratulations!</span>
            <span v-else
              >Round
              {{ players[order[order.length - 1]].shots.length + 1 }}</span
            >
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="exit(finished)"
            aria-label="Close"
          ></button>
        </div>
        <div ref="rankingBody" class="modal-body">
          <ranking :players="players" mode="finish"></ranking>
        </div>
        <div v-if="finished" class="modal-footer">
          <button
            type="button"
            class="btn btn-primary mx-auto"
            @click="exit(finished)"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="modal fade"
    id="backDialog"
    tabindex="-1"
    aria-labelledby="backDialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Back</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Do you want to go to the previous player?</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="back()"
            data-bs-dismiss="modal"
          >
            Yes
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ClassicBoard from '@/components/ClassicBoard.vue'
import DartBoard from '@/components/DartBoard.vue'
import Ranking from '@/components/Ranking.vue'
import Units2 from '@/components/Units2.vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

// https://ismail9k.github.io/vue3-carousel/
import 'vue3-carousel/dist/carousel.css'
import Player from '@/classes/Player.js'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'
//import { useElementSize } from '@vueuse/core'

export default {
  name: 'Game',
  data: function () {
    let store = this.$store.state
    /*    players = {},
      player = new Player(),
      first = player.getId(),
      units = null

    //this.$store.dispatch('current', player.getId())
    player.addUnit([0])
    player.addUnit([1, 2])
    player.addUnit([4, 5, 6])
    player.addUnit([8, 9, 10, 11])

    players[first] = player

    player = new Player()
    player.addUnit([26])
    player.addUnit([28, 29])
    player.addUnit([32, 33, 34])
    player.addUnit([36, 37, 38, 39])
    player.color = 'cyan'
    units = player.ownUnits
    player.setEnemy(first, players[first].ownUnits)
    players[player.getId()] = player

    players[first].setEnemy(player.getId(), units)

    this.$store.dispatch('editPlayer', players[first])
    this.$store.dispatch('editPlayer', player)
    this.$store.dispatch('start')
*/
    return {
      settings: store.settings,
      order: store.order,
      players: store.players,
      active: 0,
      currentSlideIndex: 0,
      thumbsDown: false,
      thumbsUp: false,
      finished: false,
      portrait: window.matchMedia('(orientation: portrait)').matches,
      player: store.players[store.order[0]]
    }
  },
  computed: {
    slider() {
      return this.$refs.slider
    },
    rankingDialog() {
      return new Modal('#rankingDialog', {})
    }
  },
  methods: {
    getWidth() {
      return this.$refs.rankingBody ? this.$refs.rankingBody.clientWidth : 0
    },
    showRanking() {
      if (this.$store.state.screen.portrait) this.rankingDialog.show()
    },
    save() {},
    undo() {
      if (this.player.selected.length > 0) {
        this.player.selected.pop()
      }

      this.player.update()
    },
    back() {
      let player =
        this.players[
          this.order[this.active == 0 ? this.order.length - 1 : this.active - 1]
        ]
      player.revertShot()
      this.player.select(null)
      this.active = this.active == 0 ? this.order.length - 1 : this.active - 1
      //this.slider.slideTo(this.active)
      this.slider.prev()
    },
    exit(quit) {
      if (quit) {
        this.rankingDialog.hide()
        this.$router.push('/')
      }
    },
    playerChanged(e) {
      this.currentSlideIndex = e.currentSlideIndex
      this.player = this.players[this.order[this.currentSlideIndex]]
    },
    potit() {
      let success = this.player.addShots(this.player.selected)

      if (this.player.hasFinished()) {
        this.finished = true
        this.$store.dispatch('revealAll')
        this.rankingDialog.show()
      } else {
        this.thumbsUp = success
        this.thumbsDown = !success

        setTimeout(() => {
          this.thumbsUp = false
          this.thumbsDown = false
          this.active =
            this.active == this.order.length - 1 ? 0 : this.active + 1
          //this.slider.slideTo(this.active)
          this.slider.next()
        }, 2000)
        //this.$store.dispatch('potit')
      }
    },
    select(pos) {
      this.player.select(pos)
    }
  },
  components: {
    ClassicBoard,
    DartBoard,
    Units2,
    Carousel,
    Slide,
    Ranking
  }
}
</script>

<style lang="scss">
.boards {
  overflow: auto;
  flex-grow: 1;
}

.wrapper {
  flex-basis: 100%;
  min-width: 0;
}

.navbar {
  flex-wrap: nowrap;
}

/*
.carousel__slide {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
*/

.carousel__track {
  margin-bottom: 0;
  margin-top: 0;
}

.button:disabled {
  opacity: 0.5;
}

.ranking {
  min-width: 200px;
  max-width: 200px;
  border-left: 5px solid #f3f3f3;
  margin-left: 5px;
  padding-left: 5px;
}

.content {
  display: flex;
  //align-items: center;
  justify-content: center;
}

.thumbs {
  display: none;
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  font-size: 200px;
  margin: 0;
  padding: 0;
  justify-content: center; /*centers items on the line (the x-axis by default)*/
  align-items: center; /*centers items on the cross-axis (y by default)*/
}

.thumbs.v-enter-active {
  display: flex;
}

.bi-hand-thumbs-up-fill {
  color: green;
}

.bi-hand-thumbs-down-fill {
  color: red;
}

@media (orientation: portrait) {
  .content .ranking {
    display: none;
  }
}
</style>
