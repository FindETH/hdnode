import { fromHex, toHex, numberToBuffer } from './buffer';

describe('toHex', () => {
  it('gets a hexadecimal string from a buffer', () => {
    const buffer = fromHex('123456abcdef');
    expect(toHex(buffer)).toBe('123456abcdef');
  });
});

describe('fromHex', () => {
  it('gets a buffer from a hexadecimal string', () => {
    expect(fromHex('abcdef')).toBeInstanceOf(Uint8Array);
    expect(toHex(fromHex('abcdef'))).toBe('abcdef');
  });

  it('works with and without prefixed 0x', () => {
    const withoutPrefix = fromHex('abcdef');
    const withPrefix = fromHex('0xabcdef');

    expect(withoutPrefix).toStrictEqual(withPrefix);
  });
});

describe('numberToBuffer', () => {
  it('writes a number to a new buffer', () => {
    expect(numberToBuffer(1234, 2)).toHaveLength(2);
    expect(numberToBuffer(1234, 4)).toHaveLength(4);
    expect(toHex(numberToBuffer(1234, 2))).toBe('04d2');
    expect(toHex(numberToBuffer(1234, 4))).toBe('000004d2');
  });
});
