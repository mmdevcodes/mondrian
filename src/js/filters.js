import { blocksLayout, gridSettings, filterSettings, filterRows, goBackBtn, downloadBtn } from "../index";
import { isBetween, fixedToDataURL } from "./utils";
import glfx from 'glfx';
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

class FilterSettings {
    constructor(canvas, texture) {
        this.canvas = canvas;
        this.texture = texture;
        this.hue = 0;
        this.saturation = 0;
        this.sepia = 0;
        this.brightness = 0;
        this.contrast = 0;
        this.vgnteSize = 0;
        this.vgnteAmnt = 0;
        this.vibrance = 0;
    }

    setHue(val) {
        this.hue = val;
        this.update();
    }

    setSaturation(val) {
        this.saturation = val;
        this.update();
    }

    setSepia(val) {
        this.sepia = val;
        this.update();
    }

    setBrightness(val) {
        this.brightness = val;
        this.update();
    }

    setContrast(val) {
        this.contrast = val;
        this.update();
    }

    setVignetteSize(val) {
        this.vgnteSize = val;
        this.update();
    }

    setVignetteAmt(val) {
        this.vgnteAmnt = val;
        this.update();
    }

    setVibrance(val) {
        this.vibrance = val;
        this.update();
    }

    // Update the values if the values are modified
    update() {
        this.canvas.draw(this.texture);

        // Brightness/Contrast
        if (isBetween(this.brightness, -1, 1) || isBetween(this.contrast, -1, 1)) {
            this.canvas.brightnessContrast(this.brightness, this.contrast);
        }

        // Hue/Saturation
        if (isBetween(this.hue, -1, 1) || isBetween(this.saturation, -1, 1)) {
            this.canvas.hueSaturation(this.hue, this.saturation);
        }

        if (this.sepia > 0) this.canvas.sepia(this.sepia);

        if (this.vgnteSize > 0 || this.vgnteAmnt > 0)
        this.canvas.vignette(this.vgnteSize, this.vgnteAmnt);
        if (this.vibrance > -1.1) this.canvas.vibrance(this.vibrance);

        this.canvas.update();
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

export default function filters(canvas) {
    fxCanvas = glfx.canvas();
    fxTexture = fxCanvas.texture(canvas);
    fxSettings = new FilterSettings(fxCanvas, fxTexture);

    // Changing settings mode
    gridSettings.classList.remove('active');
    filterSettings.classList.add('active');

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
        filterSettings.classList.remove('active');

        // Remove canvas
        fxCanvas.remove();
    });

    // Button to download an image
    downloadBtn.addEventListener('click', e => {
        const data = fixedToDataURL(fxCanvas, fxTexture);
        saveAs(data, 'mondrian.png', true);
    });
}