/**
 * Generate an Integer
 * @param {Integer} min
 * @param {Integer} max
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);;
}

/**
 * Generate grid column span
 * @param {Integer} blockSize
 */
export function getColumnSpan(blockSize) {
    return getRandomInt(1, blockSize);
}

/**
* Generate grid row span
* @param {Integer} blockSize
*/
export function getRowSpan(blockSize) {
    return getRandomInt(1, blockSize);
}

/**
 * Checks value and set to min/max amount if out of range
 * @param {Integer} value Value to check
 * @param {Integer} max Maximum number value can be
 * @param {Integer} min Minimum number value can be
 */
export function checkMaxMin(value, max = 9999, min = 1, input) {
    value = parseInt(value);
    max = parseInt(max);
    min = parseInt(min);

    // If supplied value is greater than max
    if (value > max) {
        value = max;

    // If supplied value is less than max
    } else if (value < min) {
        value = min;
    }

    // If something went wrong just set the number to the minimum
    if (!Number.isInteger(value)) {
        value = min;
    }

    // If input is supplied change the  value
    if (input !== undefined) {
        input.value = value;
    }

    return value;
}

/**
 * Generate a random color from a colors object
 * @param {Object} colors
 */
export function getRandomColor(colors) {
    const setColor = getRandomInt(0, Object.keys(colors).length - 1);

    return Object.keys(colors)[setColor];
}

/**
 * Generate a fresh new color
 * @param {String=} type Type of color (optional)
 */
export function newRandomColor(type) {
    // Throwing in some interesting names
    const colorList = {
        red: ['crimson', 'firebrick', 'salmon', 'indianred', 'maroon'],
        pink: ['fuchsia', 'deeppink', 'hotpink'],
        orange: ['coral', 'tomato', 'gold'],
        yellow: ['lemonchiffon', 'lightgoldenrodyellow', 'khaki'],
        purple: ['rebeccapurple', 'lavender', 'thistle', 'slateblue'],
        green: ['forestgreen', 'olive', 'springgreen'],
        blue: ['aquamarine', 'steelblue', 'powderblue', 'dodgerblue', 'royalblue', 'navy', 'midnightblue'],
        brown: ['wheat', 'navajowhite', 'peru', 'sienna'],
        gray: ['gainsboro', 'silver', 'dimgray', 'lightslategray', 'slategray', 'darkslategray'],
        white: ['honeydew', 'mistyrose', 'seashell', 'oldlace', 'snow']
    };
    let color;

    /**
     * If a type of color is specified generate a random name of
     * that color otherwise pull a random one from the entire list.
     */
    if (type !== undefined) {
        const colorIndex = getRandomInt(0, colorList[type].length - 1);
        color = colorList[type][colorIndex];
    } else {
        const colors = [
            ...colorList.red,
            ...colorList.pink,
            ...colorList.orange,
            ...colorList.yellow,
            ...colorList.purple,
            ...colorList.green,
            ...colorList.blue,
            ...colorList.brown,
            ...colorList.gray,
            ...colorList.white
        ];
        const colorIndex = getRandomInt(0, colors.length - 1);
        color = colors[colorIndex];
    }

    return color;
}

/**
 * Resize element proportionally to available space
 * @param {HTMLElement} el Element to scale
 * @param {*} availableWidth
 * @param {*} availableHeight
 * @param {*} contentWidth
 * @param {*} contentHeight
 */
export function scaleContent(el, availableWidth, availableHeight, contentWidth, contentHeight) {
    const scale = Math.min(
        availableWidth / contentWidth,
        availableHeight / contentHeight
    );

    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

/**
 * Limit the rate of a function
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 */
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Check if a number is between a certain range
 * @param {Number} x Number to check
 * @param {Number} min Minimum it should be
 * @param {Number} max Maximum it should be
 */
export function isBetween(x, min, max) {
    return x >= min && x <= max;
}

/**
 * toDataURL() is broke on glfx's canvas and the author removed it
 * from his library for some reason so i'm adding it back in.
 */
export function fixedToDataURL(canvas, texture) {
    let gl = canvas.getContext('webgl');

    function getPixelArray() {
        var w = texture._.width;
        var h = texture._.height;
        var array = new Uint8Array(w * h * 4);
        texture._.drawTo(function() {
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
        });

        return array;
    }

    let w = texture._.width;
    let h = texture._.height;
    let array = getPixelArray(texture);
    let canvas2d = document.createElement('canvas');
    let c = canvas2d.getContext('2d');
    canvas2d.width = w;
    canvas2d.height = h;
    let data = c.createImageData(w, h);
    for (let i = 0; i < array.length; i++) {
        data.data[i] = array[i];
    }
    c.putImageData(data, 0, 0);

    return canvas2d.toDataURL('image/png');
}