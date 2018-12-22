/**
 * Size a block
 * @param {HTMLElement} el Block to resize
 * @param {Integer} col Set grid column size
 * @param {Integer} row Set grid row size
 */
export default function sizeBlock(el, col, row) {
    el.style.gridColumn = `span ${col}`;
    el.style.gridRow = `span ${row}`;
};