
/**
 * 
 * @param {String} text 
 * @param {String} spliter 
 * @returns 
 */
function splitTextCustom(text, spliter) { return text.includes(spliter) ? text.split(spliter) : text; }





/**
 * Parse save-data.txt
 * @param {String} savedata 
 * @returns {Object}
 */
function parse(savedata) {
    let result = { error: "", members: [] };

    if(typeof savedata !== 'string') throw new Error(`SaveData should be a string, not a txt file or something else`)
    const splitedUsers = splitTextCustom(savedata.trim(), "}");

    if(typeof splitedUsers === 'string') {
        result.error = "This is not a savedata file."
    } else if(Array.isArray(splitedUsers)) {

        if(splitedUsers.length === 0) return result;

        splitedUsers.pop();
        
        splitedUsers.forEach((user, index, arr) => {
            let finalText = "";
            finalText = user + "}";
      
            let usersArray = finalText
              .substring(finalText.indexOf("{") + 1, finalText.lastIndexOf("}"))
              .trim()
              .split(/\r?\n/gm);


             
      
              result.members.push({
                status: usersArray[0],
                username: usersArray[1],
                password: usersArray[2],
                role: usersArray[3],
                inventory: inventoryParse(usersArray[4]),
                inventoryString: usersArray[4],
                location: usersArray[5],
                rotation: usersArray[6],
              });
          });



    }


    return result;


};

/**
 * Write new save-data.txt based on new results objest
 * @param {Object[]} members 
 */
function write(members) {
    
    let finalText = "";
    members.forEach((member) => {

       
        
        finalText +=
`user{
${member.status}
${member.username}
${member.password}
${member.role}
${inventoryWrite(member.inventory)}
${member.location}
${member.rotation}
}
`

    });

    return finalText

};

/**
 * 
 * @param {String} inv 
 */
function inventoryParse(inv) {

    let tempInventory = {};

    let invArray = inv.split(/\)/g);
    invArray.pop();
    invArray.forEach((invi) => {
      const spliter = invi.split(/\(/g);
      const jsonFormed = JSON.parse(`{ "${spliter[0]}": "${spliter[1]}" }`);
      Object.assign(tempInventory, jsonFormed);
    });

    return tempInventory;

};

/**
 * @param {Object} invobj 
 */
function inventoryWrite(invobj) {

    let memberInventory = "";
    for (const [k, v] of Object.entries(invobj)) {
       memberInventory += `${k}(${v})`;
    }
    return memberInventory;
}



export { parse, write, inventoryParse, inventoryWrite };