import { HARDENED_OFFSET } from '../constants';
import { getIndex } from './derivation-paths';

describe('getIndex', () => {
  it('returns the index for a derivation path level', () => {
    expect(getIndex('0')).toBe(0);
    expect(getIndex("1'")).toBe(HARDENED_OFFSET + 1);
    expect(getIndex('12345')).toBe(12345);
    expect(getIndex("12345'")).toBe(HARDENED_OFFSET + 12345);
  });

  it('throws if the path is invalid', () => {
    expect(() => getIndex('foo')).toThrow();
  });
});
