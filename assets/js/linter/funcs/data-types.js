

/**
 * Checks string if it is completely number or not.
 * @param {String} str 
 * @returns {Boolean}
 */
export function isExactNumeric(str) { return /^\d+(\.\d+)?$/.test(str); }
/**
 * for checking values like x,y,z with desired length
 * @param {String} text 
 * @param {Number} desiredLength 
 * @returns {Boolean} 
 */
export function isTextSeparatableAndValidLength(text, desiredLength) { const separatedText = text.split(','); return separatedText.length === desiredLength; }
/**
 * for checking if string is exactly 'true' or 'false'
 * @param {String} str 
 * @returns {Boolean | undefined}
 */
export function isBooleanString(str) {
    if (str === "true" || str === "false") {
        return str === "true";
    }
    return undefined;
}