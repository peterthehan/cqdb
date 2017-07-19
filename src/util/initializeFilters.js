import { createFilterURL, } from '../util/createFilterURL';
import { toTitleCase, } from '../util/toTitleCase';

export function initializeFilters(checkboxes) {
  // initialize each filter category key with a filter-false value
  const filters = {};
  Object.keys(checkboxes).forEach(i => {
    filters[i] = {};
    checkboxes[i].forEach(j => filters[i][j] = false);
  });

  // if url contains querystring, parse and error-check it
  if (window.location.search.length) {
    decodeURIComponent(window.location.search.substring(1)).split('&').forEach(i => {
      const kv = i.split('=');
      const key = toTitleCase(kv[0]);
      if (filters[key]) {
        const keys = kv[1].toLowerCase().split(',');
        Object.keys(filters[key])
          .filter(j => keys.includes(j.toLowerCase()))
          .forEach(j => filters[key][j] = true);
      }
    });

    // update url
    window.history.replaceState('', '', `?${createFilterURL(filters)}`);
  }

  return filters;
}