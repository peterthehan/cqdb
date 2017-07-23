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
  nameFilter = nameFilter.toLowerCase();
  return nameFilter === ''
    ? items
    : items.filter(i => i[0][0].toLowerCase().includes(nameFilter));
}