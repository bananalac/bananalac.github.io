import { isBooleanString, isExactNumeric } from "../funcs/data-types.js";
import { includesArr, removeEmpty, splitTextCustom, allKeys } from "../funcs/tools.js";
import { CONDITIONS as C } from '../syntax/conditional_sheet.js';

export default function conditional(value, args) {

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];


    if(value === '') errors.push(`ifcondition{} cannot be empty. (Line ${lineNum})`);

    const splitByMulti = splitTextCustom(value, "&&");

    const operators = [">", "<", "=", "!="];
 
    if(typeof splitByMulti === 'string') {
       
       operators.forEach((op) => {

        const seperate = splitTextCustom(value, op);
        if(Array.isArray(seperate)) {
          if(seperate.length > 2) errors.push(`Really? (Line ${lineNum})`)
          else if(includesArr(seperate[0], operators) || includesArr(seperate[1], operators)) errors.push(`You should use operators once for every condition. (Line ${lineNum})`)
          else {
        
            const condition = seperate[0].trim().toLowerCase();
            const condValue = seperate[1].trim().toLowerCase();

            if(!allKeys(C).includes(condition)) errors.push(`There is no condition named '${condition}' (Line ${lineNum})`)
            else {

                const conditionInfo = C[condition];

                if(!conditionInfo.accepted.includes(op)) errors.push(`ifcondition{} with '${condition}' condition, does not accept ${op} as an operator. (Line ${lineNum})`)
                else {
            
                    if(conditionInfo.type === 0) {
                        if(!isExactNumeric(condValue)) errors.push(`ifcondition{} with '${condition}' condition, does not accept anything expect numbers. (Line ${lineNum})`)
                    }
                    if(conditionInfo.type === 1) {
                        if(!conditionInfo.list.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, ONLY accepts these items: ${conditionInfo.join(" , ")}. (Line ${lineNum})`)
                    }
                    if(conditionInfo.type === 2) {
                        let checkArray = [];
                        for (let i = conditionInfo.min; i <= conditionInfo.max; i++) {
                            checkArray.push(i.toString());
                        };
                        if(conditionInfo.add) {
                            checkArray.push(...conditionInfo.add)
                            if(!checkArray.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, only accepts range of numbers from ${conditionInfo.min} to ${conditionInfo.max} and also these items: ${conditionInfo.add.join(" , ")}. (Line ${lineNum})`)
                        } else {
                            if(!checkArray.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, only accepts range of numbers from ${conditionInfo.min} to ${conditionInfo.max}. (Line ${lineNum})`)
                        }
                    }
                    if(conditionInfo.type === 3) {
                        if(typeof isBooleanString(condValue) === 'undefined')  errors.push(`ifcondition{} with '${condition}' condition, only accepts true or false. (Line ${lineNum})`)
                    }

                }

            }


           
          }
        return true;
       }
          
       });

          
    }

    if(Array.isArray(splitByMulti)) {

        splitByMulti.forEach((multi, multiInd) => {

            operators.forEach((op) => {

                const seperate = splitTextCustom(multi, op);
                if(Array.isArray(seperate)) {
                  if(seperate.length > 2) errors.push(`Really? (Line ${lineNum})`)
                  else if(includesArr(seperate[0], operators) || includesArr(seperate[1], operators)) errors.push(`You should use operators once for every condition. (Line ${lineNum}, condition ${multiInd+1})`)
                  else {
                
                    const condition = seperate[0].trim().toLowerCase();
                    const condValue = seperate[1].trim().toLowerCase();
        
                    if(!allKeys(C).includes(condition)) errors.push(`There is no condition named '${condition}' (Line ${lineNum}, condition ${multiInd+1})`)
                    else {
        
                        const conditionInfo = C[condition];
        
                        if(!conditionInfo.accepted.includes(op)) errors.push(`ifcondition{} with '${condition}' condition, does not accept ${op} as an operator. (Line ${lineNum}, condition ${multiInd+1})`)
                        else {
                    
                            if(conditionInfo.type === 0) {
                                if(!isExactNumeric(condValue)) errors.push(`ifcondition{} with '${condition}' condition, does not accept anything expect numbers. (Line ${lineNum}, condition ${multiInd+1})`)
                            }
                            if(conditionInfo.type === 1) {
                                if(!conditionInfo.list.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, only accepts these items: ${conditionInfo.join(" , ")} (Line ${lineNum}, condition ${multiInd+1})`)
                            }
                            if(conditionInfo.type === 2) {
                                let checkArray = [];
                                for (let i = conditionInfo.min; i < conditionInfo.max; i++) {
                                    checkArray.push(i.toString());
                                };
                                if(conditionInfo.add) {
                                    checkArray.push(...conditionInfo.add)
                                    if(!checkArray.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, only accepts range of numbers from ${conditionInfo.min} to ${conditionInfo.max} and also these items: ${conditionInfo.add.join(" , ")} (Line ${lineNum}, condition ${multiInd+1})`)
                                } else {
                                    if(!checkArray.includes(condValue)) errors.push(`ifcondition{} with '${condition}' condition, only accepts range of numbers from ${conditionInfo.min} to ${conditionInfo.max} (condition ${multiInd+1})`)
                                }
                            }
                            if(conditionInfo.type === 3) {
                                if(typeof isBooleanString(condValue) === 'undefined')  errors.push(`ifcondition{} with '${condition}' condition, only accepts true or false (Line ${lineNum}, condition ${multiInd+1})`)
                            }
        
                        }
        
                    }
        
        
                   
                  }
                return true;
               }
                  
               });

        })

    }

}
