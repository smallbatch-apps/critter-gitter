<script>
  import Locations from "./Locations.svelte";
  import Critters from "./Critters.svelte";
  import Home from "./Home.svelte";
  import { locationStore } from "./stores";
</script>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  header {
    text-align: center;
    position: absolute;
    width: 100%;
    margin-top: 1rem;
    z-index: 100;
  }

  header h1 {
    text-shadow: 1px 1px 3px #000000;
  }
</style>

<main>
  <header>
    <h1 class="first">Critter</h1>
    <h1 class="second">Gitter</h1>
  </header>

  <Home />
  <Locations />
  <Critters />
  <!-- <footer>
    <div class="time">0:00</div>
  </footer> -->
</main>
