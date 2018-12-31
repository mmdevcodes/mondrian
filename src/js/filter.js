import { html, render } from 'lit-html';
import { filterRows } from "../index";
import draggable from "./draggable";

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
        this.sliders.push({ name: name, label: label, min: min, max: max, value: value, step: step });
    };

    addNub(name, x, y) {
        this.nubs.push({ name: name, x: x, y: y });
    };

    use() {
        const sliderOnChange = e => {
            const target = e.target;
            const value = target.value;
            const id = target.id;

            this[id] = value;
            this.update();
        };

        const sliderSetValue = (slider) => {
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
                            @change=${onchange}
                            @input=${sliderOnChange}
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
            nubHtml.classList.add('nub');
            dragBlock.insertAdjacentElement('afterbegin', nubHtml);

            draggable(nubHtml, dragBlock);
        });

        // Render everything to the DOM
        render(sliderHtml, fieldCategory);
        fieldCategory.classList.add('field-category');
        filterRows.insertAdjacentElement('afterbegin', fieldCategory);

        // Update the canvas once the settings are loaded
        this.update();
    }
}