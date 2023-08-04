<template>
  <nav id="nav" class="navbar navbar-light bg-light">
    <router-link
      v-if="back"
      :to="back"
      class="btn btn-outline-success"
      type="button"
    >
      <i class="bi bi-arrow-left-square-fill me-2"></i>Back
    </router-link>
    <units2 v-if="units" :units="units"></units2>
    <router-link
      v-if="next"
      :to="next"
      class="btn btn-outline-success"
      type="button"
    >
      <i class="bi bi-arrow-right-square-fill me-2"></i>Next
    </router-link>
    <button
      v-if="showPotit"
      class="btn btn-outline-success"
      @click="this.$store.dispatch('potit')"
    >
      <i class="bi bi-arrow-right-square-fill me-2"></i>
      Potit
    </button>
    <button
      v-if="addPlayer"
      class="btn btn-outline-success"
      @click="this.$emit('add', 'player')"
    >
      <i class="bi bi-arrow-right-square-fill me-2"></i>
      Add
    </button>
  </nav>
</template>
<script>
import Units2 from '@/components/Units2.vue'
export default {
  name: 'Navbar',
  data: function () {
    return {}
  },
  props: {
    back: String,
    addPlayer: Boolean,
    next: String,
    showPotit: Boolean,
    units: Object
  },
  emits: ['add'],
  components: {
    Units2
  }
}
</script>
