const URL = "http://localhost:3001/feed.json"

/*
URL from parent gives us
/sectors/energy

so in our response, we filter to only include items where
sectors includes energy

if we get /states/delhi

we filter to only include items where states includes delhi

const messageFromParent = {URL}

process URL to get the filter

*/

// Function to filter data based on URL path
function filterData(items, category, filterValue) {

  switch (category) {
    case 'states':
      return filterValue 
      ? items.filter(item => item.states.map(state => state.toLowerCase()).includes(filterValue))
      : items.filter(item => item.states.length > 0);
    case 'sectors':
      return filterValue 
        ? items.filter(item => item.sectors.map(sector => sector.toLowerCase()).includes(filterValue))
        : items.filter(item => item.sectors.length > 0);
    case 'analysis':
      return items.filter(item => item.resource_type === 'Newsletter');
    case 'resources':
      return items.filter(item => item.resource_type === 'Resource');
    default:
      return items;
  }
}

// Function to grab the subsector if it exists - we'll use
// this for the dropdown if a user selects a subsector from the
// nav bar.
function getSubsector(url) {
  const subsectorPrefix = "#subsector=";
  const subsectorIndex = url.indexOf(subsectorPrefix);

  if (subsectorIndex !== -1) {
    // Extract the subsector from the URL
    return url.substring(subsectorIndex + subsectorPrefix.length);
  }

  // Return null or an empty string if no subsector is found
  return null;
}



export default function getData(messageFromParent) {

  const path = messageFromParent.split('.org')[1];
  const pathParts = path.split('/');
  console.log(pathParts[2])
  const filterCategory = pathParts[1];
  const filterValue = pathParts[2] ? pathParts[2].toLowerCase() : ''; // Case-insensitive filter value

  const subsector_filter = getSubsector(messageFromParent);
  console.log(subsector_filter)

  const dataPromise = fetch(URL)
    .then((response) => response.json())
    .then((res) => {
      const filteredData = filterData(res.items, filterCategory, filterValue);
  
      const data = filteredData.map((item, index) => {
        let sources = item.primary_sources
        let transformedSources = sources.map((source) => {
          return [source.url || "", source.name || ""]
        })
        let weeklyOrQuarterly = classifyItem(item)

        let states = standardizeStateNames(item.states)

        const modifiedSectors = item.sectors.map(sector => sector.replace(/\band\b/g, "&"));
        const modifiedSubsectors = item.subsectors.map(subsector => subsector.replace(/\band\b/g, "&"));
        

        return {
          id: index,
          timelineEvent: {
            headline: item.headline,
            url: item.url,
            content: item.content,
            sources: transformedSources,
            is_featured: item.is_featured,
            weeklyOrQuarterly: weeklyOrQuarterly,
          },
          sectors: modifiedSectors,
          subsectors: modifiedSubsectors,
          states: states,
          type: item.resource_type,
          date_string: item.date,
          date_month: item.date_month,
          date_day: item.date_day,
          date_year: item.date_year,
          date: "",
        }
      })

      const dates = createAndAssignDateObjects(data)
      const setsOfData = extractUniqueSets(data)

      return {
        data: data,
        dates: dates,
        type: setsOfData.uniqueResourceTypes,
        sectors: setsOfData.uniqueSectors,  
        subsectors: setsOfData.uniqueSubsectors,
        states: setsOfData.uniqueStates,
        years: setsOfData.uniqueYears,
        subsector_filter: subsector_filter,
        filterCategory: filterCategory,
        filterValue: filterValue
      }
    })
  return dataPromise
}

function createAndAssignDateObjects(array) {
  let dates = []
  let date_string = []

  for (let i = 0; i < array.length; i++) {
    let date = array[i].date_string

    let dateObject = new Date(date)
    array[i].date = dateObject

    if (!date_string.includes(array[i].date_string)) {
      date_string.push(array[i].date_string)
      dates.push(dateObject)
    }
  }

  return dates
}

// flag if item is weekly or quarterly
function classifyItem(item) {
  // Initialize the flag as an empty string
  let weeklyOrQuarterly = ""

  if (item.tags.includes("States Weekly")) {
    weeklyOrQuarterly = "weekly"
  } else if (item.tags.includes("States Quarterly Updates")) {
    weeklyOrQuarterly = "quarterly"
  } else if (
    item.headline.includes("States Weekly") ||
    item.headline.includes("States Update")
  ) {
    weeklyOrQuarterly = "weekly"
  }

  return weeklyOrQuarterly
}

// Map state names to match the names in the map - fix for
// mistakes in data (only ~5-10 of 4000+ items)
const stateNameMapping = {
  "New Delhi": "Delhi",
  "Jammu and Kashmir": "Union Territory of Jammu and Kashmir",
  "Center-State relations": "Center-State Relations",
  "Center-state Relations": "Center-State Relations",
  Karna: "Karnataka",
}

function standardizeStateNames(states) {
  return states.map((state) => stateNameMapping[state] || state)
}

function extractUniqueSets(data) {
  const sectorSet = new Set()
  const subsectorSet = new Set()
  const stateSet = new Set()
  const resourceTypeSet = new Set()
  const yearSet = new Set() 
  
  data.forEach((item) => {
    item.sectors.forEach((sector) => {
      const modifiedSector = sector.replace(/\band\b/g, "&")
      
      sectorSet.add(modifiedSector)
    })
    item.subsectors.forEach((subsector) => {
      const modifiedSubsector = subsector.replace(/\band\b/g, "&")
      subsectorSet.add(modifiedSubsector)
    })
    item.states.forEach((state) => stateSet.add(state))
    resourceTypeSet.add(item.type)
    yearSet.add(item.date_year) // Add the year to the yearSet
  })

  return {
    uniqueSectors: Array.from(sectorSet),
    uniqueSubsectors: Array.from(subsectorSet),
    uniqueStates: Array.from(stateSet),
    uniqueResourceTypes: Array.from(resourceTypeSet),
    uniqueYears: Array.from(yearSet), // Convert yearSet to an array
  }
}
