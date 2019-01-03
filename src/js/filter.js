import { html, render } from 'lit-html';
import { filterRows, resolution } from "../index";
import Draggable from "./draggable";

export default class Filter {
    constructor(name, func, init, update) {
        this.name = name;
        this.func = func;
        this.init = init;
        this.update = update;
        this.nubs = [];
        this.sliders = [];

        init.call(this);
    }

    addSlider(name, label, min, max, value, step) {
        this.sliders.push({ name, label, min, max, value, step });
    };

    addNub(name, x, y) {
        this.nubs.push({ name, x, y });
    };

    use() {
        const sliderListener = e => {
            const target = e.target;
            const value = target.value;
            const id = target.id;

            this[id] = value;
            this.update();
        };

        const sliderSetValue = slider => {
            this[slider.name] = slider.value;
        };

        const fieldCategory = document.createElement('div');

        // Slider HTML markup and repeated rows for each filter section
        const sliderHtml = html`
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
                            @change=${sliderListener}
                        >
                    </div>
                    ${sliderSetValue(slider)}
                `;
            })}
        `;

        // Nubs HTML markup with each dot for filter coordinates
        this.nubs.forEach(nub => {
            const dragBlock = document.getElementById('draggable');
            const nubHtml = document.createElement('div');
            const x = nub.x * resolution[0];
            const y = nub.y * resolution[1];
            const nubListener = (x, y) => {
                this[nub.name] = {x, y};
                this.update();
            };

            this[nub.name] = {x, y};

            // Setup DOM
            nubHtml.classList.add('nub');
            nubHtml.setAttribute('title', `${this.name} ${nub.name}`);
            dragBlock.insertAdjacentElement('afterbegin', nubHtml);

            // Instantiate after adding to DOM since width/height calculations are being done
            const draggable = new Draggable(nubHtml, dragBlock, x, y, nubListener);
        });

        // Render everything to the DOM
        render(sliderHtml, fieldCategory);
        fieldCategory.classList.add('field-category');
        filterRows.insertAdjacentElement('afterbegin', fieldCategory);

        // Update the canvas once the settings are loaded
        this.update();
    }
}