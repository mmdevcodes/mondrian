import './styles/index.scss';
import colorBlock from './js/colorBlock';
import setBlocks from './js/setBlocks';
import sizeAllBlocks from './js/sizeAllBlocks';
import setupArea from './js/setupArea';
import setupColors from './js/setupColors';
import { checkMaxMin } from './js/utils';
import html2canvas from 'html2canvas';
import simpleLightbox from 'simple-lightbox';

// Selectors
export const main = document.querySelector('.main');
export const blocksSection = document.querySelector('.blocks-section');
export const blocksLayout = document.querySelector('.blocks-layout');
export const blocksGrid = document.querySelector('.blocks-grid');
export const inputTotalBlocks = document.getElementById('total-blocks');
export const inputBlockSize = document.getElementById('block-size');
export const inputPrimaryBlocks = document.getElementById('primary-blocks');
export const colorSettings = document.getElementById('settings-color');
export const generateColors = document.getElementById('generate-colors');
export const generateSizes = document.getElementById('generate-sizes');
export const generateAll = document.getElementById('generate-all');
export const screenshotBtn = document.getElementById('screenshot');

// Variables
export let totalBlocks = 80;
export let primaryBlocks = 5;
export let blockSize = 3;
export let colors = {
    color0: '#fff',
    color1: '#1C1B1B',
    color2: '#e43323',
};
export let resolution = [1920, 1080];

// Initialize
setupArea(blocksSection, blocksLayout);
setupColors(colorSettings);
setBlocks(totalBlocks, blocksGrid)
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

    totalBlocks = checkMaxMin(value, max, undefined, target);
    setBlocks(totalBlocks, blocksGrid)
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
    sizeAllBlocks(blocksGrid.querySelectorAll('li'));
};

inputBlockSize.addEventListener('change', blockSizeHandler);
inputBlockSize.addEventListener('keyup', blockSizeHandler);

// Event handler for changing primary block amount
const primaryBlockHandler = (e) => {
    const target = e.target;
    let value = target.value;

    value = checkMaxMin(value, totalBlocks, 1, target);

    primaryBlocks = value;
    sizeAllBlocks(blocksGrid.querySelectorAll('li'));
};

inputPrimaryBlocks.addEventListener('change', primaryBlockHandler);
inputPrimaryBlocks.addEventListener('keyup', primaryBlockHandler);

// Button to randomly generate new colors
generateColors.addEventListener('click', e => {
    blocksGrid.querySelectorAll('li').forEach(el => {
        colorBlock(el, colors);
    });
});

// Button to randomly generate new sizes
generateSizes.addEventListener('click', e => {
    sizeAllBlocks(blocksGrid.querySelectorAll('li'));
});

// Button to randomly regenerate everything
generateAll.addEventListener('click', (e) => {
    sizeAllBlocks(blocksGrid.querySelectorAll('li'));
    blocksGrid.querySelectorAll('li').forEach(el => {
        colorBlock(el, colors);
    });
});

// Button to take screenshot
screenshotBtn.addEventListener('click', e => {
    html2canvas(blocksLayout, {
        width: resolution[0],
        height: resolution[1],
        onclone: html => {
            const layout = html.querySelector('.blocks-layout');

            // Removes the proportional scaling for outputted screenshot
            layout.style.transform = null;
        }
    })
    .then(canvas => {
        canvas.id = 'canvas-screenshot';
        canvas.removeAttribute('style');
        simpleLightbox.open({
            content: canvas,
            elementClass: 'slbContentEl'
        });
    });
});