// The simple toolbox for Node.js

/**
 * Get POSIX Timestamp (second)
 * @module native
 * @function
 * @return {number}
 */
export function getPosixTimestamp() {
    return Math.floor(new Date().getTime() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safe.
 * @module native
 * @function
 * @param {object} srcObject
 * @param {string} propName
 * @return {boolean}
 */
export function isObjectPropExists(srcObject, propName) {
    return Object.prototype.hasOwnProperty.call(srcObject, propName);
}

/**
 * Converts a string from camelCase to snake_case.
 * @param {string} str The input string in camelCase format.
 * @return {string} The transformed string in snake_case format.
 */
export function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) =>
        `_${letter.toLowerCase()}`,
    );
}
