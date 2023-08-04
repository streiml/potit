<template>
  <div>
    <div
      v-for="u in 4"
      :key="u"
      :style="{
        display: 'inline',
        lineHeight: size
      }"
    >
      <span class="me-2 ms-3">{{ player.getActiveUnits()[u] }}x</span>
      <div
        :style="{
          display: 'inline-grid',
          gridTemplateRows: size,
          gridTemplateColumns: 'repeat(' + u + ', ' + size + ')'
        }"
      >
        <div
          v-for="i in Number(u)"
          :key="i"
          :style="{
            outline: '1px solid ' + borderColor[u],
            backgroundColor: backgroundColor[u]
          }"
        >
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Units',
  data: function () {
    return {
      size: '20px',
      backgroundColor: {
        1: '#DDA0DD',
        2: '#66CDAA',
        3: '#87CEEB',
        4: '#FFB6C1'
      },
      borderColor: { 1: '#8B008B', 2: '#3CB371', 3: '#6A5ACD', 4: '#FF8C00' }
    }
  },
  computed: {
    ...mapGetters(['getActiveUnits'])
  },
  props: ['player']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
