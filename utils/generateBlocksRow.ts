import { blocksPerRow, blockW } from '~/constants';
import { BlockData } from '~/types';

export const generateBlocksRow = (row: number): BlockData[] => {
  'worklet';
  const blocks: BlockData[] = [];

  for (let col = 0; col < blocksPerRow; col++) {
    const shouldAdd = Math.random() < 0.5;

    if (shouldAdd) {
      blocks.push({
        x: col * (blockW + 10) + 5,
        y: row * (blockW + 10) + 5,
        w: blockW,
        val: 1,
      });
    }
  }
  return blocks;
};
