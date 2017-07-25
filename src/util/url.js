import { toTitleCase, } from './toTitleCase';

export function parseURL(checkboxes, selectsBy = [], selectsOrder = []) {
  // initialize filter/sort variables to their default state
  let textFilter = '';

  // initialize each checkbox filter category with a filter-false value
  const checkboxFilters = {};
  Object.keys(checkboxes).forEach(i => {
    checkboxFilters[i] = {};
    checkboxes[i].forEach(j => checkboxFilters[i][j] = false);
  });

  let sortBy = selectsBy[0];
  let sortOrder = selectsOrder[0];

  // if url contains querystring, parse and error-check it
  if (window.location.search.length) {
    decodeURIComponent(window.location.search.substring(1)).split('&').forEach(i => {
      let [key, value] = i.split('=');
      key = toTitleCase(key);
      
      // set values for matching keys if they exist
      if (key === 'Name') {
        textFilter = value;
      } else if (checkboxFilters[key]) {
        const innerKeys = value.toLowerCase().split(',');
        Object.keys(checkboxFilters[key])
          .filter(j => innerKeys.includes(j.toLowerCase()))
          .forEach(j => checkboxFilters[key][j] = true);
      } else if (key === 'By') {
        const selectsByLowerCase = selectsBy.map(j => j.toLowerCase());
        value = value.toLowerCase();
        if (selectsByLowerCase.includes(value)) {
          sortBy = selectsBy[selectsByLowerCase.indexOf(value)];
        }
      } else if (key === 'Order') {
        const selectsOrderLowerCase = selectsOrder.map(j => j.toLowerCase());
        value = value.toLowerCase();
        if (selectsOrderLowerCase.includes(value)) {
          sortOrder = selectsOrder[selectsOrderLowerCase.indexOf(value)];
        }
      }
    });

    // update url since querystring may have contained bad values
    updateURL(
      textFilter,
      checkboxFilters,
      sortBy,
      sortOrder,
      selectsBy,
      selectsOrder
    );
  }

  return [textFilter, checkboxFilters, sortBy, sortOrder,];
}

function getCheckboxURL(checkboxFilters) {
  const checkboxURL = [];
    Object.keys(checkboxFilters).forEach(i => {
    const trueValuedKeys = Object.keys(checkboxFilters[i]).filter(j => checkboxFilters[i][j]);
    if (trueValuedKeys.length) {
      checkboxURL.push(`${i}=${trueValuedKeys.join(',')}`);
    }
  });

  return checkboxURL;
}

export function updateURL(textFilter, checkboxFilters, sortBy = '', sortOrder = '', selectsBy = [], selectsOrder = []) {
  const url = [];

  if (textFilter) {
    url.push(`Name=${textFilter}`);
  }

  const checkboxURL = getCheckboxURL(checkboxFilters);
  if (checkboxURL.length) {
    url.push(...checkboxURL);
  }

  if (selectsBy.length && selectsOrder.length) {
    if (sortBy !== selectsBy[0] || sortOrder !== selectsOrder[0]) {
      url.push(`By=${sortBy}`);
      url.push(`Order=${sortOrder}`);
    }
  }

  window.history.replaceState('', '', `?${url.join('&')}`);
}