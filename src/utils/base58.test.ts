import { decodeBase58, encodeBase58 } from './base58';
import { fromUtf8, toUtf8 } from './buffer';

describe('encode', () => {
  it('encodes a buffer with checksum', () => {
    const payload = fromUtf8('foo bar');
    expect(encodeBase58(payload)).toBe('SQHFQMRT97ajZaP');
    expect(decodeBase58(encodeBase58(payload))).toEqual(payload);
  });
});

describe('decode', () => {
  it('decodes a base58 string with checksum', () => {
    expect(toUtf8(decodeBase58('SQHFQMRT97ajZaP'))).toBe('foo bar');
  });

  it('throws if the checksum is invalid', () => {
    expect(() => decodeBase58('SQHFQMRT97ajfoo')).toThrow();
  });
});
