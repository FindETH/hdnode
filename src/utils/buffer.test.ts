import { TextEncoder, TextDecoder } from 'util';
import {
  fromHex,
  toHex,
  numberToBuffer,
  getTextEncoder,
  toBuffer,
  concat,
  getTextDecoder,
  toUtf8,
  fromUtf8
} from './buffer';

describe('getTextEncoder', () => {
  it('returns an instance of TextEncoder', () => {
    expect(getTextEncoder()).toBeInstanceOf(TextEncoder);
  });
});

describe('getTextDecoder', () => {
  it('returns an instance of TextDecoder', () => {
    expect(getTextDecoder()).toBeInstanceOf(TextDecoder);
  });
});

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

  it('throws if the hexadecimal string has an uneven length', () => {
    expect(() => fromHex('123')).toThrow();
  });

  it('throws if the data has invalid characters', () => {
    expect(() => fromHex('foobar')).toThrow();
  });
});

describe('toBuffer', () => {
  it('gets a buffer from a hexadecimal string', () => {
    expect(toBuffer('abcdef')).toBeInstanceOf(Uint8Array);
    expect(toHex(toBuffer('abcdef'))).toBe('abcdef');
  });

  it('gets a buffer from another buffer', () => {
    expect(toBuffer(toBuffer('abcdef'))).toBeInstanceOf(Uint8Array);
    expect(toHex(toBuffer(toBuffer('abcdef')))).toBe('abcdef');
  });

  it('gets a buffer from a number array', () => {
    expect(toBuffer([0xab, 0xcd, 0xef])).toBeInstanceOf(Uint8Array);
    expect(toHex(toBuffer([0xab, 0xcd, 0xef]))).toBe('abcdef');
  });
});

describe('toUtf8', () => {
  it('gets a string from a buffer', () => {
    expect(toUtf8(toBuffer('666f6f626172'))).toBe('foobar');
  });
});

describe('fromUtf8', () => {
  it('gets a buffer from a string', () => {
    expect(toHex(fromUtf8('foobar'))).toBe('666f6f626172');
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

describe('concat', () => {
  it('concatenates multiple buffers', () => {
    expect(toHex(concat([toBuffer('12'), toBuffer('34')]))).toBe('1234');
  });
});
