<template>
  <h3 class="mt-2">Join Game</h3>
  <div
    class="h-100 border rounded text-center"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    "
  >
    <div class="w-100 mt-3 code">
      <div>{{ get(0) }}</div>
      <div>{{ get(1) }}</div>
      <div>{{ get(2) }}</div>
      <div>{{ get(3) }}</div>
    </div>
    <div class="my-3 keyboard">
      <button
        v-for="i in 10"
        :key="i"
        @click="add(i - 1)"
        class="btn btn-outline-primary rounded"
      >
        {{ i - 1 }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'JoinGame',
  data: function () {
    return {
      code: ''
    }
  },
  methods: {
    get(pos) {
      return this.code.length > pos ? this.code.substring(pos, pos + 1) : '-'
    },
    add(number) {
      this.code += number
      if (this.code.length == 4) {
        setTimeout(() => {
          this.code = ''
        }, 1000)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.code > div {
  display: inline-block;
  border: 2px solid darkgray;
  width: 40px;
  border-radius: 5px;
  text-align: center;
  line-height: 60px;
  margin: 5px;
  font-size: 26px;
  font-weight: bold;
}

.keyboard {
  margin-top: 20px;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(5, 50px);
  justify-content: center;
}

.keyboard > button {
  //outline: 1px solid gray;
  width: 50px;
  height: 50px;
  //text-align: center;
  //cursor: pointer;
}

@media (orientation: portrait) {
  h3 {
    margin-top: 26px !important;
  }
}
</style>
