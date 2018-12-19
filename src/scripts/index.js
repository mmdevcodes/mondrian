import { getRandomInt, getColumnSpan, getRowSpan, checkMaxMin, colors } from './utils';
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
    let curPriBlocks = 0;
    let primaryBlockSet = [];

    // Assign random blocks as a `primary`
    for (let i = 0; i < primaryBlocks; i++) {
        let assignedPrimary = getRandomInt(0, totalBlocks - 1);

        // Do not allow duplicates
        while (primaryBlockSet.includes(assignedPrimary)) {
            assignedPrimary = getRandomInt(0, totalBlocks - 1);
        }

        // Keeping track of which blocks are `primary`
        primaryBlockSet = [...primaryBlockSet, assignedPrimary];
    }

    blocks.forEach((block, index) => {
        /**
         * If this block's index is in the primary block array
         *  then use the maximum size and exit the function.
         */
        if (primaryBlockSet.includes(index)) {
            sizeBlock(block, blockSize, blockSize);

            return;
        }

        let colSpan = getColumnSpan(blockSize);
        let rowSpan = getRowSpan(blockSize);

        // Do not allow other primary-sized blocks to be added
        while (colSpan + rowSpan === blockSize * 2) {
            if (blockSize === 1) break;

            colSpan = getColumnSpan(blockSize);
            rowSpan = getRowSpan(blockSize);
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

// Event handler for changing total amount of blocks
const totalBlocksHandler = (e) => {
    const target = e.target;
    const max = target.max;
    let value = target.value;

    value = checkMaxMin(value, max, null, target);

    setBlocks(value, main)
        .then(generated => sizeAllBlocks(generated))
        .catch(e => console.log(e));
};

inputTotalBlocks.addEventListener('change', totalBlocksHandler);
inputTotalBlocks.addEventListener('keyup', totalBlocksHandler);

// Event handler for changing max block size
const blockSizeHandler = (e) => {
    const target = e.target;
    const value = target.value;
    const max = target.max;
    const min = target.min;

    blockSize = checkMaxMin(value, max, min, target);
    sizeAllBlocks(main.querySelectorAll('li'));
};

inputBlockSize.addEventListener('change', blockSizeHandler);
inputBlockSize.addEventListener('keyup', blockSizeHandler);

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