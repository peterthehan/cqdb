export function filterItems(data, filters = {}) {
  let filtered = data;
  Object.keys(filters).forEach(i => {
    const currentFilters = Object.keys(filters[i]).filter(j => filters[i][j]);
    if (currentFilters.length) {
      filtered = filtered
        .filter(([filters, _]) => filters.some(j => currentFilters.includes(j)));
    }
  });

  return filtered.map(([_, listItem]) => listItem);
}

export function filterNames(nameFilter, items) {
  if (nameFilter === '') {
    return items;
  }

  nameFilter = nameFilter.toLowerCase();
  const exactMatches = [];
  const substringMatches = [];
  items.forEach(i => {
    const name = i[0][0].toLowerCase();
    if (name.split(' ').includes(nameFilter)) {
      exactMatches.push(i);
    } else if (name.includes(nameFilter)) {
      substringMatches.push(i);
    }
  });
  return exactMatches.concat(substringMatches);
}