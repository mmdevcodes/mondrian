import { colors } from './utils';
import colorBlock from './colorBlock';

/**
 * Set blocks inside of an element
 * @param {Integer} desiredAmount Total amount of blocks wanted
 * @param {HTMLElement} el Main element to append blocks to
 */
export default async function setBlocks(desiredAmount, el) {
    let currentBlocks = el.querySelectorAll('li').length;
    let generatedBlocks = [];

    /**
     * Creates blocks if requested amount is more than is
     * currently rendered on the page.
     */
    while (currentBlocks < desiredAmount) {
        const block = document.createElement('li');

        // Color each block
        colorBlock(block, colors);
        // Add block to DOM
        el.appendChild(block);
        // Add block to generated block array to return later
        generatedBlocks = [...generatedBlocks, block];
        // Update total amount of blocks on the page
        currentBlocks = el.querySelectorAll('li').length;
    }

    /**
     * Removes blocks if requested amount is less than is
     * currently rendered on the page.
     */
    while (currentBlocks > desiredAmount) {
        const block = el.querySelector('li:last-child');

        block.remove();
        currentBlocks = el.querySelectorAll('li').length;
    }

    return generatedBlocks;
};