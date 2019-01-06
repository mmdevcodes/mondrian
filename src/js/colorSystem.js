import ColorScheme from 'color-scheme';
import { html, render } from 'lit-html';
import { getRandomInt } from './utils';
import closeBtn from '../assets/close.svg';

export default class ColorSystem {
    constructor(colorSection, addColorBtn, generateColorsBtn) {
        this.root = document.documentElement;
        this.colors = {};
        this.hue = getRandomInt(0, 360);
        this.colorScheme = 'mono',
        this.colorVariation = 'pastel',
        this.colorSection = colorSection;
        this.addColorBtn = addColorBtn;
        this.generateColorsBtn = generateColorsBtn;

        // Create color schemes and add settings to DOM
        this.createColorScheme();
        this.createColorSetting();

        // Event listeners
        addColorBtn.addEventListener('click', this.addColor);
    }

    createColorScheme = () => {
        const colorArr = this.generateColors();

        // Add color scheme array to the main colors object
        colorArr.map((color, i) => this.colors[`color${i}`] = color);
    }

    createColorSetting = color => {
        const colorChange = e => {
            const target = e.target;
            const id = target.name;
            const value = target.value;

            // Update colors object
            this.colors[id] = value;

            // Re-render settings
            render(colorField(this.colors), this.colorSection);
        };

        const colorRemove = e => {
            const target = e.target;
            const id = target.getAttribute('data-for');

            // Remove from colors object
            delete this.colors[id];

            // Remove CSS Variable color
            this.root.style.removeProperty(`--${id}`);

            // Change affected blocks with the color to a new one
            const affected = document.querySelectorAll(`li[style*='--${id}']`);
            affected.forEach(element => this.colorBlock(element));

            // Re-render settings
            render(colorField(this.colors), this.colorSection);
        };

        /**
         * HTML for each field. Array map reversed so new fields
         * are added at the top of the wrapper element.
         */
        const colorField = (colors) => html`
            ${Object.entries(colors).reverse().map(color => {
                // Adding CSS Variables to the DOM while we're at it
                this.root.style.setProperty(`--${color[0]}`, color[1]);

                return html`
                    <div class="field">
                        <input
                            id="${color[0]}-input-text"
                            name="${color[0]}"
                            .value=${color[1]}
                            type="text"
                            @input="${colorChange}"
                        >
                        <label
                            class="color-indicator"
                            style="background-color: var(--${color[0]})"
                        >
                            <input
                                id="${color[0]}-input-color"
                                name="${color[0]}"
                                .value=${color[1]}
                                type="color"
                                @input="${colorChange}"
                            >
                        </label>
                        <label
                            for="${color[0]}-input-text"
                            class="visually-hidden"
                        >Change color via text</label>
                        <label
                            for="${color[0]}-input-color"
                            class="visually-hidden"
                        >Change color via selector</label>
                        <button
                            type="button"
                            title="Remove"
                            data-for="${color[0]}"
                            @click=${colorRemove}
                        ><img src="${closeBtn}" alt="Remove"></button>
                    </div>
                `;
            })}
        `;

        render(colorField(this.colors), this.colorSection);
    }

    addColor = e => {
        let index = 0;

        // Create a new index in the colors object and create settings
        while (this.colors.hasOwnProperty(`color${index}`)) index++;
        this.colors[`color${index}`] = this.generateColors()[0];
        this.createColorSetting(`color${index}`);

        // Regenerate colors
        this.generateColorsBtn.click();
    }

    colorBlock = (el, color = this.getRandomColor(this.colors)) => {
        el.style.backgroundColor = `var(--${color})`;
    }

    getRandomColor(colors = this.colors) {
        const setColor = getRandomInt(0, Object.keys(colors).length - 1);

        return Object.keys(colors)[setColor];
    }

    generateColors = () => {
        const colorScheme = new ColorScheme;
        const colors = colorScheme
            .from_hue(this.hue)
            .scheme(this.colorScheme)
            .variation(this.colorVariation)
            .colors()
            .map(color => {
                return `#${color}`;
            });

        return colors;
    }
}