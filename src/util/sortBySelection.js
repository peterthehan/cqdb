export function sortBySelection(filtered, sortBy, sortIsDescending, selectsDefault) {
  if (sortBy === selectsDefault && sortIsDescending) {
    return filtered; // return as-is if default
  }

  const cloned = filtered.slice();
  
  if (sortBy === selectsDefault) {
    cloned.reverse();
  } else if (sortIsDescending) {
    cloned.sort((a, b) => {
      if (a.sortable[sortBy] === b.sortable[sortBy]) { return 0; }
      return a.sortable[sortBy] > b.sortable[sortBy] ? -1 : 1;
    });
  } else {
    cloned.sort((a, b) => {
      if (a.sortable[sortBy] === b.sortable[sortBy]) { return 0; }
      return a.sortable[sortBy] < b.sortable[sortBy] ? -1 : 1;
    });
  }

  return cloned;
}