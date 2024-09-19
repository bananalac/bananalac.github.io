import { isExactNumeric } from '../data-types.js';

/**
 * Check NUM_ANY items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {String} vl value
 * @param {Object} commandInfo value
 * @param {Object[]} args 
 */
export default function check0(func, sub = "", vl, commandInfo, args) {

  const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

  let textEditor = "";
  if(sub === "") textEditor = "";
  else textEditor = `with '${sub}' option`;
  
  if(!isExactNumeric(vl)) errors.push(`${func}{} ${textEditor} should have numbers.you didn't provide a valid number (Line ${lineNum})`);
}