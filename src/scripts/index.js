import { getColumnSpan, getRowSpan, checkMaxMin, colors } from './utils';
import setBlocks from './setBlocks';
import sizeBlock from './sizeBlock';
import colorBlock from './colorBlock';
import '../styles/index.scss';

// Selectors
const main = document.querySelector('.main');
const inputTotalBlocks = document.getElementById('total-blocks');
const inputBlockSize = document.getElementById('block-size');
// const inputPrimaryBlocks = document.getElementById('primary-blocks');
const generateColors = document.getElementById('generate-colors');
const generateSizes = document.getElementById('generate-sizes');
const generateAll = document.getElementById('generate-all');


// Variables
let totalBlocks = 75;
let primaryBlocks = 3;
let blockSize = 3;

// Functions
const sizeAllBlocks = (blocks) => {
    let currentPrimaryBlocks = 0;

    blocks.forEach(block => {
        let colSpan = getColumnSpan(blockSize);
        let rowSpan = getRowSpan(blockSize);

        /**
         * If the randomly generated block size is a `primary` block but
         * we've already exceeded the max amount it will keep generating
         * a new size until it's no longer a `primary` block.
         */
        if (colSpan + rowSpan === blockSize * 2 && currentPrimaryBlocks < primaryBlocks) {
            currentPrimaryBlocks++;
            return;
        } else {
            if (blockSize === 1) return;

            while (colSpan + rowSpan === blockSize * 2) {
                colSpan = getColumnSpan(blockSize);
                rowSpan = getRowSpan(blockSize);
            }
        }

        sizeBlock(block, colSpan, rowSpan);
    });
};

// Initialize
setBlocks(totalBlocks, main)
    .then(generated => sizeAllBlocks(generated))
    .catch(e => console.log(e));

// Event listeners
window.addEventListener('DOMContentLoaded', (e) => {
    inputTotalBlocks.value = totalBlocks;
    inputBlockSize.value = blockSize;
    // inputPrimaryBlocks.value = primaryBlocks;
});

// Input for changing total amount of blocks
inputTotalBlocks.addEventListener('keyup', e => {
    const target = e.target;
    const max = target.max;
    let value = target.value;

    value = checkMaxMin(value, max, null, target);

    setBlocks(value, main)
        .then(generated => sizeAllBlocks(generated))
        .catch(e => console.log(e));
});

// Input for changing max block size
inputBlockSize.addEventListener('keyup', e => {
    const target = e.target;
    const value = target.value;
    const max = target.max;
    const min = target.min;

    blockSize = checkMaxMin(value, max, min, target);
    sizeAllBlocks(main.querySelectorAll('li'));
});

// Input for changing primary block amount
// inputPrimaryBlocks.addEventListener('keyup', e => {
//     const value = parseInt(e.target.value);

//     primaryBlocks = value;
//     sizeAllBlocks(main.querySelectorAll('li'));
// });

// Button to randomly generate new colors
generateColors.addEventListener('click', e => {
    main.querySelectorAll('li').forEach(el => {
        colorBlock(el, colors);
    });
});

// Button to randomly generate new sizes
generateSizes.addEventListener('click', e => {
    sizeAllBlocks(main.querySelectorAll('li'));
});

// Randomly regenerate everything
generateAll.addEventListener('click', (e) => {
    sizeAllBlocks(main.querySelectorAll('li'));
    main.querySelectorAll('li').forEach(el => {
        colorBlock(el, colors);
    });
});