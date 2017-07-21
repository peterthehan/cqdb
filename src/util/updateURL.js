function createFilterURL(filters) {
  const filterURL = [];
  Object.keys(filters).forEach(i => {
    const trueKeys = Object.keys(filters[i]).filter(j => filters[i][j]);
    if (trueKeys.length) {
      filterURL.push(`${i}=${trueKeys.join(',')}`);
    }
  });

  return filterURL.join('&');
}

export function updateURL(nameFilter, filters) {
  const filterURL = createFilterURL(filters);
  const nameURL = nameFilter === ''
    ? ''
    : `Name=${nameFilter}${!filterURL.length ? '' : '&'}`;

  window.history.replaceState('', '', `?${nameURL}${filterURL}`);
}