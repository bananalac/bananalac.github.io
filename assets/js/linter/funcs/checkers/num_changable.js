import { isExactNumeric } from '../data-types.js'

/**
 * Check NUM_CHANGABLE items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {String} vl value
 * @param {Object} commandInfo
 * @param {Object[]} args
 */
export default function check3(func, sub = "", commandInfo, vl, args) {
    let textEditor = "";
    if(sub === "") textEditor = "";
    else textEditor = `with '${sub}' option`;

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

  
    if(!(vl.startsWith("+") || vl.startsWith("-"))) errors.push(`${func}{} with ${textEditor} should have numbers like this +100 or -200 (you need to provide + or -) (Line ${lineNum})`)
    else if(!isExactNumeric(vl.replace(/\+/gm, "").replace(/\-/gm, ""))) errors.push(`${func}{} with ${textEditor} should have numbers.you didn't provide a valid number (Line ${lineNum})`);
}