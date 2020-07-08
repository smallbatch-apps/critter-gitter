<script>
  import { page } from "./stores";
</script>

<style>
  .home {
    text-align: center;
    background-color: #bee3f8;
    padding-top: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .home-button {
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    width: 7rem;
    margin-right: auto;
    margin-left: auto;
    background-color: #ecc94b;
    font-family: "Wellfleet", cursive;
    z-index: 4;
    font-size: 140%;
    color: white;
    transition: all 0.5s;
  }

  .home-button.button-on {
    background-color: #d69e2e;
  }

  .button-col-row {
    display: flex;
  }

  .button-col-row.button-col .home-button {
    width: 9rem;
  }

  .button-col-row.button-row .home-button {
    font-size: 110%;
  }

  .button-row {
    flex-direction: row;
  }

  .button-col {
    flex-direction: column;
  }

  .button-row .home-button {
    margin-right: 0.3rem;
    margin-left: 0.3rem;
  }
  .fa-cloud {
    color: white;

    position: absolute;
    transition: font-size 0.5s;
  }

  .cloud1 {
    font-size: 600%;
    top: 40%;
    animation: cloud1 200s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 3;
    opacity: 0.9;
    left: -10%;
  }

  .shrink .cloud1 {
    font-size: 400%;
  }

  .cloud2 {
    font-size: 400%;
    top: 60%;
    animation: cloud2 310s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 2;
    opacity: 0.6;
    right: 110%;
  }

  .shrink .cloud2 {
    font-size: 200%;
  }
</style>

<div class="home panel {$page == 'home' ? 'grow' : 'shrink'}">

  <i class="fad fa-cloud cloud1" />
  <i class="fad fa-cloud cloud2" />

  <div class="button-col-row {$page == 'home' ? 'button-col' : 'button-row'}">

    <div
      class="home-button {$page === 'home' ? 'button-on' : ''}"
      on:click={() => ($page = 'home')}>
      Home
    </div>
    <div
      class="home-button {$page === 'locations' ? 'button-on' : ''}"
      on:click={() => ($page = 'locations')}>
      Locations
    </div>
    <div
      class="home-button {$page === 'critters' ? 'button-on' : ''}"
      on:click={() => ($page = 'critters')}>
      Critters
    </div>

  </div>
</div>
