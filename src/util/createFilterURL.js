export function createFilterURL(filters) {
  const filterURL = [];
  Object.keys(filters).forEach(i => {
    const trueKeys = Object.keys(filters[i]).filter(j => filters[i][j]);
    if (trueKeys.length) {
      filterURL.push(`${i}=${trueKeys.join(',')}`);
    }
  });

  return filterURL.join('&');
}