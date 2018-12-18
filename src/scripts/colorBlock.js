import { getRandomInt } from './utils';
/**
 * Adds background color to a block
 * @param {HTMLElement} el Element
 * @param {string[]} colors Colors
 */
export default function colorBlocks(el, colors) {
    const setColor = getRandomInt(0, colors.length - 1);

    el.style.backgroundColor = `${[colors[setColor]]}`;
};
