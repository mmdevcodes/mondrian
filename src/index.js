import './styles/index.scss';
import colorBlock from './js/colorBlock';
import sizeAllBlocks from './js/sizeAllBlocks';
import Area from './js/area';
import setupColors from './js/setupColors';
import { checkMaxMin, newRandomColor } from './js/utils';
import filters from './js/addEffects';
import html2canvas from 'html2canvas';

// Selectors
export const main = document.querySelector('.main');
export const blocksSection = document.querySelector('.blocks-section');
export const blocksLayout = document.querySelector('.blocks-layout');
export const blocksGrid = document.querySelector('.blocks-grid');
export const gridSettings = document.getElementById('grid-settings');
export const inputTotalBlocks = document.getElementById('total-blocks');
export const inputBlockSize = document.getElementById('block-size');
export const inputPrimaryBlocks = document.getElementById('primary-blocks');
export const resolutionWidth = document.getElementById('resolution-width');
export const resolutionHeight = document.getElementById('resolution-height');
export const colorSettings = document.getElementById('settings-color');
export const generateColors = document.getElementById('generate-colors');
export const generateSizes = document.getElementById('generate-sizes');
export const generateAll = document.getElementById('generate-all');
export const addFilters = document.getElementById('add-filters');
export const filterSettingsForm = document.getElementById('filters-settings');
export const filterRows = document.getElementById('filters-row');
export const goBackBtn = document.getElementById('go-back');
export const downloadBtn = document.getElementById('download');

// Variables
export let totalBlocks = 150;
export let primaryBlocks = 5;
export let blockSize = 3;
export let colors = {
    color0: '#fff',
    color1: newRandomColor('white'),
    color2: newRandomColor('gray'),
    color3: newRandomColor()
};
export let resolution = [1920, 1080];

// Initialize
export const blocksArea = new Area(
    blocksSection,
    blocksLayout,
    blocksGrid,
    resolution,
    totalBlocks,
    colors,
    blockSize,
    primaryBlocks
);
setupColors(colorSettings);

// Event listeners
window.addEventListener('DOMContentLoaded', (e) => {
    inputTotalBlocks.value = blocksArea.totalBlocks;
    inputBlockSize.value = blocksArea.blockSize;
    inputPrimaryBlocks.value = blocksArea.primaryBlocks;
    resolutionWidth.value = blocksArea.resolution[0];
    resolutionHeight.value = blocksArea.resolution[1];
});

// Event handler for changing total amount of blocks
const totalBlocksHandler = (e) => {
    const target = e.target;
    const max = target.max;
    let value = target.value;

    blocksArea.totalBlocks = checkMaxMin(value, max, undefined, target);
    blocksArea.setBlocks();
};

inputTotalBlocks.addEventListener('change', totalBlocksHandler);
inputTotalBlocks.addEventListener('keyup', totalBlocksHandler);

// Event handler for changing max block size
const blockSizeHandler = (e) => {
    const target = e.target;
    const value = target.value;
    const max = target.max;
    const min = target.min;

    blocksArea.blockSize = checkMaxMin(value, max, min, target);
    sizeAllBlocks(blocksArea.blocks, blocksArea.blockSize, blocksArea.primaryBlocks, blocksArea.totalBlocks);
};

inputBlockSize.addEventListener('change', blockSizeHandler);
inputBlockSize.addEventListener('keyup', blockSizeHandler);

// Event handler for changing primary block amount
const primaryBlockHandler = (e) => {
    const target = e.target;
    let value = target.value;

    value = checkMaxMin(value, totalBlocks, 1, target);

    blocksArea.primaryBlocks = value;
    sizeAllBlocks(blocksArea.blocks, blocksArea.blockSize, blocksArea.primaryBlocks, blocksArea.totalBlocks);
};

inputPrimaryBlocks.addEventListener('change', primaryBlockHandler);
inputPrimaryBlocks.addEventListener('keyup', primaryBlockHandler);

// Event handler for changing resolution
const resolutionHandler = (e) => {
    const target = e.target;
    const id = target.id;
    let value = target.value;

    if (target === resolutionWidth) {
        blocksArea.resolution[0] = value;
    } else if (target === resolutionHeight) {
        blocksArea.resolution[1] = value;
    }

    blocksArea.areaListener();
};

resolutionWidth.addEventListener('change', resolutionHandler);
resolutionHeight.addEventListener('change', resolutionHandler);
resolutionWidth.addEventListener('keyup', resolutionHandler);
resolutionHeight.addEventListener('keyup', resolutionHandler);

// Button to randomly generate new colors
generateColors.addEventListener('click', e => {
    [...blocksArea.blocks].forEach(el => {
        colorBlock(el, colors);
    });
});

// Button to randomly generate new sizes
generateSizes.addEventListener('click', e => {
    sizeAllBlocks(blocksArea.blocks, blocksArea.blockSize, blocksArea.primaryBlocks, blocksArea.totalBlocks);
});

// Button to randomly regenerate everything
generateAll.addEventListener('click', (e) => {
    sizeAllBlocks(blocksArea.blocks, blocksArea.blockSize, blocksArea.primaryBlocks, blocksArea.totalBlocks);
    [...blocksArea.blocks].forEach(el => {
        colorBlock(el, colors);
    });
});

// Button to add filters
addFilters.addEventListener('click', e => {
    html2canvas(blocksLayout, {
        logging: false,
        width: resolution[0],
        height: resolution[1],
        onclone: html => {
            const layout = html.querySelector('.blocks-layout');

            // Removes the proportional scaling for outputted screenshot
            layout.style.transform = null;
        }
    })
    .then(canvas => {
        filters(canvas);
    })
    .catch(error => console.error(error));
});