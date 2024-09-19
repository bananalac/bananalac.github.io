import { splitText, removeEmpty, allKeys } from '../funcs/tools.js';
import { check0, check1, check2, check3, check4, check6, check7 } from '../funcs/checkers.js';

/**
 * @param {String} func 
 * @param {String} value 
 * @param {any} commandInfo 
 * @param {Object[]} args 
*/
export default function subcommand(func, value, commandInfo, args) {

  const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];


    const checkValues = splitText(value);
    if(typeof checkValues === 'string' && checkValues.trim() === '' && commandInfo.canBeEmpty === false) errors.push(`${func}{} doesn't work without options (Line ${lineNum})`)
    else if(typeof checkValues === 'string' && !commandInfo.single.includes(checkValues)) errors.push(`${func}{} does not accept single texts like '${checkValues}'. (Line ${lineNum})`)
    else if(Array.isArray(checkValues)) {
      //? Checking if command has wrong syntax like player{heal*}
      if(removeEmpty(checkValues).length < 2) errors.push(`You should provide an option after * (e.g. player{respawntimer*test}). (Line ${lineNum})`)
      else {
    
        const subCommandName = removeEmpty(checkValues)[0];
        if(!allKeys(commandInfo.subcommands).includes(subCommandName)) errors.push(`${func}{} does not have '${subCommandName}' option. (Line ${lineNum})`)
        else if((removeEmpty(checkValues).length > commandInfo.subcommands[subCommandName].maxOptions) && commandInfo.subcommands[subCommandName].type !== 7) warnings.push(`${func}{} with ${subCommandName} option should have just ${commandInfo.subcommands[subCommandName].maxOptions} options. got ${removeEmpty(checkValues).length} options. (Line ${lineNum})`)
        else {
          const subcommandInfo = commandInfo.subcommands[subCommandName];
         
          if(subcommandInfo.type === 0) check0(func, subCommandName, removeEmpty(checkValues)[1], subcommandInfo, args)
          else if(subcommandInfo.type === 1) check1(func, subCommandName, subcommandInfo, removeEmpty(checkValues)[1], args);
          else if(subcommandInfo.type === 2) check2(func, subCommandName, subcommandInfo, removeEmpty(checkValues)[1], args)
          else if(subcommandInfo.type === 3) check3(func, subCommandName, subcommandInfo, removeEmpty(checkValues)[1], args)
          else if(subcommandInfo.type === 4) check4(func, subCommandName, subcommandInfo, removeEmpty(checkValues)[1], args)
          else if(subcommandInfo.type === 6) check6(func, subCommandName, subcommandInfo, removeEmpty(checkValues)[1], args)
          else if(subcommandInfo.type === 7) check7(func, subCommandName, commandInfo, removeEmpty(checkValues.slice(1)), args) 
         
        }
    
      }
      
    }
}