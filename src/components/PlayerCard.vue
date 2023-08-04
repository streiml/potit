<template>
    <h2>Join Game</h2>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Code eingeben</h5>
            <input type="text" />
            <p class="card-text">An einem besteheden Spiel teilnehmen.</p>
            <button type="button" class="btn btn-primary">Join Game</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'JoinGame',
    props: {
      msg: String
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  //.card {
  //  max-width: 200px;
  //}
  </style>
  