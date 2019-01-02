import { debounce, scaleContent } from './utils';
import colorBlock from './colorBlock';
import sizeAllBlocks from './sizeAllBlocks';

export default class Area {
    constructor(outerEl, innerEl, container, resolution, totalBlocks, colors, blockSize, primaryBlocks) {
        this.outerEl = outerEl;
        this.innerEl = innerEl;
        this.blocksContainer = container;
        this.blocks = this.blocksContainer.getElementsByTagName('li');
        this.mainStyle;
        this.mainWidth;
        this.mainHeight;
        this.outerScale;
        this.innerScale = 1.00;
        this.x = 0;
        this.y = 0;
        this.rotate = 0;
        this.blockSize = blockSize;
        this.primaryBlocks = primaryBlocks;
        this.resolution = resolution;
        this.totalBlocks = totalBlocks;
        this.colors = colors;

        // Setup outer area
        this.setupArea();

        // Create Mondrian area
        this.setBlocks();
        this.transformBlocks();

        // Wrapped methods
        this.areaListener = debounce(this.setupArea.bind(this), 100);

        // Event listeners
        window.addEventListener('resize', this.areaListener);
    }

    setupArea = () => {
        this.mainStyle = getComputedStyle(this.outerEl);
        this.mainWidth = this.outerEl.clientWidth;
        this.mainHeight = this.outerEl.clientHeight;

        // Calculating width/height without padding
        this.mainWidth -= parseFloat(this.mainStyle.paddingLeft) + parseFloat(this.mainStyle.paddingRight);
        this.mainHeight -= parseFloat(this.mainStyle.paddingTop) + parseFloat(this.mainStyle.paddingBottom);

        // Setting width/height on the layout element
        this.innerEl.style.width = `${this.resolution[0]}px`;
        this.innerEl.style.height = `${this.resolution[1]}px`;

        // Scale the layout proportionally to available space
        this.outerScale = scaleContent(this.innerEl, this.mainWidth, this.mainHeight, this.resolution[0], this.resolution[1]);
        this.outerEl.classList.add('ready');
    }

    setBlocks = (desiredAmount = this.totalBlocks) => {
        let currentBlocks = this.blocks.length;
        let generatedBlocks = [];

        /**
         * Creates blocks if requested amount is more than is
         * currently rendered on the page.
         */
        while (currentBlocks < desiredAmount) {
            const block = document.createElement('li');

            // Color each block
            colorBlock(block, this.colors);

            // Add block to DOM
            this.blocksContainer.appendChild(block);

            // Add block to generated block array to return later
            generatedBlocks = [...generatedBlocks, block];

            // Update total amount of blocks on the page
            currentBlocks = this.blocks.length;
        }

        /**
         * Removes blocks if requested amount is less than is
         * currently rendered on the page.
         */
        while (currentBlocks > desiredAmount) {
            const block = this.blocksContainer.querySelector('li:last-child');

            block.remove();
            currentBlocks = this.blocks.length;
        }

        sizeAllBlocks(generatedBlocks, this.blockSize, this.primaryBlocks, this.totalBlocks);

        return generatedBlocks;
    }

    transformBlocks = () => {
        this.blocksContainer.style.transform = `
            translate(${this.x}px, ${this.y}px)
            rotate(${this.rotate}deg)
            scale(${this.innerScale})
        `;
    }
}