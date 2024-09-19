import { splitText, removeEmpty, allKeys } from '../funcs/tools.js';

/**
 * @param {String} func
 * @param {String} value 
 * @param {any} commandInfo 
 * @param {Object[]} args 
 */
export default function commandFree(func, value, commandInfo, args) {
    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    if(value.trim() === '' && commandInfo.canBeEmpty === false) errors.push(`${func}{} doesn't work without options. (Line ${lineNum})`)
    else if(Array.isArray(splitText(value))) errors.push(`${func}{} does not need additional options. (Line ${lineNum})`)
        
}