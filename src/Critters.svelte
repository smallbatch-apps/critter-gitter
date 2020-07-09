<script>
  import { slide, fade } from "svelte/transition";

  import { locationStore, page, activeLocation } from "./stores";

  import critters from "./data.js";
  import { addHours, isWithinInterval, set, lightFormat } from "date-fns";
  // const months = ['January', 'February', "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  let bug = false;
  let fish = false;
  let sea = false;

  $: crittersAllowed = { bug, fish, sea };

  let isRaining = false;
  let hideTrash = false;
  let showFinding = true;
  let locations = [];

  let localOffset = (new Date().getTimezoneOffset() / 60) * -1;
  let finalOffset;
  let finalLocationDate;

  let chooseSort = false;
  let sortBy = "cpId";

  $: noLocations = locations.length === 0;

  $: finalOffset = $activeLocation.timeZone - localOffset;
  $: finalLocationDate = addHours(new Date(), finalOffset);

  $: filteredCritters = critters
    .filter(c => crittersAllowed[c.category])
    .filter(({ months }) => {
      if (!months) return true;

      return months[$activeLocation.hemisphere].includes(
        finalLocationDate.getMonth()
      );
    })
    .filter(({ times }) => {
      if (!times) return true;

      return times.some(t => {
        const start = set(finalLocationDate, {
          hours: t.from,
          minutes: 0,
          seconds: 0
        });

        const end = set(finalLocationDate, {
          hours: t.to,
          minutes: 0,
          seconds: 0
        });
        return isWithinInterval(finalLocationDate, { start, end });
      });
    })
    .filter(({ rainOnly, rainHide }) => {
      if (isRaining && rainHide) return false;

      if (!isRaining && rainOnly) return false;

      return true;
    })
    .filter(({ rarity }) => {
      if (!hideTrash) return true;
      return rarity > 2;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "bells") {
        return b.price - a.price;
      }
      return a.cpId.localeCompare(b.cpId);
    });
</script>

<style>
  .button-row {
    display: flex;
    justify-content: space-evenly;
  }

  .critters {
    background-color: #c6f6d5;
    flex: 1 0 auto;
  }

  .critter-box {
    margin-top: 0.5rem;
  }

  .rainbox {
    background-color: #90cdf4;

    padding: 0.5rem;
    flex-grow: 1;
    text-align: center;
    color: white;
    border-radius: 0.3rem;
    margin: 0.3rem;
  }

  .rainbox-on {
    background-color: #63b3ed;
  }

  .critter-item {
    padding: 0.5rem;
    background-color: #f0fff4;
    border-radius: 0.3rem;
    margin-bottom: 0.5rem;
  }

  .critterTypeButton {
    background-color: #68d391;
    padding: 0.5rem;
    flex-grow: 1;
    text-align: center;
    color: white;
    border-radius: 0.3rem;
    margin: 0.3rem;
  }

  .critter-top-row {
    display: flex;
  }
  .critter-bottom-row {
    display: flex;
  }

  .critter-name {
    flex: 1 1 0;
    font-family: "Wellfleet", cursive;
    color: #68d391;
    padding-bottom: 0.3rem;
  }

  .critter-detail {
    flex: 1 1 0;
  }

  .button-on {
    background-color: #48bb78;
  }

  .button-icon {
    font-size: 120%;
  }

  .hidden {
    display: none;
  }

  .sort-icon {
    margin: 0.2rem;
  }

  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }

  .finding-text {
    background-color: #f0fff4;
    padding: 0.3rem;
    border-radius: 0.3rem;
    margin: 0.3rem;
  }

  .hide-button {
    float: right;
    margin: 0.4rem;
  }
</style>

<div class="critters panel {$page == 'critters' ? 'grow' : 'shrink'}">

  {#if $page === 'critters'}
    <div transition:slide>
      {#if showFinding}
        <div transition:slide class="finding-text">
          <i
            class="hide-button fad fa-times"
            on:click={() => (showFinding = false)} />
          Finding critters available in {finalLocationDate.toLocaleString(
            'default',
            {
              month: 'long'
            }
          )} at {lightFormat(finalLocationDate, 'h:mm aaaa')} in the {$activeLocation.hemisphere}ern
          hemisphere.
          {#if noLocations}
            You will get a better result if you add locations.
          {/if}

        </div>
      {/if}
      <div class="button-row">
        <label class="critterTypeButton {bug ? 'button-on' : ''}">
          <input class="hidden" type="checkbox" bind:checked={bug} />
          <i class="fad fa-bug button-icon" />
        </label>
        <label class="critterTypeButton {fish ? 'button-on' : ''}">
          <input class="hidden" type="checkbox" bind:checked={fish} />
          <i class="fad fa-fish button-icon fa-swap-opacity" />
        </label>
        <label class="critterTypeButton {sea ? 'button-on' : ''}">
          <input class="hidden" type="checkbox" bind:checked={sea} />
          <i class="fad fa-star button-icon fa-swap-opacity" />
        </label>

      </div>
      <div class="button-row">

        <label class="rainbox {isRaining ? 'rainbox-on' : ''}">
          <input class="hidden" type="checkbox" bind:checked={isRaining} />
          <i class="fad fa-cloud-rain" />
          Rain
        </label>

        <label class="rainbox {hideTrash ? 'rainbox-on' : ''}">
          <input class="hidden" type="checkbox" bind:checked={hideTrash} />
          Hide Common
        </label>

        <div class="critterTypeButton">
          {#if chooseSort || sortBy == 'cpId'}
            <i
              transition:fade
              class="fad fa-sort-numeric-down sort-icon"
              on:click={() => {
                chooseSort = !chooseSort;
                sortBy = 'cpId';
              }} />
          {/if}
          {#if chooseSort || sortBy == 'name'}
            <i
              transition:fade
              class="fad fa-sort-alpha-down sort-icon"
              on:click={() => {
                chooseSort = !chooseSort;
                sortBy = 'name';
              }} />
          {/if}
          {#if chooseSort || sortBy == 'bells'}
            <i
              transition:fade
              class="fad fa-bells sort-icon"
              on:click={() => {
                chooseSort = !chooseSort;
                sortBy = 'bells';
              }} />
          {/if}
        </div>

      </div>

      {#if filteredCritters.length > 0}
        <div class="critter-box">
          {#each filteredCritters as critter}
            <div transition:slide class="critter-item">
              <div class="critter-top-row">
                <div class="critter-name">
                  {#if critter.category === 'bug'}
                    <i class="fad fa-bug" />
                  {/if}
                  {#if critter.category === 'fish'}
                    <i class="fad fa-fish fa-swap-opacity" />
                  {/if}
                  {#if critter.category === 'sea'}
                    <i class="fad fa-star fa-swap-opacity" />
                  {/if}
                  {critter.name}
                </div>
              </div>

              <div class="critter-bottom-row">
                <div class="critter-detail" />
                <div class="critter-detail text-center">
                  {critter.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </div>
                <div class="critter-detail text-right">{critter.location}</div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    </div>
  {/if}
</div>
