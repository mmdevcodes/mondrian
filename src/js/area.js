import interact from "interactjs";
import { debounce, scaleContent } from './utils';
import sizeAllBlocks from './sizeAllBlocks';
import {
    inputTotalBlocks,
    inputBlockSize,
    inputPrimaryBlocks,
    inputResWidth,
    inputResHeight,
    inputBlocksX,
    inputBlocksY,
    inputBlocksRotate,
    inputBlocksScale,
    inputBlocksGap
} from '../index';

export default class Area {
    constructor(outerEl, innerEl, container, colorSystem, resolution, totalBlocks, blockSize, primaryBlocks, gap) {
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
        this.gap = gap;
        this.resolution = resolution;
        this.totalBlocks = totalBlocks;
        this.colorSystem = colorSystem;

        // Setup outer area
        this.setupArea();

        // Create Mondrian area
        this.setBlocks();
        this.transformBlocks();
        this.interaction();
        this.updateInputs();

        // Wrapped methods
        this.areaListener = debounce(this.setupArea.bind(this), 100);
        this.moveBlocks = debounce(this.transformBlocks.bind(this), 5, true);

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

        // Add grid gap
        this.setGap();
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
            this.colorSystem.colorBlock(block);

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

        this.updateInputs();
    }

    setGap = () => {
        this.blocksContainer.style.gridGap = `${this.gap}px`;
    }

    interaction = () => {
        const onDragMove = e => {
            this.x = parseFloat(this.x) + e.dx;
            this.y = parseFloat(this.y) + e.dy;

            this.moveBlocks();
        };

        const onGestureMove = e => {
            this.rotate = parseFloat(this.rotate) + e.da;
            this.innerScale = parseFloat(this.innerScale) + e.ds;

            this.moveBlocks();
        };

        const onWheel = e => {
            const direction = e.deltaY < 0 ? 'up' : 'down';
            const step = 0.05;

            if (direction === 'up') {
                this.innerScale = parseFloat(this.innerScale) + step;
            } else if (direction === 'down') {
                this.innerScale = parseFloat(this.innerScale) - step;
            }

            this.moveBlocks();
        };

        // Drag and gesture functionality
        interact(this.blocksContainer)
            .draggable({
                onmove: onDragMove,
                inertia: true,
                autoScroll: true
            })
            .gesturable({
                onmove: onGestureMove
            });

        // Scroll wheel zoom functionality
        this.innerEl.addEventListener('wheel', onWheel);
    }

    updateInputs = () => {
        inputTotalBlocks.value = this.totalBlocks;
        inputBlockSize.value = this.blockSize;
        inputPrimaryBlocks.value = this.primaryBlocks;
        inputResWidth.value = this.resolution[0];
        inputResHeight.value = this.resolution[1];
        inputBlocksX.value = parseFloat(this.x).toFixed(2);
        inputBlocksY.value = parseFloat(this.y).toFixed(2);
        inputBlocksRotate.value = parseFloat(this.rotate).toFixed(2);
        inputBlocksScale.value = parseFloat(this.innerScale).toFixed(2);
        inputBlocksGap.value = this.gap;
    }
}