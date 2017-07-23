const data = require('../Decrypted/filtered_textlocale_en_us.json');

export function resolve(value) {
  //console.log(value);
  return data[value];
}
