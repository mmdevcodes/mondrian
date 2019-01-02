import './styles/index.scss';
import colorBlock from './js/colorBlock';
import sizeAllBlocks from './js/sizeAllBlocks';
import Area from './js/area';
import setupColors from './js/setupColors';
import { checkMaxMin, newRandomColor } from './js/utils';
import addEffects from './js/addEffects';
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
export const inputResWidth = document.getElementById('resolution-width');
export const inputResHeight = document.getElementById('resolution-height');
export const inputBlocksX = document.getElementById('blocks-x');
export const inputBlocksY = document.getElementById('blocks-y');
export const inputBlocksRotate = document.getElementById('blocks-rotate');
export const inputBlocksScale = document.getElementById('blocks-scale');
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
    inputResWidth.value = blocksArea.resolution[0];
    inputResHeight.value = blocksArea.resolution[1];
    inputBlocksX.value = blocksArea.x;
    inputBlocksY.value = blocksArea.y;
    inputBlocksRotate.value = blocksArea.rotate;
    inputBlocksScale.value = blocksArea.innerScale;
});

// Event handler for changing total amount of blocks
const totalBlocksHandler = e => {
    const target = e.target;
    const max = target.max;
    let value = target.value;

    blocksArea.totalBlocks = checkMaxMin(value, max, undefined, target);
    blocksArea.setBlocks();
};

inputTotalBlocks.addEventListener('change', totalBlocksHandler);
inputTotalBlocks.addEventListener('keyup', totalBlocksHandler);

// Event handler for changing max block size
const blockSizeHandler = e => {
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
const primaryBlockHandler = e => {
    const target = e.target;
    let value = target.value;

    value = checkMaxMin(value, totalBlocks, 1, target);

    blocksArea.primaryBlocks = value;
    sizeAllBlocks(blocksArea.blocks, blocksArea.blockSize, blocksArea.primaryBlocks, blocksArea.totalBlocks);
};

inputPrimaryBlocks.addEventListener('change', primaryBlockHandler);
inputPrimaryBlocks.addEventListener('keyup', primaryBlockHandler);

// Event handler for changing resolution
const resolutionHandler = e => {
    const target = e.target;
    const id = target.id;
    let value = target.value;

    if (target === inputResWidth) {
        blocksArea.resolution[0] = value;
    } else if (target === inputResHeight) {
        blocksArea.resolution[1] = value;
    }

    blocksArea.areaListener();
};

inputResWidth.addEventListener('change', resolutionHandler);
inputResHeight.addEventListener('change', resolutionHandler);
inputResWidth.addEventListener('keyup', resolutionHandler);
inputResHeight.addEventListener('keyup', resolutionHandler);

// Event handler for changing max block size
const blocksTransformHandler = e => {
    const target = e.target;
    const value = target.value;

    if (target === inputBlocksX) {
        blocksArea.x = value;
    } else if (target === inputBlocksY) {
        blocksArea.y = value;
    } else if (target === inputBlocksRotate) {
        blocksArea.rotate = value;
    } else if (target === inputBlocksScale) {
        blocksArea.innerScale = value;
    }

    blocksArea.transformBlocks();
};

inputBlocksX.addEventListener('change', blocksTransformHandler);
inputBlocksY.addEventListener('change', blocksTransformHandler);
inputBlocksRotate.addEventListener('change', blocksTransformHandler);
inputBlocksScale.addEventListener('change', blocksTransformHandler);
inputBlocksX.addEventListener('keyup', blocksTransformHandler);
inputBlocksY.addEventListener('keyup', blocksTransformHandler);
inputBlocksRotate.addEventListener('keyup', blocksTransformHandler);
inputBlocksScale.addEventListener('keyup', blocksTransformHandler);

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
        backgroundColor: '#000',
        onclone: html => {
            const layout = html.querySelector('.blocks-layout');

            // Removes the proportional scaling for outputted screenshot
            layout.style.transform = null;
        }
    })
    .then(canvas => {
        addEffects(canvas);
    })
    .catch(error => console.error(error));
});