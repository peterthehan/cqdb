// https://stackoverflow.com/questions/32543936/combination-with-repetition
export function combinationWithRepetition(arr, l) {
  if (l === void 0) {
    l = arr.length;
  }

  const data = Array(l);
  const results = [];
  (function f(pos, start) {
    if(pos === l) {
      results.push(data.slice());
      return;
    }

    for (let i = start; i < arr.length; ++i) {
      data[pos] = arr[i];
      f(pos + 1, i);
    }
  })(0, 0);

  return results;
}

// https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
export function cartesian() {
    const r = [];
    const arg = arguments;
    const max = arg.length - 1;

    function helper(arr, i) {
      for (let j = 0, l = arg[i].length; j < l; ++j) {
        const a = arr.slice(0);
        a.push(arg[i][j]);
        if (i === max) {
          r.push(a);
        } else {
          helper(a, i + 1);
        }
      }
    }

    helper([], 0);
    return r;
}