import { colors } from './index';
import colorBlock from './colorBlock';

/**
 * Setup color system
 * @param {HTMLElement} settings
 */
export default function setupColors(settings) {
    const root = document.documentElement;

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
        const id = target.getAttribute('for');
        const input = document.querySelector(`input[id='${id}']`);

        // Remove from colors object
        delete colors[id];

        // Remove CSS Variable color
        root.style.removeProperty(`--${id}`);

        // Change affected blocks with the color to a new one
        const affected = document.querySelectorAll(`li[style*='--${id}']`);

        affected.forEach(element => {
            colorBlock(element, colors);
        });

        // Remove settings input/button
        target.remove();
        input.remove();
    };

    // Loop over all colors and setup functionality
    for (let color in colors) {
        if (colors.hasOwnProperty(color)) {
            const colorInput = document.createElement('input');
            const colorRemove = document.createElement('button');

            // Add CSS Variable color
            root.style.setProperty(`--${color}`, colors[color]);

            // Setup settings input
            colorInput.setAttribute('id', color);
            colorInput.setAttribute('value', colors[color]);
            colorInput.addEventListener('change', colorChangeHandler);
            colorInput.addEventListener('keyup', colorChangeHandler);

            // Setup color removal buttons
            colorRemove.setAttribute('type', 'button');
            colorRemove.setAttribute('for', color);
            colorRemove.textContent = 'x';
            colorRemove.addEventListener('click', colorRemoveHandler);

            settings.appendChild(colorInput);
            settings.appendChild(colorRemove);
        }
    }
}