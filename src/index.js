import './styles/index.scss';
import colorBlock from './js/colorBlock';
import sizeAllBlocks from './js/sizeAllBlocks';
import Area from './js/area';
import setupColors from './js/setupColors';
import { checkMaxMin, newRandomColor, wrapHTML } from './js/utils';
import addEffects from './js/addEffects';
import rasterizeHTML from "rasterizehtml";
import computedStyleToInlineStyle from "computed-style-to-inline-style";

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
    const btnText = e.target.textContent;
    e.target.textContent = 'Loading';

    const body = document.querySelector('body');
    const canvas = document.createElement("canvas");
    const clone = blocksLayout.cloneNode(true);

    // Width/Height of canvas needs to be added for glfx to work
    canvas.width = blocksArea.resolution[0];
    canvas.height = blocksArea.resolution[1];

    // Remove proportional scaling for full size render
    clone.style.transform = null;
    clone.style.position = 'static';

    // Clone has to added to the DOM for Chrome to pick up generated styles
    body.append(clone);

    // Have to manually generate inline styles for Firefox to correctly render an image
    computedStyleToInlineStyle(clone, {
        recursive: true,
        properties: [
            'display',
            'width',
            'height',
            'overflow',
            'transform',
            'grid-template-columns',
            'grid-auto-flow',
            'grid-auto-rows',
            'grid-row-start',
            'grid-row-end',
            'grid-column-start',
            'grid-column-end',
            'row-gap',
            'column-gap',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'list-style-position',
            'list-style-image',
            'list-style-type',
            'box-sizing',
            'background-image',
            'background-color'
        ]
    });

    // Remove from DOM after inline styles have been generated
    clone.remove();

    // Draw the HTML onto a new canvas and pass it to glfx
    rasterizeHTML
        .drawHTML(wrapHTML(clone), canvas)
        .catch(error => console.error(error))
        .finally(() => {
            addEffects(canvas);
            e.target.textContent = btnText;
        });
});