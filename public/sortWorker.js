self.addEventListener('message', function(e) {
  const { data, column, ascending } = e.data;

  // Simple string comparison function
  const simpleStringCompare = (a, b) => a < b ? -1 : (a > b ? 1 : 0);

  // Preprocess dates to timestamps for faster comparisons
  data.forEach(item => {
    item.timestamp = new Date(item.date).getTime();
  });

  // Custom sort functions for each column
  const sortFunctions = {
    'headline': (a, b) => simpleStringCompare(a.timelineEvent.headline, b.timelineEvent.headline),
    'sector': (a, b) => simpleStringCompare(a.sectors[0] || "", b.sectors[0] || ""),
    'state': (a, b) => simpleStringCompare(a.states[0] || "", b.states[0] || ""),
    'resource_type': (a, b) => simpleStringCompare(a.type, b.type),
    'date_posted': (a, b) => a.timestamp - b.timestamp
  };

  // Apply sort direction and select the correct sort function
  const sortFunction = (a, b) => (ascending ? 1 : -1) * sortFunctions[column](a, b);

  // Apply the sorting function
  if (sortFunction) {
    data.sort(sortFunction);
  }

  // Post the sorted data back to the main thread
  self.postMessage(data);
});
