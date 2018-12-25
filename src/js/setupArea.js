import { resolution } from '../index';
import { debounce, scaleContent } from './utils';

/**
 * Setup page layout
 * @param {HTMLElement} outerEl
 * @param {HTMLElement} innerEl
 */
export default debounce(function(outerEl, innerEl) {
    const mainStyle = getComputedStyle(outerEl);
    let mainWidth = outerEl.clientWidth;
    let mainHeight = outerEl.clientHeight;

    // Calculating width/height without padding
    mainWidth -= parseFloat(mainStyle.paddingLeft) + parseFloat(mainStyle.paddingRight);
    mainHeight -= parseFloat(mainStyle.paddingTop) + parseFloat(mainStyle.paddingBottom);

    // Setting width/height on the layout element
    innerEl.style.width = `${resolution[0]}px`;
    innerEl.style.height = `${resolution[1]}px`;

    // Scale the layout proportionally to available space
    scaleContent(innerEl, mainWidth, mainHeight, resolution[0], resolution[1]);
}, 100);