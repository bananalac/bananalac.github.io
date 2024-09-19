import { isExactNumeric } from '../data-types.js';

/**
 * Check NUM_RANGE items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {Object} commandInfo 
 * @param {String} vl value
 * @param {Object[]} args
 */
export default function check1(func, sub = "", commandInfo, vl, args) {
   
  let textEditor = "";
  if(sub === "") textEditor = "";
  else textEditor = `with '${sub}' option`;

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    if(!isExactNumeric(vl)) errors.push(`${func}{} ${textEditor} should have numbers.you didn't provide a valid number (Line ${lineNum})`);
    const num = Number(vl);
    if(num > commandInfo.max) errors.push(`${func}{} ${textEditor} option should have a maximum number of ${commandInfo.max} (Line ${lineNum})`)
    else if(num < commandInfo.min) errors.push(`${func}{} ${textEditor} option should have a minimum number of ${commandInfo.min} (Line ${lineNum})`);
  
  }