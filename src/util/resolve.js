const real = require('../Decrypted/filtered_textlocale_en_us.json');
// const frivolous = require('../Decrypted/frivolous_textlocale_en_us.json');

// const data = Object.assign(real, frivolous);
const data = real;

export function resolve(value) {
  // console.log(value);
  return value in data ? data[value] : value;
}
