import '../styles/index.scss';
import colorBlock from './colorBlock';
import setBlocks from './setBlocks';
import { checkMaxMin } from './utils';
import sizeAllBlocks from './sizeAllBlocks';

// Selectors
const main = document.querySelector('.main');
const inputTotalBlocks = document.getElementById('total-blocks');
const inputBlockSize = document.getElementById('block-size');
const inputPrimaryBlocks = document.getElementById('primary-blocks');
const generateColors = document.getElementById('generate-colors');
const generateSizes = document.getElementById('generate-sizes');
const generateAll = document.getElementById('generate-all');

// Variables
export let totalBlocks = 75;
export let primaryBlocks = 3;
export let blockSize = 3;
export let colors = [
    '#fff',
    '#eeefdf',
    '#1C1B1B',
    '#e43323',
    '#1a1d99',
    '#fcd46b'
];

// Initialize
setBlocks(totalBlocks, main)
    .then(generated => sizeAllBlocks(generated))
    .catch(e => console.log(e));

// Event listeners
window.addEventListener('DOMContentLoaded', (e) => {
    inputTotalBlocks.value = totalBlocks;
    inputBlockSize.value = blockSize;
    inputPrimaryBlocks.value = primaryBlocks;
});

// Event handler for changing total amount of blocks
const totalBlocksHandler = (e) => {
    const target = e.target;
    const max = target.max;
    let value = target.value;

    totalBlocks = checkMaxMin(value, max, null, target);
    setBlocks(totalBlocks, main)
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

// Event handler for changing primary block amount
const primaryBlockHandler = (e) => {
    const target = e.target;
    let value = target.value;

    value = checkMaxMin(value, totalBlocks, 1, target);

    primaryBlocks = value;
    sizeAllBlocks(main.querySelectorAll('li'));
};

inputPrimaryBlocks.addEventListener('change', primaryBlockHandler);
inputPrimaryBlocks.addEventListener('keyup', primaryBlockHandler);

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