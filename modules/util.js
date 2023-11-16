/**
 * General purpose miscellaneous utilities for the project
 * @module misc
 */

/**
 * Determines logging level based on the first digit of http codes
 * @param {string} firstDigit first digit of the http code
 */
export const httpCodeSeverity = function(firstDigit) {
    if (firstDigit == "5") return "error";
    if (firstDigit == "4") return "debug";
    return "trace";
};
