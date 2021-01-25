import { numberToBuffer, toHex } from './buffer';

describe('numberToBuffer', () => {
  it('writes a number to a new buffer', () => {
    expect(numberToBuffer(1234, 2)).toHaveLength(2);
    expect(numberToBuffer(1234, 4)).toHaveLength(4);
    expect(toHex(numberToBuffer(1234, 2))).toBe('04d2');
    expect(toHex(numberToBuffer(1234, 4))).toBe('000004d2');
  });
});
