
// const URL = "http://localhost:3001/feed.json"

// export default function getData() {
//   const dataPromise = fetch(URL)
//     .then((response) => response.json())
//     .then((res) => {
//       const data = res.items.map((item, index) => {
//         let sources = item.primary_sources
//         let transformedSources = sources.map((source) => {
//           return [source.url || "", source.name || ""]
//         })
//         let weeklyOrQuarterly = classifyItem(item)

//         let states = standardizeStateNames(item.states)
        
//         return {
//           id: item.index,
//           timelineEvent: {
//             title: item.headline,
//             url: item.url,
//             quote: item.content,
//             sources: transformedSources,
//             is_featured: item.is_featured,
//             weeklyOrQuarterly: weeklyOrQuarterly,
//           },
//           sectors: item.sectors,
//           subsectors: item.subsectors,
//           states: states,
//           type: item.resource_type,
//           date_string: item.date,
//           date_month: item.month,
//           date_day: item.day,
//           date_year: item.year,
//           date: "",
//         }
//       })

//       const dates = createAndAssignDateObjects(data)
//       console.log(dates)
//       const setsOfData = extractUniqueSets(data);

//       return {
//         data: data,
//         dates: dates,
//         type: setsOfData.uniqueResourceTypes,
//         sectors: setsOfData.uniqueSectors,
//         states: setsOfData.uniqueStates,
//         years: setsOfData.uniqueYears,
//       }
//     })
//   return dataPromise
// }

// function createAndAssignDateObjects(array) {
//   let dates = []
//   let date_string = []

//   for (let i = 0; i < array.length; i++) {
//     let date = array[i].date_string

//     let dateObject = new Date(date)
//     array[i].date = dateObject

//     if (!date_string.includes(array[i].date_string)) {
//       date_string.push(array[i].date_string)
//       dates.push(dateObject)
//     }
//   }

//   return dates
// }

// // flag if item is weekly or quarterly
// function classifyItem(item) {
//   // Initialize the flag as an empty string
//   let weeklyOrQuarterly = ""

//   if (item.tags.includes("States Weekly")) {
//     weeklyOrQuarterly = "weekly"
//   } else if (item.tags.includes("States Quarterly Updates")) {
//     weeklyOrQuarterly = "quarterly"
//   } else if (
//     item.headline.includes("States Weekly") ||
//     item.headline.includes("States Update")
//   ) {
//     weeklyOrQuarterly = "weekly"
//   }

//   return weeklyOrQuarterly
// }

// // Map state names to match the names in the map - fix for 
// // mistakes in data (only ~5-10 of 4000+ items)
// const stateNameMapping = {
//   "New Delhi": "Delhi",
//   "Jammu and Kashmir": "Union Territory of Jammu and Kashmir",
//   "Center-State relations": "Center-State Relations",
//   "Center-state Relations": "Center-State Relations",
//   "Karna": "Karnataka",
// }

// function standardizeStateNames(states) {
//   return states.map(state => stateNameMapping[state] || state);
// }

// function extractUniqueSets(data) {
//   const sectorSet = new Set();
//   const stateSet = new Set();
//   const resourceTypeSet = new Set();
//   const yearSet = new Set(); // Set for years

//   data.forEach((item) => {
//       item.sectors.forEach(sector => sectorSet.add(sector));
//       item.states.forEach(state => stateSet.add(state));
//       resourceTypeSet.add(item.type);
//       yearSet.add(item.date_year); // Add the year to the yearSet
//   });

//   return {
//       uniqueSectors: Array.from(sectorSet),
//       uniqueStates: Array.from(stateSet),
//       uniqueResourceTypes: Array.from(resourceTypeSet),
//       uniqueYears: Array.from(yearSet) // Convert yearSet to an array
//   };
// }

import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-_ERImv22VF5VJU8oWN2g9_uQ4LzJr21zOHHtizHHYTuQJvHZHJGaJE6d1DUDifpiPGqmZL4MIbgU/pub?gid=2021316330&single=true&output=csv"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      return {
        id: index,
        timelineEvent: {
          title: row.title,
          quote: row.quote,
          sources: [
            [row.source_1, row.source_name_1, row.vpn_required_1],
            [row.source_2, row.source_name_2, row.vpn_required_2],
            [row.source_3, row.source_name_3, row.vpn_required_3],
          ],
          translation_source_used: row.translation_source_used,
          translation_source_link: row.translation_source_link,
          translation_source_name: row.translation_source_name,
          image_url: row.image_url,
          image_source: row.image_source,
          key_moment: row.key_moment,
        },
        key_moment: row.key_moment ? row.key_moment : null,
        category: row.category,
        category_name: row.category_name,
        speaker: row.speaker,
        speaker_name: "",
        type: row.type,
        date_string: row.date,
        date: "",
      }
    })

    const speaker = formatSpeaker(data)

    const speaker_name = createAndAssignSpeakerNames(data)

    const type = formatType(data)

    const categories = formatCategories(data)

    const dates = createAndAssignDateObjects(data)

    const years = createYearList(data)

    return {
      data: data,
      categories: categories,
      dates: dates,
      speaker: speaker,
      //speaker without title - for dropdown
      speaker_name: speaker_name,
      type: type,
      months: months,
      years: years,
    }
  })
  return dataPromise
}

function createYearList(data) {
  // Create a Set to store unique years
  const uniqueYearsSet = new Set()

  // Loop through each row in the dataset
  data.forEach((row) => {
    // Extract the year from the date_string and add it to the Set
    const year = new Date(row.date_string).getFullYear()
    uniqueYearsSet.add(year)
  })

  // Convert the Set of unique years to an array and sort it
  return Array.from(uniqueYearsSet).sort((a, b) => a - b) // Numeric sort
}

function createAndAssignSpeakerNames(array) {
  let speaker_Name_Array = []

  for (let i = 0; i < array.length; i++) {
    let name = array[i].speaker.split(",")[0]
    if (array[i].speaker != "") {
      array[i].speaker_name = name

      if (!speaker_Name_Array.includes(name)) {
        speaker_Name_Array.push(name)
      }
    }
  }

  return speaker_Name_Array.sort((a, b) => a.localeCompare(b))
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

function formatSpeaker(array) {
  return [...new Set(array.map((el) => el.speaker))]
}

function formatType(array) {
  return [...new Set(array.map((el) => el.type))]
}

function formatCategories(array) {
  return [...new Set(array.map((el) => el.category))]
}
