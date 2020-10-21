import { Buffer } from 'buffer';
import { dehexify, hexify, numberToBuffer } from './buffer';

describe('hexify', () => {
  it('gets a hexadecimal string from a buffer', () => {
    const buffer = Buffer.from('123456abcdef', 'hex');
    expect(hexify(buffer)).toBe('123456abcdef');
  });
});

describe('dehexify', () => {
  it('gets a buffer from a hexadecimal string', () => {
    expect(dehexify('abcdef')).toBeInstanceOf(Buffer);
    expect(dehexify('abcdef').toString('hex')).toBe('abcdef');
  });

  it('works with and without prefixed 0x', () => {
    const withoutPrefix = dehexify('abcdef');
    const withPrefix = dehexify('0xabcdef');

    expect(withoutPrefix).toStrictEqual(withPrefix);
  });
});

describe('numberToBuffer', () => {
  it('writes a number to a new buffer', () => {
    expect(numberToBuffer(1234, 2)).toHaveLength(2);
    expect(numberToBuffer(1234, 4)).toHaveLength(4);
    expect(numberToBuffer(1234, 2).toString('hex')).toBe('04d2');
    expect(numberToBuffer(1234, 4).toString('hex')).toBe('000004d2');
  });
});
