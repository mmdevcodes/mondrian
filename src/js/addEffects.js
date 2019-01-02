import { blocksLayout, gridSettings, filterSettingsForm, filterRows, goBackBtn, downloadBtn } from "../index";
import FilterSettings from "./filterSettings";
import Filter from './filter';
import glfx from 'glfx-es6';
import saveAs from "file-saver";

let fxCanvas;
let fxTexture;
let fxSettings;

const allFilters = [
    new Filter('Tilt Shift', 'tiltShift', function() {
        this.addNub('start', 0.08, 0.48); // Percentages of width/height of resolution
        this.addNub('end', 0.93, 0.47); // Percentages of width/height of resolution
        this.addSlider('blurRadius', 'Blur Radius', 0, 50, 23, 1);
        this.addSlider('gradientRadius', 'Gradient Radius', 0, 1000, 900, 1);
    }, function() {
        fxSettings.setTiltCoord(this.start.x, this.start.y, this.end.x, this.end.y);
        fxSettings.setTiltBlur(this.blurRadius);
        fxSettings.setTiltGradient(this.gradientRadius);
    }),
    new Filter('Vibrance', 'vibrance', function() {
        this.addSlider('vibrance', 'Vibrance', -1, 1, 0, 0.01);
    }, function() {
        fxSettings.setVibrance(this.vibrance);
    }),
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

const goBackListener = e => {
    // Remove all filter settings
    while (filterRows.lastChild) {
        filterRows.removeChild(filterRows.lastChild);
    }

    // Reset settings view
    gridSettings.classList.add('active');
    filterSettingsForm.classList.remove('active');

    // Remove elements from DOM
    fxCanvas.remove();
    document.getElementById('draggable').remove();
};

const downloadListener = e => {
    const data = fxCanvas.toDataURL('image/png');
    saveAs(data, 'mondrian.png', true);
};

export default function filters(canvas) {
    const nubContainer = document.createElement('div');

    // Setup glfx
    fxCanvas = glfx.canvas();
    fxTexture = fxCanvas.texture(canvas);
    fxSettings = new FilterSettings(fxCanvas, fxTexture);

    // Changing settings mode
    gridSettings.classList.remove('active');
    filterSettingsForm.classList.add('active');
    nubContainer.id = 'draggable';

    // Loading up a canvas
    fxCanvas.id = 'canvas-filter';
    fxCanvas.draw(fxTexture).update();

    // Add elements to DOM
    blocksLayout.insertAdjacentElement('afterbegin', fxCanvas);
    blocksLayout.insertAdjacentElement('beforeend', nubContainer);

    // For each type of filter add settings and hook up to canvas
    for (let i = 0; i < allFilters.length; i++) {
        allFilters[i].use();
    }

    // Button to go back to editing the layout
    goBackBtn.addEventListener('click', goBackListener);

    // Button to download an image
    downloadBtn.addEventListener('click', downloadListener);
}