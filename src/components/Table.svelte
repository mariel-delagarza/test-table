<script>
  import { onMount } from "svelte"
  import tooltip from "../js/tooltip"
  import Icon from "./Icons.svelte"

  export let filteredData
  export let row

  // Pagination state
  export let currentPage = 1
  export let itemsPerPage = 100

  // Compute the paginated data
  $: paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  let sortIconContainer
  $: sortClass = "inactive"

  const sortByColumns = [
    "headline",
    "sector",
    "state",
    "resource type",
    "date posted",
  ]

  function handleClick(e) {
    let headline = undefined
    let currentRow = undefined
    let extraContent = undefined

    if (e.target.parentNode.classList.contains("headline")) {
      headline = e.target.parentNode
      currentRow = headline.nextElementSibling
      extraContent = e.target.parentNode.nextElementSibling
    } else {
      headline = e.target.parentNode.parentNode
      currentRow = headline.nextElementSibling
      extraContent = e.target.parentNode.parentNode.nextElementSibling
    }

    headline.classList.toggle("title--active")
    headline.classList.toggle("table__body__cell--border")
    //currentRow.classList.toggle("table__body__cell--border")
    // Show/Hide extraContent
    extraContent.classList.toggle("active")
    extraContent.classList.toggle("hide")
    row.isOpen ? (row.isOpen = true) : (row.isOpen = !row.isOpen)
  }

  const headerNames = [
    "Headline",
    "Sector",
    "State",
    "Resource Type",
    "Date Posted",
  ]

  $: sortBy = { col: "event", ascending: true }

  $: sort = (e, column) => {
    column = column.toLowerCase().replace(/\s/g, "_") // replace spaces using regex with underscore
    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })

    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending
      sortClass = sortBy.ascending ? "active" : "inactive"
    } else {
      sortClass = "inactive"
      sortBy.col = column
      sortBy.ascending = true
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1

    // Define sorting logic for each column
    let sortFunction

    if (column === "headline") {
      sortFunction = (a, b) =>
        a.timelineEvent.headline < b.timelineEvent.headline
          ? -1 * sortModifier
          : a.timelineEvent.headline > b.timelineEvent.headline
          ? 1 * sortModifier
          : 0
    } else if (column === "sector") {
      sortFunction = (a, b) => {
        let sectorA = a.sectors[0] || "" // Fallback to empty string if undefined
        let sectorB = b.sectors[0] || ""
        return sectorA.localeCompare(sectorB) * sortModifier
      }
    } else if (column === "state") {
      sortFunction = (a, b) => {
        let stateA = a.states[0] || "" // Fallback to empty string if undefined
        let stateB = b.states[0] || ""
        return stateA.localeCompare(stateB) * sortModifier
      }
    } else if (column === "resource_type") {
      sortFunction = (a, b) => a.type.localeCompare(b.type) * sortModifier
    } else if (column === "date_posted") {
      sortFunction = (a, b) =>
        a.date < b.date
          ? -1 * sortModifier
          : a.date > b.date
          ? 1 * sortModifier
          : 0
    }

    // Apply the sorting function
    if (sortFunction) {
      // Use a temporary variable for sorted data
      const sortedData = [...filteredData].sort(sortFunction)
      console.log(column)
      console.log(sortedData)
      filteredData = sortedData
    }
  }

  onMount(() => {
    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })
    const divTimelineEvent = document.querySelector(
      ".table__cell--header__container__event",
    )

    // divTimelineEvent.children[1].classList.add("sort-icon--active")
    // Sync horizontal scroll of table header and table body
    // Inspired by https://codepen.io/Goweb/pen/rgrjWx
    const scrollSync = () => {
      const tableHeader = document.querySelector("#table-header")
      const tableBody = document.querySelector("#table-body")

      const bindSyncScrolling = (one, two) => {
        let echo = false
        const sync = (elOne, elTwo) => () =>
          (echo = !echo) &&
          ((elOne.scrollTop = elTwo.scrollTop),
          (elOne.scrollLeft = elTwo.scrollLeft))
        two.onscroll = sync(one, two)
        one.onscroll = sync(two, one)
      }
      bindSyncScrolling(tableHeader, tableBody)
    }
    scrollSync()
  })
</script>

<div class="table__wrapper">
  <div class="table__container table__container--sticky" id="table-header">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          {#each headerNames as name}
            <th class="table__cell--header" scope="col">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="table__cell--header__container table__cell--header__container__{name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}"
                on:click={sortByColumns.includes(name.toLowerCase())
                  ? (e) => sort(e, name)
                  : ""}
              >
                <span>{name}</span>
                {#if sortByColumns.includes(name.toLowerCase())}
                  <div
                    class="sort-icons-container"
                    on:click={(e) => sort(e, name)}
                  >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        name.toLowerCase().split(' ').join('_') &&
                      sortBy.ascending
                        ? 'inactive'
                        : 'active'}">▲</button
                    >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        name.toLowerCase().split(' ').join('_') &&
                      sortBy.ascending
                        ? 'active'
                        : 'inactive'}">▼</button
                    >
                  </div>
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
    </table>
  </div>
  <div class="table__container" id="table-body">
    <table class="table table__body">
      <tbody>
        {#each paginatedData as rows}
          <tr
            on:click={(e) => handleClick(e)}
            class="title table__body__cell--border"
          >
            <!-- event name/title -->
            <td class="table__body__cell table__body__cell--data"
              ><div class="table__body__cell__title-container">
                <span class="icon-container" />{rows.timelineEvent.headline}
              </div></td
            >
            <!-- event sector -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.sectors.join(", ")}</td
            >
            <!-- event state -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.states.join(", ")}</td
            >
            <!-- event resource type -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.type}</td
            >
            <!-- event date - displays string value -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.date_month}. {rows.date_year}</td
            >
          </tr>
          <!--this tr is the stuff under the dropdown -->
          <tr class="extra-content hide">
            <td class="table__body__cell" colspan="6">
              <div class="extra-content__container">
                <div class="description">
                  <div>
                    IN DETAIL: <a
                      href={rows.timelineEvent.url}
                      target="_blank"
                      rel="noopener noreferrer">Read More</a
                    >
                  </div>
                  {#if rows.timelineEvent.content}
                    <br />
                    <div>{rows.timelineEvent.content}</div>
                    <br />
                  {/if}
                  {#if rows.timelineEvent.sources && rows.timelineEvent.sources.length > 0}
                    <div class="link">
                      {#if rows.timelineEvent.sources && rows.timelineEvent.sources.length > 0}
                        SOURCE(S):
                        {#each rows.timelineEvent.sources as source, index (source)}
                          {#if source[1]}
                            <!-- Check if source name is present -->
                            {#if source[0]}
                              <!-- Check if source URL is present -->
                              <a
                                href={source[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {source[1]}{index <
                                rows.timelineEvent.sources.length - 1
                                  ? ","
                                  : ""}
                              </a>
                            {:else}
                              {source[1]}{index <
                              rows.timelineEvent.sources.length - 1
                                ? ", "
                                : ""}
                            {/if}
                          {/if}
                        {/each}
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </td>
          </tr>
        {:else}
          <!-- if filters return an empty table -->
          <tr>
            <td class="table__body__cell table__body__cell--no-data" colspan="6"
              ><p class="table__body__cell__no-data__title">0 entries found.</p>
              <p class="table__body__cell__no-data__desc">
                Try changing or removing filters to adjust the results.
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  @use "../scss/abstracts/" as *;
  @use "../scss/components/table";
  :global(.tippy-box[data-theme~="poni"]) {
    @extend %text-style-ui-4;
    color: $color-text-gray-500;
    background-color: $color-background-white;
    padding: rem(6) rem(6) rem(8) rem(6);
    filter: drop-shadow(0px 1px 9px rgba(0, 0, 0, 0.06))
      drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  :global(
      .tippy-box[data-theme~="poni"][data-placement^="top"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="bottom"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="left"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="right"]
        > .tippy-arrow::before
    ) {
    border-top-color: $color-background-white;
  }
</style>
