<template>
  <div
    :class="{
      board: true,
      active: isActive,
      visible: isVisible,
      small: size == 'small'
    }"
    :style="{
      gridTemplateColumns: 'repeat(' + cols + ', auto)',
      //      ', minmax(' +
      //      (size == 'thumb' ? '16px' : '24px') +
      //      ',60px))',
      '--player-color': this.$PlayerColor[this.playerColor],
      '--border-color': this.$PlayerColor[this.playerColor] + '50',
      '--enemy-color': this.$PlayerColor[this.enemyColor]
    }"
  >
    <div class="legend"><label>&nbsp;</label></div>
    <div class="legend" v-for="i in cols" :key="'above' + i">
      <label>{{ i }}</label>
    </div>
    <div class="legend"><label>&nbsp;</label></div>
    <template v-for="y in rows" :key="y">
      <div class="legend">
        <label>
          {{ String.fromCharCode(64 + y) }}
        </label>
      </div>
      <div
        v-for="x in cols"
        :key="x - 1 + cols * (y - 1)"
        @click="$emit('select', x - 1 + cols * (y - 1))"
        :class="[
          'cell',
          x == cols ? 'borderRight' : '',
          y == rows ? 'borderBottom' : '',
          cBoard[x - 1 + cols * (y - 1)]
        ]"
      >
        <span>
          {{ String.fromCharCode(64 + y) + '' + x }}
        </span>
      </div>
      <div class="legend">
        <label>{{ String.fromCharCode(64 + y) }}</label>
      </div>
    </template>
    <div class="legend"><label>&nbsp;</label></div>
    <div class="legend" v-for="i in cols" :key="'above' + i">
      <label>{{ i }}</label>
    </div>
    <div class="legend"><label>&nbsp;</label></div>
  </div>
</template>

<script>
export default {
  name: 'ClassicBoard',

  data: function () {
    return {
      cBoard: {}
    }
  },
  mounted() {
    this.drawBoard()
  },
  watch: {
    board: {
      handler(newValue, oldValue) {
        this.drawBoard()
      },
      deep: true
    }
  },

  methods: {
    cellName(index) {
      let col = index % this.cols,
        row = parseInt(index / this.cols) + 1

      return String.fromCharCode(65 + col) + '' + row
    },

    drawBoard() {
      this.board.forEach((state, index) => {
        this.cBoard[index] = {
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
    }
  },
  props: [
    'board',
    'playerColor',
    'enemyColor',
    'isVisible',
    'isActive',
    'size',
    'rows',
    'cols',
    'mode'
  ],
  emits: ['select']
}
</script>

<style lang="scss" scoped>
/*
https://css-stripe-generator.firebaseapp.com/
https://rgbacolorpicker.com/rgba-to-hex
*/

.board {
  display: none;
  width: 100%;
  pointer-events: none;
  border: 3px solid var(--border-color);
  opacity: 0.6;
  font-size: 10px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: fit-content;
  min-width: 100%;
}

.board.small {
  font-size: 0px;
  border: 2px solid var(--border-color);
}

.board.visible {
  display: grid;
}

.board.active {
  pointer-events: all;
  opacity: 1;
}

.board.visible > div {
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0;
  margin: 0;
  aspect-ratio: 1;
  //max-width: 60px;
}

.board.active > div {
  min-width: 24px;
}
.borderBottom {
  border-bottom: 1px solid var(--border-color) !important;
}
.borderRight {
  border-right: 1px solid var(--border-color) !important;
}

.cell {
  background-color: white;
  //outline: 1px solid var(--border-color); /* The outline creates the border */
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  color: var(--player-color);
  cursor: pointer;
}
.legend {
  display: none !important;
  //background-color: white;
  border: 1px solid transparent;
}

.legend span {
  font-size: 10px;
  font-weight: bold;
  line-height: 10px;
}

.small .legend span {
  display: none;
}

.board > div.choice {
  background-color: white;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 3px,
    var(--player-color) 3px,
    var(--player-color) 4px
  );
  background-size: auto auto;
}

.board > div.damaged {
  font-size: 0px;
  pointer-events: none;
  background-size: auto auto;
  background-color: rgba(255, 255, 255, 1);
  background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      var(--enemy-color) 3px,
      var(--enemy-color) 4px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      var(--enemy-color) 3px,
      var(--enemy-color) 4px
    );
}

.board > div.empty {
  font-size: 0px;
  //background: rgb(240, 240, 240);
  background: var(--border-color);
  color: var(--border-color);
  pointer-events: none;
}

.board > div.margin {
  //font-size: 0px;
  //background: rgb(240, 240, 240);
  //background: var(--border-color);
  color: white;
  pointer-events: none;
}

.board > div.visible {
  background-color: white;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 3px,
    var(--enemy-color) 3px,
    var(--enemy-color) 4px
  );
  background-size: auto auto;
  pointer-events: none;
}

.board > div.placed {
  background: var(--player-color);
  color: white;
}
.board > div.selected {
  background: var(--player-color);
  color: white;
  pointer-events: none;
}

.board > div.destroyed {
  font-size: 0px;
  background: var(--enemy-color);
  pointer-events: none;
}

.board > div.disabled {
  font-size: 0px;
  background: rgb(200, 200, 200);
  pointer-events: none;
}
</style>
