import { isExactNumeric, isTextSeparatableAndValidLength, isBooleanString } from '../data-types.js';

/**
 * Check NUM_ANY items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {Object} commandInfo list for check
 * @param {String[]} vlList array of values
 * @param {Object[]} args
 */
export default function check7(func, sub = "", commandInfo, vlList, args) {

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    function replacer() {
        
    }


    let textEditor = "";
    let example = "";
    let customCommandInfo;
    if(sub === "") {
        textEditor = "";
        example = `=> ${func}{${vlList.join("*")}} (option OPT)`;
        customCommandInfo = commandInfo;
    } 
    else {
        textEditor = `with '${sub}' option`;
        example = `=> ${func}{${sub}*${vlList.join("*")}} (option OPT after ${sub})`;
        customCommandInfo = commandInfo.subcommands[sub];
    } 

    
    const { custom } = customCommandInfo;

    if(custom.length !== customCommandInfo.atLeast) warnings.push(`for ${func}{} ${textEditor} , it is enough to provide ${customCommandInfo.atLeast} options, other ${custom.length - customCommandInfo.atLeast} are optional.`);
   
    if(vlList.length > custom.length) errors.push(`${func} ${textEditor} must have max number of ${custom.length} options. (Line ${lineNum})`);
    else if(vlList.length < customCommandInfo.atLeast) errors.push(`${func} ${textEditor} must have at least ${customCommandInfo.atLeast} options. (Line ${lineNum})`)
    else {

        
        vlList.forEach((vl, vlIndex) => {

            const checkingItem = custom[vlIndex];
            //* NUMBER_ANY
            if(checkingItem.type === 0) {
                if(!isExactNumeric(vl)) errors.push(`${func}{} ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} should have numbers.you didn't provide a valid number. (Line ${lineNum})`);
            }
            //* NUMBER_RANGE
            if(checkingItem.type === 1) {
                
                if(!isExactNumeric(vl)) errors.push(`${func}{} ${textEditor} ${example} should have numbers.you didn't provide a valid number. (Line ${lineNum})`);
                const num = Number(vl);
                if(num > checkingItem.max) errors.push(`${func}{} ${textEditor} ${example} option should have a maximum number of ${checkingItem.max}. (Line ${lineNum})`);
                if(num < checkingItem.min) errors.push(`${func}{} ${textEditor} ${example} option should have a minimum number of ${checkingItem.min}. (Line ${lineNum})`);

            }
            //* NUMBER_SEPERATED
            if(checkingItem.type === 2) {
                if(!isTextSeparatableAndValidLength(vl, checkingItem.length)) errors.push(`${func}{} ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} should have three numbers seperated by , (e.g. 1,2,3). (Line ${lineNum})`);
                const xyz = vl.replace(/\,/gm, "").replace(/\./gm).replace(/\-/gm, "");
                if(!isExactNumeric(xyz)) errors.push(`${func}{} ${textEditor} ${example} option should have three seperated numbers.one or more of them aren't numbers. (Line ${lineNum})`);
            }
            //* NUM_CHANGABLE
            if(checkingItem.type === 3) {
                if(!(vl.startsWith("+") || vl.startsWith("-"))) errors.push(`${func}{} with ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} should have numbers like this +100 or -200 (you need to provide + or -). (Line ${lineNum})`);
                if(!isExactNumeric(vl.replace(/\+/gm, "").replace(/\-/gm, ""))) errors.push({type: "danger", text: `${func}{} with ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} should have numbers.you didn't provide a valid number. (Line ${lineNum})`})
            }            
            //* LIST
            if(checkingItem.type === 4) {
           
                if(checkingItem.list[0].includes("~")) {

                    const [first, last] = [ parseInt(list[0].split("~")[0]), parseInt(checkingItem.list[0].split("~")[1]) ];
                    const rangeArray = [];
                    for (let i = first; i <= last; i++) {
                       rangeArray.push(i.toString());
                    }
                    if(checkingItem.list.slice(1).length >= 1) rangeArray.push(...checkingItem.list.slice(1));
                    if(!rangeArray.includes(vl)) errors.push(`${func}{} ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} ONLY accepts range of ${first} to ${last} ${checkingItem.list.slice(1).length >= 1 ? "and " + checkingItem.list.slice(1).join(" , ") : ""}. (Line ${lineNum})`);        
                } else if(!checkingItem.list.includes(vl)) errors.push(`${func}{} ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} ONLY accepts this items: ${checkingItem.list.join(" , ")}. (Line ${lineNum})`);

            }
            //! string doesn't need to check
            //* BOOLEAN
            if(checkingItem.type === 6) {
                if(typeof isBooleanString(vl) === 'undefined') errors.push(`${func}{} ${textEditor} ${example.replace(/OPT/gm, vlIndex+1)} ONLY accepts true or false (case-sensitive). (Line ${lineNum})`);
            }
            //*INVENTORY
            if(checkingItem.type === 9) {
                if(vl.startsWith("+") || vl.startsWith("-")) {
                    if(!isExactNumeric(vl.replace(/\+/gm, "").replace(/\-/gm, ""))) errors.push(`inventory{} with 'add' or 'delete => inventory{add*item*+111} needs number after + or - . you can provide texts Only without plus or minus. (Line ${lineNum})`);
                    
                }
            }

            //* MESSAGE
            if(checkingItem.type === 11) {
                errors.push(checkingItem.msg);
            }

        })
    }

   
    
  }