import { HARDENED_OFFSET } from '../constants';

/**
 * Get the index from a derivation path level.
 *
 * @param {string} level
 * @return {number}
 */
export const getIndex = (level: string): number => {
  const result = /^(\d+)('?)$/.exec(level);
  if (!result) {
    throw new Error('Invalid derivation path');
  }

  const item = parseInt(result[1], 10);
  if (result[2] === "'") {
    return item + HARDENED_OFFSET;
  }

  return item;
};
