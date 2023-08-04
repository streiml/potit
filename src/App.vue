<script>
export default {
  // Dartboard: https://codepen.io/codeXD/pen/yLLodya
  data: function () {
    return {
      player: [
        {
          name: '',
          color: null,
          admin: true
        }
      ],
      game: 'classic',
      code: ''
    }
  },
  mounted() {
    window.addEventListener('orientationchange', this.handleOrientationChange)
  },
  methods: {
    handleOrientationChange() {
      this.$store.state.screen.portrait =
        window.screen.orientation.type === 'portrait-primary'

      this.$store.state.screen.width = window.innerWidth
      this.$store.state.screen.height = window.innerHeight
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <router-view />
  </div>
</template>

<style scoped>

</style>
