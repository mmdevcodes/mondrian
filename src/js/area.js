import { resolution } from '../index';
import { debounce, scaleContent } from './utils';

/**
* Setup page layout
* @param {HTMLElement} outerEl
* @param {HTMLElement} innerEl
*/
export default class Area {
    constructor(outerEl, innerEl) {
        this.outerEl = outerEl;
        this.innerEl = innerEl;
        this.mainStyle;
        this.mainWidth;
        this.mainHeight;
        this.scale;

        // Run logic
        this.setupArea();

        // Setup debounced version of setupArea for window resizing
        this.setupAreaListener = debounce(this.setupArea.bind(this), 100);
        window.addEventListener('resize', this.setupAreaListener);
    }

    setupArea = () => {
        this.mainStyle = getComputedStyle(this.outerEl);
        this.mainWidth = this.outerEl.clientWidth;
        this.mainHeight = this.outerEl.clientHeight;

        // Calculating width/height without padding
        this.mainWidth -= parseFloat(this.mainStyle.paddingLeft) + parseFloat(this.mainStyle.paddingRight);
        this.mainHeight -= parseFloat(this.mainStyle.paddingTop) + parseFloat(this.mainStyle.paddingBottom);

        // Setting width/height on the layout element
        this.innerEl.style.width = `${resolution[0]}px`;
        this.innerEl.style.height = `${resolution[1]}px`;

        // Scale the layout proportionally to available space
        this.scale = scaleContent(this.innerEl, this.mainWidth, this.mainHeight, resolution[0], resolution[1]);
        this.outerEl.classList.add('ready');
    }
}