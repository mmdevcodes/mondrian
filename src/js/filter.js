import { html, render } from 'lit-html';
import { filterRows } from "../index";

export default class Filter {
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

        // Creating markup
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

        // Render everything to the DOM
        render(myHtml, fieldCategory);
        fieldCategory.classList.add('field-category');
        filterRows.insertAdjacentElement('afterbegin', fieldCategory);

        // Update the canvas once the settings are loaded
        this.update();
    }
}