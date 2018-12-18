/**
 * Generate an Integer
 * @param {Integer} min
 * @param {Integer} max
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);;
}

/**
 * Generate grid column span
 * @param {Integer} blockSize
 */
export function getColumnSpan(blockSize) {
    return getRandomInt(1, blockSize);
}

/**
* Generate grid row span
* @param {Integer} blockSize
*/
export function getRowSpan(blockSize) {
    return getRandomInt(1, blockSize);
}

/**
 * Checks value and set to min/max amount if out of range
 * @param {Integer} value Value to check
 * @param {Integer} max Maximum number value can be
 * @param {Integer} min Minimum number value can be
 */
export function checkMaxMin(value, max = 9999, min = 1, input) {
    value = parseInt(value);
    max = parseInt(max);
    min = parseInt(min);

    // If supplied value is greater than max
    if (value > max) {
        value = max;

    // If supplied value is less than max
    } else if (value < min) {
        value = min;
    }

    // If input is supplied change the  value
    if (input !== undefined) {
        input.value = value || min; // Do not allow blank values
    }

    return value;
}

export const colors = [
    '#fff',
    '#eeefdf',
    '#1C1B1B',
    '#e43323',
    '#1a1d99',
    '#fcd46b'
];