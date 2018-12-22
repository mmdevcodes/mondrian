import { getRandomInt, getRandomColor } from './utils';

/**
 * Adds background color to a block
 * @param {HTMLElement} el Element
 * @param {Object} colors Colors
 */
export default function colorBlocks(el, colors) {
    const color = getRandomColor(colors);

    el.style.backgroundColor = `var(--${color})`;
};