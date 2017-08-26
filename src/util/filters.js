export function filterByText(data, textFilter) {
  if (textFilter === '') {
    return data;
  }

  // case-insensitive
  textFilter = textFilter.toLowerCase();
  const exactMatches = [];
  const substringMatches = [];
  data.forEach(i => {
    const name = i.name.toLowerCase();
    if (name.split(' ').includes(textFilter)) {
      exactMatches.push(i);
    } else if (name.includes(textFilter)) {
      substringMatches.push(i);
    }
  });

  // return in order of importance in case sorting isn't done
  return exactMatches.concat(substringMatches);
}

export function filterByCheckbox(data, checkboxFilters) {
  let filtered = data;
  Object.keys(checkboxFilters).forEach(i => {
    if (Object.values(checkboxFilters[i]).includes(true)) {
      filtered = i === 'Trait'
        ? filtered.filter(j => j.filterable[i].some(k => checkboxFilters[i][k]))
        : filtered.filter(j => checkboxFilters[i][j.filterable[i]]);
    }
  });

  return filtered;
}