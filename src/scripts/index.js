import '../styles/index.scss';
import colorBlock from './colorBlock';
import setBlocks from './setBlocks';
import sizeAllBlocks from './sizeAllBlocks';
import setupColors from './setupColors';
import { checkMaxMin } from './utils';

// Selectors
const main = document.querySelector('.main');
const inputTotalBlocks = document.getElementById('total-blocks');
const inputBlockSize = document.getElementById('block-size');
const inputPrimaryBlocks = document.getElementById('primary-blocks');
const colorSettings = document.getElementById('settings-color');
const generateColors = document.getElementById('generate-colors');
const generateSizes = document.getElementById('generate-sizes');
const generateAll = document.getElementById('generate-all');

// Variables
export let totalBlocks = 80;
export let primaryBlocks = 5;
export let blockSize = 3;
export let colors = {
    color0: '#eeefdf',
    color1: '#1C1B1B',
    color2: '#e43323',
    color3: '#1a1d99',
    color4: '#fcd46b'
};

// Initialize
setupColors(colorSettings);
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