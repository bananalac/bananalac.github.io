/**
 * @param {String} text 
 * @param {Object[]} args 
 * @returns {Object[]}
 */
export default function spliter(text, args) {

    const [reportBody, errors, warnings, suggestions] = [args[0], args[1], args[2], args[3]];

    let executedMode = false;
    function checkMode(line, ind) {
       if(!executedMode) {
        executedMode = true;
        if(line.includes('mode') && ind === 0) { 
            reportBody.modeAtfirst = true; reportBody.hasMode = true; 
        }
        else if(line.includes('mode') && ind !== 0) { 
            reportBody.hasMode = true 
            suggestions.push(`It is better to put mode{} at first line. (Line ${ind+1})`);
            
        }
        else { 
            reportBody.hasMode = false; 
            errors.push(`Triggerbox must have mode{} in it.`);
        }
       }
    }

    const finalLines = [];

    const lines = text.trim().replace(/}(?=[^\n])/g, '}\n').split(/\r?\n/gm);
   
    reportBody.cleanedText = lines.join("\n");
    reportBody.linesLength = lines.length;

    lines.forEach((line, lineIndex) => {
        if(!line.includes("{") || !line.includes("}")) {
          errors.push(`Line ${lineIndex+1} does not have { or } or both of them.`);
        } else {

            //? checks if triggerbox includes mode and if it is in first line.
            checkMode(line, lineIndex);
        
       
        const [ type, parameter ] = [ line.split("{")[0], line.split("{")[1].replace(/\}/gm, "") ];
        finalLines.push({ [`${type.trim().toLowerCase()}`]: parameter.trim().toLowerCase() });
        
        }
        
    });

    

    reportBody.lines = finalLines;
    return finalLines;

}