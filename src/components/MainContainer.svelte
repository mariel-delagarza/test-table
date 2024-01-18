<script>
  import Options from "./Options.svelte"
  import Table from "./Table.svelte"

  export let dataset;
  let selectedSector = "";
  let selectedSubsector = "";
  let selectedResourceType = "";
  let selectedState = ""; 
  let searchText;
  $: row = { isOpen: false };

  $: filteredData = () => {
    return dataset.data
      .filter((row) => {
    
        const rowDate = new Date(row.date_string)

        const isSelectedState = selectedState ? row.states.includes(selectedState) : true;
        const isSelectedSector = selectedSector ? row.sectors.includes(selectedSector) : true;
        const isSelectedSubsector = selectedSubsector ? row.subsectors.includes(selectedSubsector) : true;
        const isSelectedResourceType = selectedResourceType ? row.type === selectedResourceType : true;
        
        const filteredTimelineEvent = searchText
          ? searchText.toLowerCase().trim()
          : ""


        const matchesText = (texts) => {
          return Array.isArray(texts)
            ? texts.some(text => text.toLowerCase().includes(filteredTimelineEvent))
            : texts.toLowerCase().includes(filteredTimelineEvent);
        };

        const matchesAnyCondition = [
          matchesText(row.timelineEvent.headline),
          matchesText(row.sectors),
          matchesText(row.subsectors),
          matchesText(row.type),
        ].some(Boolean)

        return (
          matchesAnyCondition &&
          isSelectedSector &&
          isSelectedSubsector &&
          isSelectedResourceType &&
          isSelectedState
        )
      })
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  }
</script>

<div id="site-content">

  <section class="table-container">
    <Options
      {dataset}
      filteredData={filteredData()}
      bind:row
      bind:selectedSector
      bind:selectedSubsector
      bind:selectedResourceType
      bind:selectedState
      bind:searchText
    />
  
    <Table filteredData={filteredData()} bind:row />
  </section>
  
</div>

<style lang="scss">
  @use "../scss/components/table-container";
</style>
