export function sortBySelection(filtered, sortBy, sortIsDescending, selectsDefault) {
  const cloned = [...filtered];
  
  if (sortBy === selectsDefault) {
    if (!sortIsDescending) {
      cloned.reverse();
    }
  } else {
    if (sortIsDescending) {
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
  }

  return cloned;
}