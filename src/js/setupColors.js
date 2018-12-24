import { colors, generateColors } from '../index';
import colorBlock from './colorBlock';
import { newRandomColor } from './utils';
import closeBtn from '../assets/close.svg';

/**
 * Setup color system
 * @param {HTMLElement} settings
 */
export default function setupColors(settings) {
    const root = document.documentElement;
    const addColor = document.getElementById('add-color');

    // Event handler for changing colors
    const colorChangeHandler = (e) => {
        const target = e.target;
        const id = target.id;
        let value = target.value;

        // Update colors object
        colors[id] = value;

        // Update CSS Variable color
        root.style.setProperty(`--${id}`, value);
    };

    // Event handler for removing colors
    const colorRemoveHandler = (e) => {
        const target = e.target;
        const id = target.getAttribute('data-for');
        const input = document.querySelector(`input[id='${id}']`);
        const parent = target.parentElement;

        // Remove from colors object
        delete colors[id];

        // Remove CSS Variable color
        root.style.removeProperty(`--${id}`);

        // Change affected blocks with the color to a new one
        const affected = document.querySelectorAll(`li[style*='--${id}']`);

        affected.forEach(element => {
            colorBlock(element, colors);
        });

        // Remove color input, button, label, etc...
        parent.remove();
    };

    // Event handler for adding colors
    const addColorHandler = (e) => {
        let index = 0;

        // Create a new index in the colors object and create settings
        while (colors.hasOwnProperty(`color${index}`)) index++;
        colors[`color${index}`] = newRandomColor();
        createColorSetting(`color${index}`);

        // Regenerate colors
        generateColors.click();
    };

    // Setup color addition functionality
    addColor.addEventListener('click', addColorHandler);

    // Add HTML and CSS for manipulating colors to the DOM
    const createColorSetting = (color) => {
        const colorField = document.createElement('div');
        const colorIndicator = document.createElement('label');
        const colorInput = document.createElement('input');
        const colorRemove = document.createElement('button');
        const svg = `<img src="${closeBtn}" alt="Remove">`;

        // Add CSS Variable color
        root.style.setProperty(`--${color}`, colors[color]);

        // Setup settings input
        colorInput.setAttribute('type', 'text');
        colorInput.setAttribute('id', color);
        colorInput.setAttribute('value', colors[color]);
        colorInput.addEventListener('change', colorChangeHandler);
        colorInput.addEventListener('keyup', colorChangeHandler);

        // Setup color removal buttons
        colorRemove.setAttribute('type', 'button');
        colorRemove.setAttribute('title', 'Remove');
        colorRemove.setAttribute('data-for', color);
        colorRemove.insertAdjacentHTML('afterbegin', svg);
        colorRemove.addEventListener('click', colorRemoveHandler);

        // Setup color indicator
        colorIndicator.setAttribute('for', color);
        colorIndicator.textContent = color;
        colorIndicator.classList.add('color-indicator');
        colorIndicator.style.backgroundColor = `var(--${color})`;

        // Setup wrapper element
        colorField.classList.add('field');

        // Setup DOM
        colorField.insertAdjacentElement('beforeend', colorInput);
        colorField.insertAdjacentElement('beforeend', colorIndicator);
        colorField.insertAdjacentElement('beforeend', colorRemove);
        settings.insertAdjacentElement('afterbegin', colorField);
    };

    // Loop over all colors and setup functionality
    for (let color in colors) {
        if (colors.hasOwnProperty(color)) {
            createColorSetting(color);
        }
    }
}