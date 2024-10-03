import { AVAILABLE_OPTIONS as AO } from './syntax/syntax_sheet.js';
import spliter from './funcs/spliter.js';
import { subcommand, commandHasOption, noOption, commandFree, commandMultiOption, conditional } from './commands/minor.js';
import { allKeys } from './funcs/tools.js';


export function typeChecker(text) {

  let reportBody = {
    linesLength: 0,
    cleanedText: "",
    hasMode: undefined,
    modeAtfirst: undefined,
    conditional: undefined,
    lines: []
  };

  const errors = [];
  const warnings = [];
  const suggestions = [];
  

  let args = [reportBody, errors, warnings, suggestions];


  const checkingLines = spliter(text, args);


  checkingLines.forEach((command, commandIndex) => {
    let funcName = Object.keys(command)[0];
    let value = Object.values(command)[0];
    const lineNum = commandIndex + 1;
    args.push(lineNum);

       if(funcName === 'ifcondition') conditional(value, args);
       //? Checking if command is valid or not.
       else if(!allKeys(AO).includes(funcName)) errors.push(`\'${funcName}\' is not a valid command (Line ${lineNum})`)
       else {

        
        
        const commandInfo = AO[funcName];

        switch (commandInfo.commandType) {
          case 0: //* SUBCOMMAND
            subcommand(funcName, value, commandInfo, args);
            break;
          case 1: //* COMMAND_HAS_OPTION
            commandHasOption(funcName, value, commandInfo, args);
            break;
          case 2: //* COMMAND_MULTI_OPTION
            commandMultiOption(funcName, value, commandInfo, args);
            break;
          case 3: //* COMMAND_FREE
            commandFree(funcName, value, commandInfo, args);
            break;
          case 4: //*No_OPTION
            noOption(funcName, value, args);               
            break;
          case 5:
            errors.push(commandInfo.msg + ` (Line ${lineNum})`);
            break;
          default:
            break;
        }

        
        
      }
            
        }
        
        

    )
      
    return { reportBody, errors, suggestions, warnings };
      
}


function emote(url) {
  return `<img src=\"${url}\" alt=\"emote\" style=\"width:30px; height:30px;\"></h2>`
}

export function convertToHtml(text) {
  const objs = typeChecker(text);
  let fnl = "";
  let warns = "";
  if(objs.errors.length === 0) {
    fnl = `<h2 style=\"color:lightgreen\">All Good! your code has no problems! ${emote("assets/img/moha.png")}</h2>`
  } else fnl += `<h3 style=\"color:red\">Wrong Syntax ${emote("assets/img/flush.png")}</h3><br>`;
  objs.errors.forEach((obj, IND) => {

    fnl += `${IND+1}. ${obj.replace(/Line\s+(\d+)/gm, (match, p1) => { return `Line <a href=\"javascript:void(0)\">${p1}</a>`; })}<br>`
  });
  if(objs.warnings.length === 0) {
    warns = `<h2 style=\"color:lightgreen\">No warnings ${emote("assets/img/doubt.png")}</h2>`
  } else warns += `<h3 style=\"color:#FFDB58\">Warnings ${emote("assets/img/warns.png")}</h3><br>`;
  objs.warnings.forEach((obj, IND) => {

    warns += `${IND+1}. ${obj}<br>`
  });
  return { fnl, warns };
}

export function convertToShare(text) {
  const objs = typeChecker(text);
  let fnl = "";
  let warns = "";
  if(objs.errors.length === 0) {
    fnl = `All Good! your code has no problems! 👍\n`
  } else fnl += `Wrong Syntax ❌\n`;
  objs.errors.forEach((obj, IND) => {

    fnl += `${IND+1}. ${obj}\n`
  });
  if(objs.warnings.length === 0) {
    warns = `No warnings 👍`
  } else warns += `Warnings :\n`;
  objs.warnings.forEach((obj, IND) => {

    warns += `${IND+1}. ${obj}\n`
  });
  return { fnl, warns };
}

export function colorize(text) {
  return text.replace(/({|}|&&|:|>|<|=|!=|campos|playerpos|\*)/g, '<span style="color:red;">$1</span>').replace(/<span style=\"color:red;\">}<\/span>/gm, "<span style=\"color:red;\">}</span><br>");
}

  
   
    


   





