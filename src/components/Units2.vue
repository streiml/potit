<template>
  <div
    class="units"
    :style="{
      display: 'flex',
      lineHeight: 2 * size + 'px'
    }"
  >
    <template v-for="u in 4" :key="u">
      <div
        v-if="units[u] > 0"
        class="unit"
        :style="{
          width: size * u + 'px',
          'box-shadow': active ? '0 0 3px 3px ' + $PlayerColor[color] : 'none'
        }"
      >
        <div class="counter">
          {{ units[u] }}
        </div>
        <div
          :style="{
            display: 'inline-grid',
            gridTemplateRows: size,
            gridTemplateColumns: 'repeat(' + u + ', ' + size + 'px)'
          }"
        >
          <div
            v-for="i in Number(u)"
            :key="i"
            :style="{
              outline: '1px solid ' + borderColor, //borderColor[u],
              backgroundColor: $PlayerColor[color] //backgroundColor[u]
            }"
          >
            &nbsp;
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'Units2',
  data: function () {
    return {
      size: 10,
      bgColor: '#DDA0DD',
      borderColor: 'white',
      backgroundColor: {
        1: '#DDA0DD',
        2: '#66CDAA',
        3: '#87CEEB',
        4: '#FFB6C1'
      }
      //borderColor: { 1: '#8B008B', 2: '#3CB371', 3: '#6A5ACD', 4: '#FF8C00' }
    }
  },
  props: ['units', 'active', 'color']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.units {
  background: transparent;
}

.unit {
  position: relative;
  margin: 5px;
}

.counter {
  position: absolute;
  left: 50%;
  font-size: 18px;
  margin-left: -6px;
  margin-top: -1px;
  font-weight: bold;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
}
</style>
