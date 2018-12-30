import { isBetween } from "./utils";

export default class FilterSettings {
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