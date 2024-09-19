import { isBooleanString } from "../data-types.js";

/**
 * Check BOOL items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {String} vl value
 * @param {Object} commandInfo
 * @param {Object[]} args
 */
export default function check6(func, sub = "", commandInfo, vl, args) {

    let textEditor = "";
    if(sub === "") textEditor = "";
    else textEditor = `with '${sub}' option`;

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

  
    if(typeof isBooleanString(vl) === 'undefined') errors.push(`${func}{} ${textEditor} ONLY accepts true or false (case-sensitive) (Line ${lineNum})`);
}