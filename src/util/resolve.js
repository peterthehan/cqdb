const data = [
  Object.assign(...require('../Decrypted/get_textlocale_en_us_0.json')['textlocale']),
  Object.assign(...require('../Decrypted/get_textlocale_en_us_1.json')['textlocale']),
  Object.assign(...require('../Decrypted/get_textlocale_en_us_2.json')['textlocale']),
  Object.assign(...require('../Decrypted/get_textlocale_en_us_3.json')['textlocale']),
  Object.assign(...require('../Decrypted/get_textlocale_en_us_4.json')['textlocale'])
];

function r(value) {
  if (value !== null) {
    for (let currentData of data) {
      if (value in currentData) {
        return currentData[value];
      }
    }
  }
  return null;
}

export function resolve(value) {
  return value !== null && value.constructor === Array
    ? value.map(currentValue => r(currentValue))
    : r(value);
}
