<script>
  import { locationStore, page, activeLocation } from "./stores";
  import { fly, slide } from "svelte/transition";
  let locations;
  let home = false;

  locationStore.subscribe(locs => (locations = locs));

  let title = "";
  let timeZone = "";

  let hemisphere = "south";
  let displayTime = "";
  let gmtOffset = "";
  let addLocationForm = false;

  function selectLocation(location) {
    activeLocation.set(location);
    localStorage.setItem("activeLocation", JSON.stringify(location));
  }

  function updateStore(newLocations) {
    locationStore.update(locations => newLocations);
    localStorage.setItem("locations", JSON.stringify(newLocations));
  }

  function autoFill(e) {
    e.preventDefault();
    let n = new Date().getTimezoneOffset();
    console.log("running autofill function");
    console.log(navigator.geolocation);
    timeZone = (n / 60) * -1;

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("get position success");
        hemisphere = position.coords.latitude > 0 ? "north" : "south";
        console.log(hemisphere);
        const newLocation = {
          title: "Home",
          hemisphere,
          timeZone,
          id: Date.now()
        };
        const newState = [...locations, newLocation];

        updateStore(newState);
        selectLocation(newLocation);
        hemisphere = "north";
        timeZone = "";
      },
      error => {
        console.log("position error");
        console.log(error);
      }
    );
  }

  function addLocation() {
    const newLocation = { title, hemisphere, timeZone, id: Date.now() };
    updateStore([...locations, newLocation]);
    selectLocation(newLocation);
    hemisphere = "north";
    timeZone = "";
    addLocationForm = false;
  }
</script>

<style>
  .locations {
    background-color: #f8f0a4;
    flex: 0 1 auto;
    position: relative;
    padding: 1.5rem;
  }
  p {
    margin-top: 0;
  }

  h2 {
    color: #d69e2e;
    margin-bottom: 0.3rem;
  }

  .tree {
    position: absolute;
    z-index: 3;
    right: -10%;
    bottom: 10%;
    font-size: 800%;
    --fa-secondary-opacity: 1;
    --fa-primary-color: #68d391;
    --fa-secondary-color: #f6e05e;
    animation: tree 5s;
    transition: all 1s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    transform-origin: bottom center;
  }

  .grow .tree {
    bottom: 20%;
    right: -20%;
    font-size: 1500%;
  }

  .details {
    background-color: #48bb78;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    color: white;
  }

  .close {
    background-color: #fc8181;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    color: white;
  }

  .add-location {
    margin-top: 0.5rem;
  }

  .add-location.add-location-open {
    width: 75%;
  }

  .add-location-form {
    width: 75%;
  }

  .flex {
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  .box {
    flex: 1 1 0;
    z-index: 10;
    margin-left: 0;
  }

  label {
    display: inline-block;
    margin-top: 0.3rem;
  }

  .locations-list {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 1rem;
  }

  .location-hemisphere {
    font-size: 60%;
    background-color: #f8f0a4;
    padding: 0.3rem 0.4rem;
    border-radius: 0.4rem;
    float: right;
  }

  .locations-list li {
    background-color: #fefcbf;
    padding: 0.3rem 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .locations-list li.active {
    background-color: #faf089;
  }

  .location-input {
    border-width: 0;
    padding: 0.3rem;
    width: 100%;
  }

  .text-center {
    text-align: center;
  }
</style>

<div class="locations panel {$page === 'locations' ? 'grow' : 'shrink'}">

  <i class="fad fa-tree-palm tree" />

  {#if $page === 'locations'}
    <div transition:slide>
      <h2>Location List</h2>

      <div class="flex">
        <div class="box">
          {#if locations.length === 0}
            <p>Set your home first!</p>

            <div on:click={autoFill} class="details">
              <i class="fad fa-globe" />
              Get my details
            </div>
          {:else if addLocationForm}
            <div class="add-location-form" transition:slide>
              <label>Location Title</label>
              <input
                class="location-input"
                bind:value={title}
                placeholder="eg. Sam's Island" />
              <label>GMT Offset</label>
              <input
                class="location-input"
                bind:value={timeZone}
                placeholder="eg. -5 for New York" />
              <label>Hemisphere</label>
              <select bind:value={hemisphere} class="location-input">
                <option value="north">Northern</option>
                <option value="south">Southern</option>
              </select>
              <div class="flex">
                <div
                  on:click={() => (addLocationForm = false)}
                  class="add-location close">
                  <i class="fad fa-times" />
                </div>
                <div on:click={addLocation} class="add-location details">
                  <i class="fad fa-plus-square" />
                  Add Location
                </div>
              </div>
            </div>
          {:else}
            <div
              class="add-location details add-location-open"
              on:click={() => (addLocationForm = true)}>
              Add A Location
            </div>
          {/if}

          {#if locations.length > 0}
            <ul class="locations-list">
              {#each locations as location (location.title)}
                <li
                  class={$activeLocation.id === location.id ? 'active' : ''}
                  on:click={() => selectLocation(location)}>
                  <span class="location-hemisphere">
                    {location.hemisphere === 'north' ? 'N' : 'S'}
                  </span>
                  {location.title}
                </li>
              {:else}
                <li>No locations available</li>
              {/each}
            </ul>
            {#if locations.length > 1}
              <div class="text-center">Click on a location to select it</div>
            {/if}
          {/if}
        </div>
      </div>

    </div>
  {/if}

</div>
