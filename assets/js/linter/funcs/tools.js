/**
 * returns all keys of an object in an array.
 * @param {Object} obj 
 * @returns {String[]} keys of object
 */
export function allKeys(obj) { return Object.keys(obj); }

/**
 * checks if text splitable by asterix ( * ), if not, returns original text.
 * @param {String} text 
 * @returns {String[] | String}
 */
export function splitText(text) { return text.includes('*') ? text.split('*') : text; }

/**
 * checks if text splitable by custom seperator, if not, returns original text.
 * @param {String} text 
 * @param {String} spliter
 * @returns {String[] | String}
 */
export function splitTextCustom(text, spliter) { return text.includes(spliter) ? text.split(spliter) : text; }

/**
 * removes empty strings from string array.
 * @param {String[]} arr 
 * @returns {String[]}
 */
export function removeEmpty(arr) {
  return arr.filter(item => item !== '');
}
/**
 * @param {any[]} arr 
 * @returns 
 */
export function includesArr(str, arr) {
  return arr.some(item => str.includes(item));
}

/**
 * 
 * @param {*} arr 
 * @returns 
 */
export function detectRangeAndJoin(arr) {
  const numbers = arr.filter(item => typeof item === 'number');
  const strings = arr.filter(item => typeof item === 'string');
  
  if (numbers.length === 0) return strings.join(', ');

  const first = Math.min(...numbers);
  const last = Math.max(...numbers);
  
  const range = `${first}~${last}`;
  return [range, ...strings].join(', ');
}