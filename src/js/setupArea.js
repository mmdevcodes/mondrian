import { main, layout, resolution } from '../index';
import { scaleContent } from './utils';

export default function setupArea() {
    const mainStyle = getComputedStyle(main);
    let mainWidth = main.clientWidth;
    let mainHeight = main.clientHeight;

    // Calculating width/height without padding
    mainWidth -= parseFloat(mainStyle.paddingLeft) + parseFloat(mainStyle.paddingRight);
    mainHeight -= parseFloat(mainStyle.paddingTop) + parseFloat(mainStyle.paddingBottom);

    // Setting width/height on the layout element
    layout.style.width = `${resolution[0]}px`;
    layout.style.height = `${resolution[1]}px`;

    // Scale the layout proportionally to available space
    scaleContent(layout, mainWidth, mainHeight, resolution[0], resolution[1]);
}