export function mean(data) {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

// https://gist.github.com/caseyjustus/1166258
export function median(data) {
  if (!data.length) { return 0; }
  const numbers = data.slice(0).sort((a, b) => a - b);
  const middle = Math.floor(numbers.length / 2);
  const isEven = numbers.length % 2 === 0;
  return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
}

export function mode(data) {
  const counter = {};
  let mode = [];
  let max = 0;
  for (let i in data) {
    if (!(data[i] in counter)) {
      counter[data[i]] = 0;
    }
    ++counter[data[i]];

    if (counter[data[i]] === max) { 
      mode.push(data[i]);
    } else if (counter[data[i]] > max) {
      max = counter[data[i]];
      mode = [data[i]];
    }
  }

  return Math.max(...mode);
}

export function standardDeviation(data){
  const avg = mean(data);
  const squareDiffs = data.map(i => {
    const diff = i - avg;
    return diff * diff;
  });
  
  return Math.sqrt(mean(squareDiffs));
}
