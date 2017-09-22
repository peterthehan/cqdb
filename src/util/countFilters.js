export function countFilters(checkboxFilters) {
  let count = 0;
  Object.values(checkboxFilters).forEach(i => {
    Object.values(i).forEach(j => {
      if (j) { ++count; }
    });
  });

  return count;
}