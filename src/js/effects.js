import { blocksLayout, gridSettings } from "../index";
import glfx from 'glfx';
import { html, render } from 'lit-html';

const effectsSettings = document.getElementById('effects-settings');
const effectsRows = document.getElementById('effects-row');
let fxCanvas;
let fxTexture;

class Filter {
    constructor(name, func, init, update) {
        this.name = name;
        this.func = func;
        this.init = init;
        this.update = update;
        this.sliders = [];

        init.call(this);
    }

    addSlider(name, label, min, max, value, step) {
        this.sliders.push({ name: name, label: label, min: min, max: max, value: value, step: step });
    };

    use() {
        const onChange = e => {
            const target = e.target;
            const value = target.value;
            const id = target.id;

            this[id] = value;
            this.update();
            console.log(fxTexture);
        };

        const setValue = (slider) => {
            this[slider.name] = slider.value;
        };

        const fieldCategory = document.createElement('div');

        const myHtml = html`
            ${this.sliders.map(slider => {
                return html`
                    <div class="field">
                        <label for="${slider.name}">${slider.label}</label>
                        <input
                            type="range"
                            id="${slider.name}"
                            min="${slider.min}"
                            max="${slider.max}"
                            value="${slider.value}"
                            step="${slider.step}"
                            @change=${onchange}
                            @input=${onChange}
                        >
                    </div>
                    ${setValue(slider)}
                `;
            })}
        `;

        render(myHtml, fieldCategory);
        fieldCategory.classList.add('field-category');
        effectsRows.insertAdjacentElement('afterbegin', fieldCategory);

        // Update the canvas once the settings are loaded
        this.update();
    }
}

const filters = [
    new Filter('Brightness / Contrast', 'brightnessContrast', function() {
        this.addSlider('brightness', 'Brightness', -1, 1, 0, 0.01);
        this.addSlider('contrast', 'Contrast', -1, 1, 0, 0.01);
    }, function() {
        fxCanvas.draw(fxTexture).brightnessContrast(this.brightness, this.contrast).update();
        fxTexture = fxCanvas.texture(fxCanvas);
    }),
    new Filter('Hue / Saturation', 'hueSaturation', function() {
        this.addSlider('hue', 'Hue', -1, 1, 0, 0.01);
        this.addSlider('saturation', 'Saturation', -1, 1, 0, 0.01);
    }, function() {
        fxCanvas.draw(fxTexture).hueSaturation(this.hue, this.saturation).update();
        fxTexture = fxCanvas.texture(fxCanvas);
    }),
];

export default function effects(canvas) {
    fxCanvas = glfx.canvas();
    fxTexture = fxCanvas.texture(canvas);

    // Changing settings mode
    gridSettings.classList.remove('active');
    effectsSettings.classList.add('active');

    // Loading up a canvas
    fxCanvas.id = 'canvas-effects';
    fxCanvas.draw(fxTexture).update();

    // For each type of filter add settings and hook up to canvas
    for (let i = 0; i < filters.length; i++) {
        filters[i].use();
    }

    // Add canvas to DOM
    blocksLayout.prepend(fxCanvas);
}