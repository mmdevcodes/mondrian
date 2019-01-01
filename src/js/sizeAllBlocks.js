import sizeBlock from './sizeBlock';
import { getColumnSpan, getRandomInt, getRowSpan } from './utils';

/**
 * Size a collection of blocks
 * @param {NodeList} blocks
 */
export default function sizeAllBlocks(blocks, blockSize, primaryBlocks, totalBlocks) {
    let primaryBlockSet = [];
    let primaryBlocksTotal = primaryBlocks;

    // Prevent infinite loop
    if (primaryBlocksTotal > totalBlocks) primaryBlocksTotal = totalBlock;

    // Assign random blocks as a `primary`
    for (let i = 0; i < primaryBlocksTotal; i++) {
        let primaryIndex = getRandomInt(0, totalBlocks - 1);

        // Do not allow duplicates
        while (primaryBlockSet.includes(primaryIndex)) {
            if (totalBlocks === 1) break; // Prevent infinite loop
            primaryIndex = getRandomInt(0, totalBlocks - 1);
        }

        // Keeping track of which blocks are `primary`
        primaryBlockSet = [...primaryBlockSet, primaryIndex];
    }

    [...blocks].forEach((block, index) => {
        /**
         * If this block's index is in the primary block array
         *  then use the maximum size and exit the function.
         */
        if (primaryBlockSet.includes(index)) {
            sizeBlock(block, blockSize, blockSize);
            return;
        }

        let colSpan = getColumnSpan(blockSize);
        let rowSpan = getRowSpan(blockSize);

        // Do not allow other primary-sized blocks to be added
        while (colSpan + rowSpan === blockSize * 2) {
            if (blockSize === 1) break; // Prevent infinite loop
            colSpan = getColumnSpan(blockSize);
            rowSpan = getRowSpan(blockSize);
        }

        sizeBlock(block, colSpan, rowSpan);
    });
};
