import { splitText, removeEmpty, allKeys } from '../funcs/tools.js';
import { check7 as checkParameters } from '../funcs/checkers.js';

/**
 * @param {String} func 
 * @param {String} value 
 * @param {any} commandInfo 
 * @param {Object[]} args 
*/
export default function commandMultiOption(func, value, commandInfo, args) {

  const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];


    const checkValues = splitText(value);
    if(typeof checkValues === 'string' && checkValues.trim() === '' && commandInfo.canBeEmpty === false) errors.push(`${func}{} doesn't work without options. (Line ${lineNum})`)
    else if(typeof checkValues === 'string') errors.push(`${func}{} does not accept single text like '${checkValues}' . (Line ${lineNum})`)
    else if(Array.isArray(checkValues)) {
      //? Checking if command has wrong syntax like player{heal*}
      if(removeEmpty(checkValues).length < 2) errors.push(`You should provide an option after * (e.g. player{respawntimer*test}) (Line ${lineNum})`)
      else {  

        if(commandInfo.type === 7) checkParameters(func, "", commandInfo, removeEmpty(checkValues), args);
             
      }
      
    }
}