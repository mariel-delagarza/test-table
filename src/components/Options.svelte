<script>
  import { onMount } from "svelte"
  import Search from "./Search.svelte"
  import Select from "svelte-select"
  import Icon from "./Icons.svelte"

  export let dataset
  export let filteredData
  export let selectedSector
  export let selectedSubsector
  export let selectedState
  export let selectedResourceType
  export let searchText = ""
  export let row

  $: totalEntries = filteredData.length

  const optionIdentifier = "value"
  const labelIdentifier = "label"
  let filterCategory = dataset.filterCategory
  let filterValue = dataset.filterValue

  console.log("filterCategory", filterCategory)
  console.log("filterValue", filterValue)

  function removeRowActiveTitleStyle() {
    const title = document.querySelectorAll(".title--active")
    title.forEach((item) => {
      item.classList.remove("title--active")
    })
  }

  function removeExtraContentStyle() {
    const extraContent = document.querySelectorAll(".extra-content")
    extraContent.forEach((content) => {
      if (content.classList.contains("active")) {
        content.classList.remove("active")
        content.classList.add("hide")
      }
    })
  }

  function switchRowBottomLine() {
    const rowTitle = document.querySelectorAll(".title")
    const extraContent = document.querySelectorAll(".extra-content")
    extraContent.forEach((item) => {
      if (item.classList.contains("table__body__cell--border")) {
        item.classList.remove("table__body__cell--border")
      }
    })
    rowTitle.forEach((item) => {
      if (!item.classList.contains("table__body__cell--border")) {
        item.classList.add("table__body__cell--border")
      }
    })
  }

  function handleSelect(event, selectName) {
    if (row.isOpen) {
      toggleRowState()
    }

    switch (selectName) {
      case "Sector":
        selectedSector = event.detail.value
        break
      case "Subsector":
        selectedSubsector = event.detail.value
        break
      case "State":
        selectedState = event.detail.value
        break
      case "Resource Type":
        selectedResourceType = event.detail.value
        break
      default:
        console.error("Invalid selectName:", selectName)
    }
  }

  function toggleRowState() {
    row.isOpen = !row.isOpen
    removeRowActiveTitleStyle()
    removeExtraContentStyle()
    switchRowBottomLine()
  }

  function handleClear(selectName) {
    if (row.isOpen) {
      row.isOpen = !row.isOpen
      removeRowActiveTitleStyle()
      removeExtraContentStyle()
      switchRowBottomLine()
    }

    switch (selectName) {
      case "Sector":
        selectedSector = ""
        break
      case "Subsector":
        selectedSubsector = ""
        break
      case "State":
        selectedState = ""
        break
      case "Resource Type":
        selectedResourceType = ""
        break
      default:
        console.error("Invalid selectName:", selectName)
    }
  }

  // handle the icon
  const chevronUp =
    '<svg class="iconUp" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 15 14 0 0 15h28z" fill="#000"/></svg>'
  const chevronDown =
    '<svg class="iconDown" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m0 0 14 15L28 0H0z" fill="#000"/></svg>'
  let chevron = chevronDown
  let isListOpen = false
  let listCategoryOpen = false

  $: chevron = isListOpen ? chevronUp : chevronDown

  // // Pagination state
  // export let currentPage = 1
  // const itemsPerPage = 100
  // let totalEntries = filteredData.length
  // let totalPages = Math.ceil(totalEntries / itemsPerPage)

  // $: if (currentPage) {
  // console.log(`Current page is now: ${currentPage}`);
// }
function handleScrollLeft() {
    const tableContainer = document.getElementById("table-body")
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")

    tableContainer.scrollLeft -= 100
    if (btnIconRight.classList.contains("inactive")) {
      btnIconRight.classList.remove("inactive")
    }
    if (tableContainer.scrollLeft === 0) {
      btnIconLeft.classList.add("inactive")
    }
  }

  function handleScrollRight() {
    const tableContainer = document.getElementById("table-body")
    const table = document.getElementsByClassName("table")[0]
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")
    tableContainer.scrollLeft += 100
    if (btnIconLeft.classList.contains("inactive")) {
      btnIconLeft.classList.remove("inactive")
    }
    if (
      Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth >=
      table.offsetWidth
    ) {
      btnIconRight.classList.add("inactive")
    }
  }

  // Handle clicking the pagination buttons
  // function goToNextPage() {
  //   if (currentPage < totalPages) currentPage++
  // }

  // function goToPreviousPage() {
  //   if (currentPage > 1) currentPage--
  // }

  // // Calculate the range of entries being shown
  // $: startEntry = (currentPage - 1) * itemsPerPage + 1
  // $: endEntry = startEntry + itemsPerPage - 1
  // if (endEntry > totalEntries) endEntry = totalEntries

  onMount(() => {
    isListOpen = false
    const tableContainer = document.getElementById("table-body")
    const table = document.getElementsByClassName("table")[0]
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")
    tableContainer.addEventListener("scroll", () => {
      const left = tableContainer.scrollLeft
      if (left > 0) {
        btnIconLeft.classList.remove("inactive")
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 >=
        table.offsetWidth
      ) {
        btnIconRight.classList.add("inactive")
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 <=
        table.offsetWidth
      ) {
        btnIconRight.classList.remove("inactive")
      }
      if (left === 0) {
        btnIconLeft.classList.add("inactive")
      }
    })
  })
</script>

<!-- dropdown filters -->
<div class="selects">
  {#if filterCategory == 'states' || filterCategory == 'sectors' && !filterValue}
    <!-- Sector dropdown only if it's not a specific state page -->
    <div class="select-container">
      <div class="label">Sector</div>
      <Select
        indicatorSvg={chevron}
        showChevron={true}
        {optionIdentifier}
        {labelIdentifier}
        items={dataset.sectors}
        placeholder="Select a sector"
        on:select={(event) => handleSelect(event, "Sector")}
        on:clear={(event) => handleClear("Sector")}
      />
    </div>
  {/if}
  
  {#if filterCategory == 'sectors' && filterValue || filterCategory === 'analysis'}
    <!-- Subsector dropdown for sectors or analysis category -->
    <div class="select-container">
      <div class="label">Subsector</div>
      <Select
        indicatorSvg={chevron}
        showChevron={true}
        {optionIdentifier}
        {labelIdentifier}
        items={dataset.subsectors}
        placeholder="Select a subsector"
        on:select={(event) => handleSelect(event, "Subsector")}
        on:clear={(event) => handleClear("Subsector")}
      />
    </div>
  {/if}
  
  {#if filterCategory !== 'states'}
    <!-- State dropdown for any category except when it's a general states page without a specific state -->
    <div class="select-container">
      <div class="label">State</div>
      <Select
        indicatorSvg={chevron}
        showChevron={true}
        {optionIdentifier}
        {labelIdentifier}
        items={dataset.states}
        placeholder="Select a state"
        on:select={(event) => handleSelect(event, "State")}
        on:clear={() => handleClear("State")}
      />
    </div>
  {/if}

  <!-- Resource Type dropdown is always rendered -->
  <div class="select-container">
    <div class="label">Resource Type</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.type}
      placeholder="Select a resource type"
      on:select={(event) => handleSelect(event, "Resource Type")}
      on:clear={() => handleClear("Resource Type")}
    />
  </div>
</div>

<!--"Showing ### Entries" + left/right buttons-->
<!--"Showing ### Entries" + left/right buttons-->
<div class="options options__container options__container--sticky">
  <section class="options__navigation">
    <Search bind:searchText />
    <div class="options__navigation-inner">
      <span class="options__table-total-entries"
        >Showing {totalEntries} {totalEntries > 1 ? "entries" : "entry"}</span
      >
      <button
        id="btn-scroll-left"
        class="btn btn--scroll btn--scroll--left inactive"
        aria-label="Scroll table to the left"
        on:click={handleScrollLeft}
        ><Icon
          id="icon-scroll-left"
          name="Icon-left"
          class="icon inactive"
        /></button
      >
      <button
        id="btn-scroll-right"
        class="btn btn--scroll btn--scroll--right"
        aria-label="Scroll table to the right"
        on:click={handleScrollRight}
        ><Icon id="icon-scroll-right" name="Icon-right" class="icon" /></button
      >
    </div>
  </section>
</div>

<style lang="scss">
  @use "../scss/abstracts/" as *;
  @use "../scss/components/table-container";
  @use "../scss/components/button";
  @use "../scss/components/label";
  @use "../scss/components/select";
  @use "../scss/components/options";

  :global(.selectContainer) {
    &:hover {
      --borderRadius: 0;
      --background: #{$color-background-gray-100};
    }
  }

  :global(.selectContainer .item.active) {
    position: relative;
    --itemIsActiveBG: transparent;
    --itemIsActiveColor: $color-text-gray-500;
    --itemHoverBG: $color-background-gray-100;

    &::before {
      content: "L";
      font-family: arial;
      -ms-transform: scaleX(-1) rotate(-35deg); /* IE 9 */
      -webkit-transform: scaleX(-1) rotate(-35deg); /* Chrome, Safari, Opera */
      transform: scaleX(-1) rotate(-35deg);
      display: inline-block;
      line-height: 1rem;
      color: $color-light-red;
      text-align: center;
      font-size: 14px;
      position: absolute;
      left: 16px;
      top: 10px;
    }
  }

  :global(.selectContainer) {
    --internalPadding: 0 4px 0 0 !important;
    --itemFirstBorderRadius: 2px;
    --placeholderColor: $color-placeholder;
  }

  :global(.selectContainer .item) {
    --itemPadding: #{rem(8)} #{rem(40)} #{rem(12)};
    text-overflow: unset !important;
    overflow: unset !important;
    white-space: unset !important;
  }
  :global(.listContainer) {
    --listBorderRadius: rem(2);
    --listZIndex: 15;
    --listMaxHeight: #{rem(450)};
    --height: 1.2;
    min-width: 250px !important;
  }

  :global(.iconDown) {
    pointer-events: none;
    filter: invert(25%) sepia(18%) saturate(172%) hue-rotate(343deg)
      brightness(96%) contrast(87%);

    &:hover,
    &:focus {
      filter: invert(25%) sepia(18%) saturate(172%) hue-rotate(343deg)
        brightness(96%) contrast(87%);
    }
  }

  :global(.iconUp) {
    pointer-events: none;
    filter: invert(29%) sepia(13%) saturate(765%) hue-rotate(181deg)
      brightness(95%) contrast(89%);

    &:hover,
    &:focus {
      // color brand blue 600
      filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
        brightness(100%) contrast(84%);
    }
  }

  :global(.clearSelect) {
    width: rem(16);
    height: rem(16);
  }

  :global(.selectContainer > input) {
    --inputPadding: 0 28px 0 0;
  }

  :global(.indicator) {
    --indicatorRight: 4px;
    top: auto !important;
  }

  :global(.selectedItem) {
    color: $color-main-red;
  }
  .select-container :global(.selectContainer:hover .indicator) {
    // $color-light-red
    filter: invert(14%) sepia(52%) saturate(5603%) hue-rotate(355deg)
      brightness(82%) contrast(85%);
  }

  .select-container :global(.selectContainer:focus-within .indicator) {
    // $color-light-red
    filter: invert(14%) sepia(52%) saturate(5603%) hue-rotate(355deg)
      brightness(82%) contrast(85%);
  }
</style>
