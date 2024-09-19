import { isTextSeparatableAndValidLength, isExactNumeric } from '../data-types.js';

/**
 * Check NUM_RANGE items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {Object} commandInfo
 * @param {String} vl value
 * @param {Object[]} args
 */
export default function check2(func, sub = "", commandInfo, vl, args) {
  let textEditor = "";
  if(sub === "") textEditor = "";
  else textEditor = `with '${sub}' option`;

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    if(!isTextSeparatableAndValidLength(vl, commandInfo.length)) errors.push(`${func}{} ${textEditor} should have three numbers seperated by , (e.g. 1,2,3) (Line ${lineNum})`);
    const xyz = vl.replace(/\,/gm, "").replace(/\./gm).replace(/\-/gm, "").replace(/campos/gm, "").replace(/playerpos/gm, "");
    if(!isExactNumeric(xyz)) errors.push(`${func}{} ${textEditor} option should have three seperated numbers.one or more of them aren't numbers (Line ${lineNum})`);
  }