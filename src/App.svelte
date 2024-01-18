<script>
  import { onMount } from "svelte";
  import getData from "./data";
  import MainContainer from "./components/MainContainer.svelte";

  let dataset = {};

  const messageFromParent = "https://indianstates.csis.org/analysis";


  onMount(async () => {
    const res = await getData(messageFromParent);
    dataset = res;
  });
</script>

{#if dataset.data && dataset.data.length > 0}
  <MainContainer {dataset} />
{:else}
  <div class="loading-container">
    <div class="loading" />
  </div>
{/if}

<style lang="scss" global>
  @use "./scss/main.scss";
</style>
