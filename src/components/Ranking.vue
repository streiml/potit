<template>
  <table class="table table-sm">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col"><font-awesome-icon icon="fa-solid fa-burst" /></th>
        <th scope="col">1</th>
        <th scope="col">2</th>
        <th scope="col">3</th>
        <th scope="col">4</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="player in getRanking()" :key="player.getId()">
        <th scope="row">
          <div
            class="avatar"
            :style="{ background: $PlayerColor[player.color] }"
          >
            {{ this.ranking[player.getId()] }}
          </div>
        </th>
        <td>{{ player.getDamaged() }}</td>
        <td>{{ player.getActiveUnits(true)[1] }}</td>
        <td>{{ player.getActiveUnits(true)[2] }}</td>
        <td>{{ player.getActiveUnits(true)[3] }}</td>
        <td>{{ player.getActiveUnits(true)[4] }}</td>
      </tr>
    </tbody>
  </table>
  <div v-for="player in getRanking()" :key="player.getId()">
    <classic-board
      v-if="settings.game == 'classic'"
      :board="player.board"
      :playerColor="player.color"
      :enemyColor="players[player.enemyId].color"
      :isVisible="true"
      :isActive="false"
      :cols="settings.cols"
      :rows="settings.rows"
      size="small"
      :mode="mode"
    ></classic-board>
    <dart-board
      v-else
      :board="player.board"
      :playerColor="player.color"
      :enemyColor="players[player.enemyId].color"
      :isVisible="true"
      :isActive="false"
      :mode="mode"
    ></dart-board>
  </div>
</template>
<script>
import ClassicBoard from '@/components/ClassicBoard.vue'
import DartBoard from '@/components/DartBoard.vue'

export default {
  name: 'RankingCompontent',
  data: function () {
    return {
      ranking: {},
      settings: this.$store.state.settings
    }
  },
  methods: {
    getRanking() {
      let counter = 1,
        order = Object.values(this.players).sort(
          (a, b) =>  {
            var pointsA = parseInt(a.getPoints())
	          var pointsB = parseInt(b.getPoints())
	          var r = ((pointsA < pointsB) ? 1 : ((pointsA > pointsB) ? -1 : 0));
	          if(r === 0){
		        // Next line makes the magic :)
		          r = (a.id !== null && b.id !== null)?
			        a.id - b.id : 0
	          }
            return r
          })
      console.log("getRanking")
      console.log(order)
      console.log(this.ranking)
      if (order.length > 0) this.ranking[order[0].getId()] = counter
      for (var i = 1; i < order.length; i++) {
        this.ranking[order[i].getId()] =
          order[i - 1].getPoints() > order[i].getPoints() ? ++counter : ''
      }

      return order
    }
  },
  props: ['players', 'mode'],
  components: {
    ClassicBoard,
    DartBoard
  }
}
</script>
<style lang="scss" scoped>
th {
  text-align: center;
}

td {
  text-align: center;
}
.avatar {
  width: 30px;
  aspect-ratio: 1;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  display: inline-block;
}

.ranking .board {
  margin-bottom: 10px;
}
.cell {
  font-size: 0px !important;
}
</style>
