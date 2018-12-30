import { blocksLayout, gridSettings, filterSettingsForm, filterRows, goBackBtn, downloadBtn } from "../index";
import { fixedToDataURL } from "./utils";
import FilterSettings from "./filterSettings";
import glfx from 'glfx-es6';
import { html, render } from 'lit-html';
import saveAs from "file-saver";

let fxCanvas;
let fxTexture;
let fxSettings;

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
        filterRows.insertAdjacentElement('afterbegin', fieldCategory);

        // Update the canvas once the settings are loaded
        this.update();
    }
}

const allFilters = [
    new Filter('Hue / Saturation', 'hueSaturation', function() {
        this.addSlider('hue', 'Hue', -1, 1, 0, 0.01);
        this.addSlider('saturation', 'Saturation', -1, 1, 0, 0.01);
    }, function() {
        fxSettings.setHue(this.hue);
        fxSettings.setSaturation(this.saturation);
    }),
    new Filter('Brightness / Contrast', 'brightnessContrast', function() {
        this.addSlider('brightness', 'Brightness', -1, 1, 0, 0.01);
        this.addSlider('contrast', 'Contrast', -1, 0.99, 0, 0.01);
    }, function() {
        fxSettings.setBrightness(this.brightness);
        fxSettings.setContrast(this.contrast);
    }),
];

const downloadListener = (e) => {
    const data = fxCanvas.toDataURL('image/png');
    saveAs(data, 'mondrian.png', true);
};

export default function filters(canvas) {
    fxCanvas = glfx.canvas();
    fxTexture = fxCanvas.texture(canvas);
    fxSettings = new FilterSettings(fxCanvas, fxTexture);

    // Changing settings mode
    gridSettings.classList.remove('active');
    filterSettingsForm.classList.add('active');

    // Loading up a canvas
    fxCanvas.id = 'canvas-filter';
    fxCanvas.draw(fxTexture).update();

    // For each type of filter add settings and hook up to canvas
    for (let i = 0; i < allFilters.length; i++) {
        allFilters[i].use();
    }

    // Add canvas to DOM
    blocksLayout.prepend(fxCanvas);

    // Button to go back to editing the layout
    goBackBtn.addEventListener('click', e => {
        // Remove all filter settings
        while (filterRows.lastChild) {
            filterRows.removeChild(filterRows.lastChild);
        }

        // Reset settings view
        gridSettings.classList.add('active');
        filterSettingsForm.classList.remove('active');

        // Remove canvas from DOM
        fxCanvas.remove();
    });

    // Button to download an image
    downloadBtn.addEventListener('click', downloadListener);
}