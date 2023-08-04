<script>
//import Dartboard from 'dartboard'
import { uuid } from 'vue-uuid'

export default {
  name: 'DartBoard',
  data: function () {
    return {
      cross: 'cross-' + uuid.v1(),
      stripe: 'stripe-' + uuid.v1(),
      cDartboard: {},
      sonar: this.$store.state.settings.sonar
    }
  },
  mounted() {
    this.drawBoard()
  },
  props: [
    'board',
    'playerColor',
    'enemyColor',
    'isVisible',
    'isActive',
    'size',
    'mode'
  ],
  emits: ['select'],
  watch: {
    board: {
      handler(newValue, oldValue) {
        this.drawBoard()
      },
      deep: true
    }
  },
  methods: {
    clicked(pos) {
      this.$emit('select', pos)
    },
    drawBoard() {
      this.board.forEach((state, index) => {
        this.cDartboard[index] = {
          disabled: state < 0 ? true : false,
          placed: this.mode == 'set' && state == 1 ? true : false,
          visible: state == 2 ? true : false,
          damaged: state == 3 ? true : false,
          destroyed: state == 4 ? true : false,
          empty: state == 5 ? true : false,
          selected: state == 6 ? true : false,
          choice: state == 7 ? true : false,
          margin: this.mode == 'set' && state == 8 ? true : false
        }
      })
      if (this.mode == 'set' || (this.mode == 'play' && this.sonar == false))
        this.cDartboard['80'] = { disabled: true }
    }
  }
}
</script>
<style lang="scss" scoped>
.c-Dartboard-bed.empty {
  // fill: rgb(77, 77, 77) !important;
  fill: var(--border-color) !important;
  pointer-events: none;
}
.c-Dartboard-bed.visible {
  fill: var(--stripe) !important;
  pointer-events: all;
}
.c-Dartboard-bed.choice {
  fill: var(--stripe) !important;
}
.c-Dartboard-bed.margin {
  fill: rgb(228, 152, 152) !important;
  pointer-events: none;
}

.c-Dartboard-bed.damaged {
  fill: var(--cross) !important;
  pointer-events: none;
}
.c-Dartboard-bed.destroyed {
  fill: var(--enemy-color) !important;
  pointer-events: none;
}
.c-Dartboard-bed.placed {
  fill: var(--player-color) !important;
  pointer-events: none;
}
.c-Dartboard-bed.selected {
  fill: var(--player-color) !important;
}
.c-Dartboard-bed.disabled {
  fill: rgb(228, 152, 152) !important;
  pointer-events: none;
}
.c-Dartboard {
  stroke: var(--border-color);
  stroke-width: 1px;
  pointer-events: none;
  display: none;
  opacity: 0.6;
  text-align: center;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.c-Dartboard.visible {
  display: block;
}

.c-Dartboard.active {
  pointer-events: all;
  opacity: 1;
}

.c-Dartboard-borders {
  fill: var(--legend-color);
}
.c-Dartboard-borderLabel {
  font-family: sans-serif;
  fill: white;
  stroke-width: 0;
}
.c-Dartboard-bed.isDark {
  fill: var(--dark-field-color);
}
.c-Dartboard-bed.isLight {
  fill: ivory;
}
.c-Dartboard-double .c-Dartboard-bed.isDark,
.c-Dartboard-triple .c-Dartboard-bed.isDark,
.c-Dartboard-innerBull .c-Dartboard-bed.isDark,
.c-Dartboard-outerBull .c-Dartboard-bed.isDark {
  //fill: red;
  fill: var(--red-field-color);
  //fill-opacity: 0.6;
  fill-opacity: 1;
}
.c-Dartboard-double .c-Dartboard-bed.isLight,
.c-Dartboard-triple .c-Dartboard-bed.isLight,
.c-Dartboard-innerBull .c-Dartboard-bed.isLight,
.c-Dartboard-outerBull .c-Dartboard-bed.isLight {
  //fill: green;
  fill: var(--green-field-color);
  //fill-opacity: 0.6;
  fill-opacity: 1;
}
.c-Dartboard-bed:hover,
.c-Dartboard-border:hover {
  fill-opacity: 0.6;
  cursor: pointer;
}

@media (orientation: portrait) {
  .large {
    width: 100vh;
  }
}
</style>
<template>
  <div
    :class="{
      'c-Dartboard': true,
      active: isActive,
      visible: isVisible,
      large: mode == 'set' || mode == 'play'
    }"
    :style="{
      '--player-color': this.$PlayerColor[this.playerColor],
      '--border-color': this.$PlayerColor[this.playerColor] + '50',
      '--legend-color':
        this.mode == 'set' ? '#000000' : this.$PlayerColor[this.playerColor],
      '--enemy-color': this.$PlayerColor[this.enemyColor],
      '--cross': 'url(#' + cross + ')',
      '--stripe': 'url(#' + stripe + ')',
      '--green-field-color': size == 'thumb' ? 'green' : 'white',
      '--dark-field-color': size == 'thumb' ? 'black' : 'white',
      '--red-field-color': size == 'thumb' ? 'red' : 'white'
    }"
  >
    <svg viewBox="0 0 600 600">
      <defs>
        <pattern
          :id="stripe"
          patternUnits="userSpaceOnUse"
          width="7"
          height="7"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y="0"
            x2="0"
            y2="7"
            :stroke="$PlayerColor[enemyColor]"
            stroke-width="3"
          />
        </pattern>
        <pattern
          :id="cross"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            :stroke="$PlayerColor[enemyColor]"
            stroke-linecap="round"
            stroke-width="2"
            d="M 5,5 L 10,10"
          />
          <path
            :stroke="$PlayerColor[enemyColor]"
            stroke-linecap="round"
            stroke-width="2"
            d="M 5,5 L 0,10"
          />
          <path
            :stroke="$PlayerColor[enemyColor]"
            stroke-linecap="round"
            stroke-width="2"
            d="M 5,5 L 10,0"
          />
          <path
            :stroke="$PlayerColor[enemyColor]"
            stroke-linecap="round"
            stroke-width="2"
            d="M 5,5 L 0,0"
          />
        </pattern>
      </defs>
      <g transform="translate(300, 300) rotate(-9)">
        <g class="c-Dartboard-innerBull">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerBull--50',
              'isDark',
              cDartboard['80']
            ]"
            @click="clicked('80')"
          >
            <path
              d="M1.285879139104721e-15,-21.000000000000004A21.000000000000004,21.000000000000004,0,1,1,-1.285879139104721e-15,21.000000000000004A21.000000000000004,21.000000000000004,0,1,1,1.285879139104721e-15,-21.000000000000004Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-outerBull">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerBull--25',
              'isLight',
              cDartboard['80']
            ]"
            @click="clicked('80')"
          >
            <path
              d="M2.7554552980815448e-15,-45A45,45,0,1,1,-2.7554552980815448e-15,45A45,45,0,1,1,2.7554552980815448e-15,-45M-3.857637417314163e-15,-21.000000000000004A21.000000000000004,21.000000000000004,0,1,0,3.857637417314163e-15,21.000000000000004A21.000000000000004,21.000000000000004,0,1,0,-3.857637417314163e-15,-21.000000000000004Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-innerSingle">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--20',
              'isDark',
              cDartboard['0']
            ]"
            @click="clicked(0)"
          >
            <path
              d="M8.266365894244634e-15,-135A135,135,0,0,1,41.7172942406179,-128.3926296998457L13.905764746872634,-42.79754323328191A45,45,0,0,0,2.7554552980815448e-15,-45Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--1',
              'isLight',
              cDartboard['4']
            ]"
            @click="clicked(4)"
          >
            <path
              d="M41.7172942406179,-128.3926296998457A135,135,0,0,1,79.35100905948387,-109.2172942406179L26.45033635316129,-36.405764746872634A45,45,0,0,0,13.905764746872634,-42.79754323328191Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--18',
              'isDark',
              cDartboard['8']
            ]"
            @click="clicked(8)"
          >
            <path
              d="M79.35100905948387,-109.2172942406179A135,135,0,0,1,109.2172942406179,-79.35100905948387L36.405764746872634,-26.45033635316129A45,45,0,0,0,26.45033635316129,-36.405764746872634Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--4',
              'isLight',
              cDartboard['12']
            ]"
            @click="clicked(12)"
          >
            <path
              d="M109.2172942406179,-79.35100905948387A135,135,0,0,1,128.3926296998457,-41.717294240617896L42.79754323328191,-13.905764746872633A45,45,0,0,0,36.405764746872634,-26.45033635316129Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--13',
              'isDark',
              cDartboard['16']
            ]"
            @click="clicked(16)"
          >
            <path
              d="M128.3926296998457,-41.717294240617896A135,135,0,0,1,135,0L45,0A45,45,0,0,0,42.79754323328191,-13.905764746872633Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--6',
              'isLight',
              cDartboard['20']
            ]"
            @click="clicked(20)"
          >
            <path
              d="M135,0A135,135,0,0,1,128.3926296998457,41.717294240617896L42.79754323328191,13.905764746872633A45,45,0,0,0,45,0Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--10',
              'isDark',
              cDartboard['24']
            ]"
            @click="clicked(24)"
          >
            <path
              d="M128.3926296998457,41.717294240617896A135,135,0,0,1,109.2172942406179,79.35100905948387L36.405764746872634,26.45033635316129A45,45,0,0,0,42.79754323328191,13.905764746872633Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--15',
              'isLight',
              cDartboard['28']
            ]"
            @click="clicked(28)"
          >
            <path
              d="M109.2172942406179,79.35100905948387A135,135,0,0,1,79.35100905948387,109.2172942406179L26.45033635316129,36.405764746872634A45,45,0,0,0,36.405764746872634,26.45033635316129Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--2',
              'isDark',
              cDartboard['32']
            ]"
            @click="clicked(32)"
          >
            <path
              d="M79.35100905948387,109.2172942406179A135,135,0,0,1,41.7172942406179,128.3926296998457L13.905764746872634,42.79754323328191A45,45,0,0,0,26.45033635316129,36.405764746872634Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--17',
              'isLight',
              cDartboard['36']
            ]"
            @click="clicked(36)"
          >
            <path
              d="M41.7172942406179,128.3926296998457A135,135,0,0,1,8.266365894244634e-15,135L2.7554552980815448e-15,45A45,45,0,0,0,13.905764746872634,42.79754323328191Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--3',
              'isDark',
              cDartboard['40']
            ]"
            @click="clicked(40)"
          >
            <path
              d="M8.266365894244634e-15,135A135,135,0,0,1,-41.71729424061789,128.39262969984574L-13.90576474687263,42.797543233281914A45,45,0,0,0,2.7554552980815448e-15,45Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--19',
              'isLight',
              cDartboard['44']
            ]"
            @click="clicked(44)"
          >
            <path
              d="M-41.71729424061789,128.39262969984574A135,135,0,0,1,-79.35100905948386,109.2172942406179L-26.450336353161287,36.405764746872634A45,45,0,0,0,-13.90576474687263,42.797543233281914Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--7',
              'isDark',
              cDartboard['48']
            ]"
            @click="clicked(48)"
          >
            <path
              d="M-79.35100905948386,109.2172942406179A135,135,0,0,1,-109.21729424061789,79.35100905948389L-36.40576474687263,26.450336353161298A45,45,0,0,0,-26.450336353161287,36.405764746872634Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--16',
              'isLight',
              cDartboard['52']
            ]"
            @click="clicked(52)"
          >
            <path
              d="M-109.21729424061789,79.35100905948389A135,135,0,0,1,-128.3926296998457,41.71729424061791L-42.79754323328191,13.905764746872638A45,45,0,0,0,-36.40576474687263,26.450336353161298Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--8',
              'isDark',
              cDartboard['56']
            ]"
            @click="clicked(56)"
          >
            <path
              d="M-128.3926296998457,41.71729424061791A135,135,0,0,1,-135,1.6532731788489267e-14L-45,5.5109105961630896e-15A45,45,0,0,0,-42.79754323328191,13.905764746872638Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--11',
              'isLight',
              cDartboard['60']
            ]"
            @click="clicked(60)"
          >
            <path
              d="M-135,1.6532731788489267e-14A135,135,0,0,1,-128.39262969984574,-41.71729424061788L-42.797543233281914,-13.905764746872627A45,45,0,0,0,-45,5.5109105961630896e-15Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--14',
              'isDark',
              cDartboard['64']
            ]"
            @click="clicked(64)"
          >
            <path
              d="M-128.39262969984574,-41.71729424061788A135,135,0,0,1,-109.2172942406179,-79.35100905948386L-36.405764746872634,-26.450336353161287A45,45,0,0,0,-42.797543233281914,-13.905764746872627Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--9',
              'isLight',
              cDartboard['68']
            ]"
            @click="clicked(68)"
          >
            <path
              d="M-109.2172942406179,-79.35100905948386A135,135,0,0,1,-79.35100905948389,-109.21729424061789L-26.450336353161298,-36.40576474687263A45,45,0,0,0,-36.405764746872634,-26.450336353161287Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--12',
              'isDark',
              cDartboard['72']
            ]"
            @click="clicked(72)"
          >
            <path
              d="M-79.35100905948389,-109.21729424061789A135,135,0,0,1,-41.71729424061792,-128.3926296998457L-13.90576474687264,-42.79754323328191A45,45,0,0,0,-26.450336353161298,-36.40576474687263Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-innerSingle--5',
              'isLight',
              cDartboard['76']
            ]"
            @click="clicked(76)"
          >
            <path
              d="M-41.71729424061792,-128.3926296998457A135,135,0,0,1,-2.4799097682733902e-14,-135L-8.266365894244634e-15,-45A45,45,0,0,0,-13.90576474687264,-42.79754323328191Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-triple">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--20',
              'isDark',
              cDartboard['1']
            ]"
            @click="clicked(1)"
          >
            <path
              d="M1.0103336092965664e-14,-165A165,165,0,0,1,50.98780407186633,-156.92432518870032L41.7172942406179,-128.3926296998457A135,135,0,0,0,8.266365894244634e-15,-135Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--1',
              'isLight',
              cDartboard['5']
            ]"
            @click="clicked(5)"
          >
            <path
              d="M50.98780407186633,-156.92432518870032A165,165,0,0,1,96.98456662825807,-133.48780407186632L79.35100905948387,-109.2172942406179A135,135,0,0,0,41.7172942406179,-128.3926296998457Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--18',
              'isDark',
              cDartboard['9']
            ]"
            @click="clicked(9)"
          >
            <path
              d="M96.98456662825807,-133.48780407186632A165,165,0,0,1,133.48780407186632,-96.98456662825807L109.2172942406179,-79.35100905948387A135,135,0,0,0,79.35100905948387,-109.2172942406179Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--4',
              'isLight',
              cDartboard['13']
            ]"
            @click="clicked(13)"
          >
            <path
              d="M133.48780407186632,-96.98456662825807A165,165,0,0,1,156.92432518870032,-50.98780407186632L128.3926296998457,-41.717294240617896A135,135,0,0,0,109.2172942406179,-79.35100905948387Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--13',
              'isDark',
              cDartboard['17']
            ]"
            @click="clicked(17)"
          >
            <path
              d="M156.92432518870032,-50.98780407186632A165,165,0,0,1,165,0L135,0A135,135,0,0,0,128.3926296998457,-41.717294240617896Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--6',
              'isLight',
              cDartboard['21']
            ]"
            @click="clicked(21)"
          >
            <path
              d="M165,0A165,165,0,0,1,156.92432518870032,50.98780407186632L128.3926296998457,41.717294240617896A135,135,0,0,0,135,0Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--10',
              'isDark',
              cDartboard['25']
            ]"
            @click="clicked(25)"
          >
            <path
              d="M156.92432518870032,50.98780407186632A165,165,0,0,1,133.48780407186632,96.98456662825807L109.2172942406179,79.35100905948387A135,135,0,0,0,128.3926296998457,41.717294240617896Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--15',
              'isLight',
              cDartboard['29']
            ]"
            @click="clicked(29)"
          >
            <path
              d="M133.48780407186632,96.98456662825807A165,165,0,0,1,96.98456662825807,133.48780407186632L79.35100905948387,109.2172942406179A135,135,0,0,0,109.2172942406179,79.35100905948387Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--2',
              'isDark',
              cDartboard['33']
            ]"
            @click="clicked(33)"
          >
            <path
              d="M96.98456662825807,133.48780407186632A165,165,0,0,1,50.98780407186633,156.92432518870032L41.7172942406179,128.3926296998457A135,135,0,0,0,79.35100905948387,109.2172942406179Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--17',
              'isLight',
              cDartboard['37']
            ]"
            @click="clicked(37)"
          >
            <path
              d="M50.98780407186633,156.92432518870032A165,165,0,0,1,1.0103336092965664e-14,165L8.266365894244634e-15,135A135,135,0,0,0,41.7172942406179,128.3926296998457Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--3',
              'isDark',
              cDartboard['41']
            ]"
            @click="clicked(41)"
          >
            <path
              d="M1.0103336092965664e-14,165A165,165,0,0,1,-50.987804071866314,156.92432518870035L-41.71729424061789,128.39262969984574A135,135,0,0,0,8.266365894244634e-15,135Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--19',
              'isLight',
              cDartboard['45']
            ]"
            @click="clicked(45)"
          >
            <path
              d="M-50.987804071866314,156.92432518870035A165,165,0,0,1,-96.98456662825805,133.48780407186632L-79.35100905948386,109.2172942406179A135,135,0,0,0,-41.71729424061789,128.39262969984574Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--7',
              'isDark',
              cDartboard['49']
            ]"
            @click="clicked(49)"
          >
            <path
              d="M-96.98456662825805,133.48780407186632A165,165,0,0,1,-133.48780407186632,96.98456662825808L-109.21729424061789,79.35100905948389A135,135,0,0,0,-79.35100905948386,109.2172942406179Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--16',
              'isLight',
              cDartboard['53']
            ]"
            @click="clicked(53)"
          >
            <path
              d="M-133.48780407186632,96.98456662825808A165,165,0,0,1,-156.92432518870032,50.987804071866336L-128.3926296998457,41.71729424061791A135,135,0,0,0,-109.21729424061789,79.35100905948389Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--8',
              'isDark',
              cDartboard['57']
            ]"
            @click="clicked(57)"
          >
            <path
              d="M-156.92432518870032,50.987804071866336A165,165,0,0,1,-165,2.0206672185931328e-14L-135,1.6532731788489267e-14A135,135,0,0,0,-128.3926296998457,41.71729424061791Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--11',
              'isLight',
              cDartboard['61']
            ]"
            @click="clicked(61)"
          >
            <path
              d="M-165,2.0206672185931328e-14A165,165,0,0,1,-156.92432518870035,-50.9878040718663L-128.39262969984574,-41.71729424061788A135,135,0,0,0,-135,1.6532731788489267e-14Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--14',
              'isDark',
              cDartboard['65']
            ]"
            @click="clicked(65)"
          >
            <path
              d="M-156.92432518870035,-50.9878040718663A165,165,0,0,1,-133.48780407186632,-96.98456662825805L-109.2172942406179,-79.35100905948386A135,135,0,0,0,-128.39262969984574,-41.71729424061788Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--9',
              'isLight',
              cDartboard['69']
            ]"
            @click="clicked(69)"
          >
            <path
              d="M-133.48780407186632,-96.98456662825805A165,165,0,0,1,-96.98456662825808,-133.48780407186632L-79.35100905948389,-109.21729424061789A135,135,0,0,0,-109.2172942406179,-79.35100905948386Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--12',
              'isDark',
              cDartboard['73']
            ]"
            @click="clicked(73)"
          >
            <path
              d="M-96.98456662825808,-133.48780407186632A165,165,0,0,1,-50.98780407186635,-156.92432518870032L-41.71729424061792,-128.3926296998457A135,135,0,0,0,-79.35100905948389,-109.21729424061789Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-triple--5',
              'isLight',
              cDartboard['77']
            ]"
            @click="clicked(77)"
          >
            <path
              d="M-50.98780407186635,-156.92432518870032A165,165,0,0,1,-3.031000827889699e-14,-165L-2.4799097682733902e-14,-135A135,135,0,0,0,-41.71729424061792,-128.3926296998457Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-outerSingle">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--20',
              'isDark',
              cDartboard['2']
            ]"
            @click="clicked(2)"
          >
            <path
              d="M1.469576158976824e-14,-240A240,240,0,0,1,74.16407864998739,-228.25356391083685L50.98780407186633,-156.92432518870032A165,165,0,0,0,1.0103336092965664e-14,-165Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--1',
              'isLight',
              cDartboard['6']
            ]"
            @click="clicked(6)"
          >
            <path
              d="M74.16407864998739,-228.25356391083685A240,240,0,0,1,141.06846055019355,-194.1640786499874L96.98456662825807,-133.48780407186632A165,165,0,0,0,50.98780407186633,-156.92432518870032Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--18',
              'isDark',
              cDartboard['10']
            ]"
            @click="clicked(10)"
          >
            <path
              d="M141.06846055019355,-194.1640786499874A240,240,0,0,1,194.1640786499874,-141.06846055019355L133.48780407186632,-96.98456662825807A165,165,0,0,0,96.98456662825807,-133.48780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--4',
              'isLight',
              cDartboard['14']
            ]"
            @click="clicked(14)"
          >
            <path
              d="M194.1640786499874,-141.06846055019355A240,240,0,0,1,228.25356391083685,-74.16407864998737L156.92432518870032,-50.98780407186632A165,165,0,0,0,133.48780407186632,-96.98456662825807Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--13',
              'isDark',
              cDartboard['18']
            ]"
            @click="clicked(18)"
          >
            <path
              d="M228.25356391083685,-74.16407864998737A240,240,0,0,1,240,0L165,0A165,165,0,0,0,156.92432518870032,-50.98780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--6',
              'isLight',
              cDartboard['22']
            ]"
            @click="clicked(22)"
          >
            <path
              d="M240,0A240,240,0,0,1,228.25356391083685,74.16407864998737L156.92432518870032,50.98780407186632A165,165,0,0,0,165,0Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--10',
              'isDark',
              cDartboard['26']
            ]"
            @click="clicked(26)"
          >
            <path
              d="M228.25356391083685,74.16407864998737A240,240,0,0,1,194.1640786499874,141.06846055019355L133.48780407186632,96.98456662825807A165,165,0,0,0,156.92432518870032,50.98780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--15',
              'isLight',
              cDartboard['30']
            ]"
            @click="clicked(30)"
          >
            <path
              d="M194.1640786499874,141.06846055019355A240,240,0,0,1,141.06846055019355,194.1640786499874L96.98456662825807,133.48780407186632A165,165,0,0,0,133.48780407186632,96.98456662825807Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--2',
              'isDark',
              cDartboard['34']
            ]"
            @click="clicked(34)"
          >
            <path
              d="M141.06846055019355,194.1640786499874A240,240,0,0,1,74.16407864998739,228.25356391083685L50.98780407186633,156.92432518870032A165,165,0,0,0,96.98456662825807,133.48780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--17',
              'isLight',
              cDartboard['38']
            ]"
            @click="clicked(38)"
          >
            <path
              d="M74.16407864998739,228.25356391083685A240,240,0,0,1,1.469576158976824e-14,240L1.0103336092965664e-14,165A165,165,0,0,0,50.98780407186633,156.92432518870032Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--3',
              'isDark',
              cDartboard['42']
            ]"
            @click="clicked(42)"
          >
            <path
              d="M1.469576158976824e-14,240A240,240,0,0,1,-74.16407864998736,228.25356391083687L-50.987804071866314,156.92432518870035A165,165,0,0,0,1.0103336092965664e-14,165Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--19',
              'isLight',
              cDartboard['46']
            ]"
            @click="clicked(46)"
          >
            <path
              d="M-74.16407864998736,228.25356391083687A240,240,0,0,1,-141.06846055019352,194.1640786499874L-96.98456662825805,133.48780407186632A165,165,0,0,0,-50.987804071866314,156.92432518870035Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--7',
              'isDark',
              cDartboard['50']
            ]"
            @click="clicked(50)"
          >
            <path
              d="M-141.06846055019352,194.1640786499874A240,240,0,0,1,-194.16407864998737,141.06846055019358L-133.48780407186632,96.98456662825808A165,165,0,0,0,-96.98456662825805,133.48780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--16',
              'isLight',
              cDartboard['54']
            ]"
            @click="clicked(54)"
          >
            <path
              d="M-194.16407864998737,141.06846055019358A240,240,0,0,1,-228.25356391083685,74.1640786499874L-156.92432518870032,50.987804071866336A165,165,0,0,0,-133.48780407186632,96.98456662825808Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--8',
              'isDark',
              cDartboard['58']
            ]"
            @click="clicked(58)"
          >
            <path
              d="M-228.25356391083685,74.1640786499874A240,240,0,0,1,-240,2.939152317953648e-14L-165,2.0206672185931328e-14A165,165,0,0,0,-156.92432518870032,50.987804071866336Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--11',
              'isLight',
              cDartboard['62']
            ]"
            @click="clicked(62)"
          >
            <path
              d="M-240,2.939152317953648e-14A240,240,0,0,1,-228.25356391083687,-74.16407864998735L-156.92432518870035,-50.9878040718663A165,165,0,0,0,-165,2.0206672185931328e-14Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--14',
              'isDark',
              cDartboard['66']
            ]"
            @click="clicked(66)"
          >
            <path
              d="M-228.25356391083687,-74.16407864998735A240,240,0,0,1,-194.1640786499874,-141.06846055019352L-133.48780407186632,-96.98456662825805A165,165,0,0,0,-156.92432518870035,-50.9878040718663Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--9',
              'isLight',
              cDartboard['70']
            ]"
            @click="clicked(70)"
          >
            <path
              d="M-194.1640786499874,-141.06846055019352A240,240,0,0,1,-141.06846055019358,-194.16407864998737L-96.98456662825808,-133.48780407186632A165,165,0,0,0,-133.48780407186632,-96.98456662825805Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--12',
              'isDark',
              cDartboard['74']
            ]"
            @click="clicked(74)"
          >
            <path
              d="M-141.06846055019358,-194.16407864998737A240,240,0,0,1,-74.16407864998742,-228.25356391083685L-50.98780407186635,-156.92432518870032A165,165,0,0,0,-96.98456662825808,-133.48780407186632Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-outerSingle--5',
              'isLight',
              cDartboard['78']
            ]"
            @click="clicked(78)"
          >
            <path
              d="M-74.16407864998742,-228.25356391083685A240,240,0,0,1,-4.408728476930471e-14,-240L-3.031000827889699e-14,-165A165,165,0,0,0,-50.98780407186635,-156.92432518870032Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-double">
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--20',
              'isDark',
              cDartboard['3']
            ]"
            @click="clicked(3)"
          >
            <path
              d="M1.6532731788489267e-14,-270A270,270,0,0,1,83.4345884812358,-256.7852593996914L74.16407864998739,-228.25356391083685A240,240,0,0,0,1.469576158976824e-14,-240Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--1',
              'isLight',
              cDartboard['7']
            ]"
            @click="clicked(7)"
          >
            <path
              d="M83.4345884812358,-256.7852593996914A270,270,0,0,1,158.70201811896774,-218.4345884812358L141.06846055019355,-194.1640786499874A240,240,0,0,0,74.16407864998739,-228.25356391083685Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--18',
              'isDark',
              cDartboard['11']
            ]"
            @click="clicked(11)"
          >
            <path
              d="M158.70201811896774,-218.4345884812358A270,270,0,0,1,218.4345884812358,-158.70201811896774L194.1640786499874,-141.06846055019355A240,240,0,0,0,141.06846055019355,-194.1640786499874Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--4',
              'isLight',
              cDartboard['15']
            ]"
            @click="clicked(15)"
          >
            <path
              d="M218.4345884812358,-158.70201811896774A270,270,0,0,1,256.7852593996914,-83.43458848123579L228.25356391083685,-74.16407864998737A240,240,0,0,0,194.1640786499874,-141.06846055019355Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--13',
              'isDark',
              cDartboard['19']
            ]"
            @click="clicked(19)"
          >
            <path
              d="M256.7852593996914,-83.43458848123579A270,270,0,0,1,270,0L240,0A240,240,0,0,0,228.25356391083685,-74.16407864998737Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--6',
              'isLight',
              cDartboard['23']
            ]"
            @click="clicked(23)"
          >
            <path
              d="M270,0A270,270,0,0,1,256.7852593996914,83.43458848123579L228.25356391083685,74.16407864998737A240,240,0,0,0,240,0Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--10',
              'isDark',
              cDartboard['27']
            ]"
            @click="clicked(27)"
          >
            <path
              d="M256.7852593996914,83.43458848123579A270,270,0,0,1,218.4345884812358,158.70201811896774L194.1640786499874,141.06846055019355A240,240,0,0,0,228.25356391083685,74.16407864998737Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--15',
              'isLight',
              cDartboard['31']
            ]"
            @click="clicked(31)"
          >
            <path
              d="M218.4345884812358,158.70201811896774A270,270,0,0,1,158.70201811896774,218.4345884812358L141.06846055019355,194.1640786499874A240,240,0,0,0,194.1640786499874,141.06846055019355Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--2',
              'isDark',
              cDartboard['35']
            ]"
            @click="clicked(35)"
          >
            <path
              d="M158.70201811896774,218.4345884812358A270,270,0,0,1,83.4345884812358,256.7852593996914L74.16407864998739,228.25356391083685A240,240,0,0,0,141.06846055019355,194.1640786499874Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--17',
              'isLight',
              cDartboard['39']
            ]"
            @click="clicked(39)"
          >
            <path
              d="M83.4345884812358,256.7852593996914A270,270,0,0,1,1.6532731788489267e-14,270L1.469576158976824e-14,240A240,240,0,0,0,74.16407864998739,228.25356391083685Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--3',
              'isDark',
              cDartboard['43']
            ]"
            @click="clicked(43)"
          >
            <path
              d="M1.6532731788489267e-14,270A270,270,0,0,1,-83.43458848123578,256.7852593996915L-74.16407864998736,228.25356391083687A240,240,0,0,0,1.469576158976824e-14,240Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--19',
              'isLight',
              cDartboard['47']
            ]"
            @click="clicked(47)"
          >
            <path
              d="M-83.43458848123578,256.7852593996915A270,270,0,0,1,-158.70201811896771,218.4345884812358L-141.06846055019352,194.1640786499874A240,240,0,0,0,-74.16407864998736,228.25356391083687Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--7',
              'isDark',
              cDartboard['51']
            ]"
            @click="clicked(51)"
          >
            <path
              d="M-158.70201811896771,218.4345884812358A270,270,0,0,1,-218.43458848123578,158.70201811896777L-194.16407864998737,141.06846055019358A240,240,0,0,0,-141.06846055019352,194.1640786499874Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--16',
              'isLight',
              cDartboard['55']
            ]"
            @click="clicked(55)"
          >
            <path
              d="M-218.43458848123578,158.70201811896777A270,270,0,0,1,-256.7852593996914,83.43458848123582L-228.25356391083685,74.1640786499874A240,240,0,0,0,-194.16407864998737,141.06846055019358Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--8',
              'isDark',
              cDartboard['59']
            ]"
            @click="clicked(59)"
          >
            <path
              d="M-256.7852593996914,83.43458848123582A270,270,0,0,1,-270,3.3065463576978534e-14L-240,2.939152317953648e-14A240,240,0,0,0,-228.25356391083685,74.1640786499874Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--11',
              'isLight',
              cDartboard['63']
            ]"
            @click="clicked(63)"
          >
            <path
              d="M-270,3.3065463576978534e-14A270,270,0,0,1,-256.7852593996915,-83.43458848123576L-228.25356391083687,-74.16407864998735A240,240,0,0,0,-240,2.939152317953648e-14Z"
            ></path>
          </g>
          ´
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--14',
              'isDark',
              cDartboard['67']
            ]"
            @click="clicked(67)"
          >
            <path
              d="M-256.7852593996915,-83.43458848123576A270,270,0,0,1,-218.4345884812358,-158.70201811896771L-194.1640786499874,-141.06846055019352A240,240,0,0,0,-228.25356391083687,-74.16407864998735Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--9',
              'isLight',
              cDartboard['71']
            ]"
            @click="clicked(71)"
          >
            <path
              d="M-218.4345884812358,-158.70201811896771A270,270,0,0,1,-158.70201811896777,-218.43458848123578L-141.06846055019358,-194.16407864998737A240,240,0,0,0,-194.1640786499874,-141.06846055019352Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--12',
              'isDark',
              cDartboard['75']
            ]"
            @click="clicked(75)"
          >
            <path
              d="M-158.70201811896777,-218.43458848123578A270,270,0,0,1,-83.43458848123583,-256.7852593996914L-74.16407864998742,-228.25356391083685A240,240,0,0,0,-141.06846055019358,-194.16407864998737Z"
            ></path>
          </g>
          <g
            :class="[
              'c-Dartboard-bed',
              'c-Dartboard-double--5',
              'isLight',
              cDartboard['79']
            ]"
            @click="clicked(79)"
          >
            <path
              d="M-83.43458848123583,-256.7852593996914A270,270,0,0,1,-4.9598195365467804e-14,-270L-4.408728476930471e-14,-240A240,240,0,0,0,-74.16407864998742,-228.25356391083685Z"
            ></path>
          </g>
        </g>
        <g class="c-Dartboard-borders">
          <g class="c-Dartboard-border c-Dartboard-border--20">
            <path
              d="M1.8369701987210297e-14,-300A300,300,0,0,1,92.70509831248424,-285.31695488854604L83.4345884812358,-256.7852593996914A270,270,0,0,0,1.6532731788489267e-14,-270Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="44.58382253646581"
              y="-281.49117706961425"
              dy=".35em"
              transform="rotate(9, 44.58382253646581, -281.49117706961425)"
              text-anchor="middle"
            >
              20
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--1">
            <path
              d="M92.70509831248424,-285.31695488854604A300,300,0,0,1,176.33557568774194,-242.70509831248424L158.70201811896774,-218.4345884812358A270,270,0,0,0,83.4345884812358,-256.7852593996914Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="129.38729242577085"
              y="-253.9368593936848"
              dy=".35em"
              transform="rotate(27, 129.38729242577085, -253.9368593936848)"
              text-anchor="middle"
            >
              1
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--18">
            <path
              d="M176.33557568774194,-242.70509831248424A300,300,0,0,1,242.70509831248424,-176.33557568774194L218.4345884812358,-158.70201811896774A270,270,0,0,0,158.70201811896774,-218.4345884812358Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="201.52543263816605"
              y="-201.52543263816605"
              dy=".35em"
              transform="rotate(45, 201.52543263816605, -201.52543263816605)"
              text-anchor="middle"
            >
              18
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--4">
            <path
              d="M242.70509831248424,-176.33557568774194A300,300,0,0,1,285.31695488854604,-92.70509831248422L256.7852593996914,-83.43458848123579A270,270,0,0,0,218.4345884812358,-158.70201811896774Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="253.93685939368484"
              y="-129.38729242577082"
              dy=".35em"
              transform="rotate(63, 253.93685939368484, -129.38729242577082)"
              text-anchor="middle"
            >
              4
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--13">
            <path
              d="M285.31695488854604,-92.70509831248422A300,300,0,0,1,300,0L270,0A270,270,0,0,0,256.7852593996914,-83.43458848123579Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="281.49117706961425"
              y="-44.583822536465796"
              dy=".35em"
              transform="rotate(81, 281.49117706961425, -44.583822536465796)"
              text-anchor="middle"
            >
              13
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--6">
            <path
              d="M300,0A300,300,0,0,1,285.31695488854604,92.70509831248422L256.7852593996914,83.43458848123579A270,270,0,0,0,270,0Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="281.49117706961425"
              y="44.583822536465796"
              dy=".35em"
              transform="rotate(99, 281.49117706961425, 44.583822536465796)"
              text-anchor="middle"
            >
              6
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--10">
            <path
              d="M285.31695488854604,92.70509831248422A300,300,0,0,1,242.70509831248424,176.33557568774194L218.4345884812358,158.70201811896774A270,270,0,0,0,256.7852593996914,83.43458848123579Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="253.93685939368484"
              y="129.38729242577082"
              dy=".35em"
              transform="rotate(117, 253.93685939368484, 129.38729242577082)"
              text-anchor="middle"
            >
              10
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--15">
            <path
              d="M242.70509831248424,176.33557568774194A300,300,0,0,1,176.33557568774194,242.70509831248424L158.70201811896774,218.4345884812358A270,270,0,0,0,218.4345884812358,158.70201811896774Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="201.52543263816605"
              y="201.52543263816605"
              dy=".35em"
              transform="rotate(135, 201.52543263816605, 201.52543263816605)"
              text-anchor="middle"
            >
              15
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--2">
            <path
              d="M176.33557568774194,242.70509831248424A300,300,0,0,1,92.70509831248424,285.31695488854604L83.4345884812358,256.7852593996914A270,270,0,0,0,158.70201811896774,218.4345884812358Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="129.38729242577085"
              y="253.9368593936848"
              dy=".35em"
              transform="rotate(153, 129.38729242577085, 253.9368593936848)"
              text-anchor="middle"
            >
              2
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--17">
            <path
              d="M92.70509831248424,285.31695488854604A300,300,0,0,1,1.8369701987210297e-14,300L1.6532731788489267e-14,270A270,270,0,0,0,83.4345884812358,256.7852593996914Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="44.58382253646581"
              y="281.49117706961425"
              dy=".35em"
              transform="rotate(171, 44.58382253646581, 281.49117706961425)"
              text-anchor="middle"
            >
              17
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--3">
            <path
              d="M1.8369701987210297e-14,300A300,300,0,0,1,-92.7050983124842,285.3169548885461L-83.43458848123578,256.7852593996915A270,270,0,0,0,1.6532731788489267e-14,270Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-44.58382253646578"
              y="281.49117706961425"
              dy=".35em"
              transform="rotate(189, -44.58382253646578, 281.49117706961425)"
              text-anchor="middle"
            >
              3
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--19">
            <path
              d="M-92.7050983124842,285.3169548885461A300,300,0,0,1,-176.3355756877419,242.70509831248424L-158.70201811896771,218.4345884812358A270,270,0,0,0,-83.43458848123578,256.7852593996915Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-129.38729242577082"
              y="253.93685939368484"
              dy=".35em"
              transform="rotate(207, -129.38729242577082, 253.93685939368484)"
              text-anchor="middle"
            >
              19
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--7">
            <path
              d="M-176.3355756877419,242.70509831248424A300,300,0,0,1,-242.7050983124842,176.33557568774197L-218.43458848123578,158.70201811896777A270,270,0,0,0,-158.70201811896771,218.4345884812358Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-201.52543263816602"
              y="201.52543263816605"
              dy=".35em"
              transform="rotate(225, -201.52543263816602, 201.52543263816605)"
              text-anchor="middle"
            >
              7
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--16">
            <path
              d="M-242.7050983124842,176.33557568774197A300,300,0,0,1,-285.31695488854604,92.70509831248425L-256.7852593996914,83.43458848123582A270,270,0,0,0,-218.43458848123578,158.70201811896777Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-253.9368593936848"
              y="129.38729242577085"
              dy=".35em"
              transform="rotate(243, -253.9368593936848, 129.38729242577085)"
              text-anchor="middle"
            >
              16
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--8">
            <path
              d="M-285.31695488854604,92.70509831248425A300,300,0,0,1,-300,3.6739403974420595e-14L-270,3.3065463576978534e-14A270,270,0,0,0,-256.7852593996914,83.43458848123582Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-281.49117706961425"
              y="44.58382253646583"
              dy=".35em"
              transform="rotate(261, -281.49117706961425, 44.58382253646583)"
              text-anchor="middle"
            >
              8
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--11">
            <path
              d="M-300,3.6739403974420595e-14A300,300,0,0,1,-285.3169548885461,-92.70509831248418L-256.7852593996915,-83.43458848123576A270,270,0,0,0,-270,3.3065463576978534e-14Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-281.49117706961425"
              y="-44.58382253646576"
              dy=".35em"
              transform="rotate(279, -281.49117706961425, -44.58382253646576)"
              text-anchor="middle"
            >
              11
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--14">
            <path
              d="M-285.3169548885461,-92.70509831248418A300,300,0,0,1,-242.70509831248424,-176.3355756877419L-218.4345884812358,-158.70201811896771A270,270,0,0,0,-256.7852593996915,-83.43458848123576Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-253.93685939368484"
              y="-129.3872924257708"
              dy=".35em"
              transform="rotate(297, -253.93685939368484, -129.3872924257708)"
              text-anchor="middle"
            >
              14
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--9">
            <path
              d="M-242.70509831248424,-176.3355756877419A300,300,0,0,1,-176.33557568774197,-242.7050983124842L-158.70201811896777,-218.43458848123578A270,270,0,0,0,-218.4345884812358,-158.70201811896771Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-201.52543263816608"
              y="-201.52543263816602"
              dy=".35em"
              transform="rotate(315, -201.52543263816608, -201.52543263816602)"
              text-anchor="middle"
            >
              9
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--12">
            <path
              d="M-176.33557568774197,-242.7050983124842A300,300,0,0,1,-92.70509831248427,-285.31695488854604L-83.43458848123583,-256.7852593996914A270,270,0,0,0,-158.70201811896777,-218.43458848123578Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-129.38729242577088"
              y="-253.9368593936848"
              dy=".35em"
              transform="rotate(333, -129.38729242577088, -253.9368593936848)"
              text-anchor="middle"
            >
              12
            </text>
          </g>
          <g class="c-Dartboard-border c-Dartboard-border--5">
            <path
              d="M-92.70509831248427,-285.31695488854604A300,300,0,0,1,-5.510910596163089e-14,-300L-4.9598195365467804e-14,-270A270,270,0,0,0,-83.43458848123583,-256.7852593996914Z"
            ></path>
            <text
              class="c-Dartboard-borderLabel"
              x="-44.583822536465846"
              y="-281.49117706961425"
              dy=".35em"
              transform="rotate(351, -44.583822536465846, -281.49117706961425)"
              text-anchor="middle"
            >
              5
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>
