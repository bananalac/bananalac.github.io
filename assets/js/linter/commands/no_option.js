export default function noOption(func, value, args) {
    const [reportBody, errors, warnings, suggestions, lineNum] = [args[0], args[1], args[2], args[3], args[4]];

    if(value.trim() !== '') errors.push(`${func}{} should not have any options. (Line ${lineNum})`)
}