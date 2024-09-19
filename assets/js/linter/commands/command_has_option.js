import { splitText, removeEmpty, allKeys } from '../funcs/tools.js';
import { check0, check1, check2, check3, check4, check6 } from '../funcs/checkers.js';

/**
 * @param {String} func
 * @param {String} value 
 * @param {any} commandInfo 
 * @param {Object[]} args 
 */
export default function commandHasOption(func, value, commandInfo, args) {
    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    if(value.trim() === '' && commandInfo.canBeEmpty === false) errors.push(`${func}{} doesn't work without options. (Line ${lineNum})`);
        else if(Array.isArray(splitText(value))) errors.push(`${func}{} does not need additional options. (Line ${lineNum})`)
        else  {
                        
            if(commandInfo.type === 0) check0(func, "", value.trim(), commandInfo, args)
            else if(commandInfo.type === 1) check1(func, "", commandInfo, value.trim(), args);
            else if(commandInfo.type === 2) check2(func, "", commandInfo, value.trim(), args)
            else if(commandInfo.type === 3) check3(func, "", commandInfo, value.trim(), args)
            else if(commandInfo.type === 4) check4(func, "", commandInfo, value.trim(), args)
            else if(commandInfo.type === 6) check6(func, "", commandInfo, value.trim(), args)
                    
        }
}