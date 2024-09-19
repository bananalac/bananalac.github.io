/**
 * Check LIST items
 * @param {String} func function name (e.g. mode{})
 * @param {String} sub subcommand (e.g. player{nophone}) set it "" to disable
 * @param {String} vl value
 * @param {Object} commandInfo 
 * @param {Object[]} args
 */
export default function check4(func, sub = "", commandInfo, vl, args) {
   
    let textEditor = "";
    if(sub === "") textEditor = "";
    else textEditor = `with '${sub}' option`;

    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

  
    if(commandInfo.list[0].includes("~")) {

        const [first, last] = [ parseInt(commandInfo.list[0].split("~")[0]), parseInt(commandInfo.list[0].split("~")[1]) ];
        const rangeArray = [];
        for (let i = first; i <= last; i++) {
           rangeArray.push(i.toString());
        }
        if(commandInfo.list.slice(1).length >= 1) rangeArray.push(...commandInfo.list.slice(1));
        if(!rangeArray.includes(vl)) errors.push(`${func}{} ${textEditor} ONLY accepts range of ${first} to ${last} ${commandInfo.list.slice(1).length >= 1 ? "and " + commandInfo.list.slice(1).join(" , ") : ""} (Line ${lineNum})`);
    } else if(!commandInfo.list.includes(vl)) errors.push(`${func}{} ${textEditor} ONLY accepts this items: ${commandInfo.list.join(" , ")} (Line ${lineNum})`);
}