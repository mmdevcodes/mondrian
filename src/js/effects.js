import { blocksLayout, gridSettings } from "../index";
import glfx from 'glfx';

const effectsSettings = document.getElementById('effects-settings');
const effectsRows = document.getElementById('effects-row');

function Filter(name, func, init, update, imageFile) {
    this.name = name;
    this.func = func;
    this.update = update;
    this.imageFile = imageFile;
    this.sliders = [];
    this.nubs = [];

    init.call(this);
}

Filter.prototype.addNub = function(name, x, y) {
    this.nubs.push({ name: name, x: x, y: y });
};

Filter.prototype.addSlider = function(name, label, min, max, value, step) {
    this.sliders.push({ name: name, label: label, min: min, max: max, value: value, step: step });
};

Filter.prototype.use = function(canvas, texture, id) {
    // Add a setting row for each slider
    for (let i = 0; i < this.sliders.length; i++) {
        const slider = this.sliders[i];
        const range = document.createElement('input');
        const markup = `
            <div class="field">
                <label for="${slider.name}">${slider.label}</label>
            </div>
        `;
        effectsRows.insertAdjacentHTML('afterbegin', markup);


        // Event listener for updating canvas area
        const onChange = e => {
            const target = e.target;
            const value = target.value;

            this[slider.name] = value;
            this.update(canvas, texture);
        };

        // Setup input
        range.id = id;
        range.min = slider.min;
        range.max = slider.max;
        range.value = slider.value;
        range.step = slider.step;
        range.type = 'range';
        range.addEventListener('change', onChange);
        range.addEventListener('input', onChange);

        // Add to DOM
        document.querySelector(`[for="${slider.name}"]`).insertAdjacentElement('afterend', range);

        this[slider.name] = slider.value;
    }

    // Update the canvas once the settings are loaded
    this.update(canvas, texture);
};

var filters = [
    new Filter('Brightness / Contrast', 'brightnessContrast', function() {
        this.addSlider('brightness', 'Brightness', -1, 1, 0, 0.01);
        this.addSlider('contrast', 'Contrast', -1, 1, 0, 0.01);
    }, function(canvas, texture) {
        canvas.draw(texture).brightnessContrast(this.brightness, this.contrast).update();
    })
];

export default function effects(canvas) {
    const fxCanvas = glfx.canvas();
    const texture = fxCanvas.texture(canvas);

    // Changing settings mode
    gridSettings.classList.remove('active');
    effectsSettings.classList.add('active');

    // Loading up a canvas
    fxCanvas.id = 'canvas-effects';
    fxCanvas.draw(texture).update();

    // For each type of filter add settings and hook up to canvas
    for (let i = 0; i < filters.length; i++) {
        filters[i].use(fxCanvas, texture, filters[i].func);
    }

    // Add canvas to DOM
    blocksLayout.prepend(fxCanvas);
}