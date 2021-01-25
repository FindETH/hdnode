import { fromUtf8, toHex } from './buffer';
import { hmacSHA512, pbkdf2, ripemd160, sha256 } from './hash';

const TEST_STRING = fromUtf8('foo bar');
const TEST_SALT = fromUtf8('baz qux');

describe('hmacSHA512', () => {
  it('hashes a buffer with HMAC-SHA512', () => {
    expect(toHex(hmacSHA512(TEST_SALT, TEST_STRING))).toBe(
      'fde337f939e07ce6c37530eb0a0bb767b144a9bb0de39a594b838dc22b74c57f1e076e5ab5a5db421a83eba88285564d2fc04239216c68ce5a6a9918c3b74712'
    );
  });
});

describe('sha256', () => {
  it('hashes a buffer with SHA256', () => {
    expect(toHex(sha256(TEST_STRING))).toBe('fbc1a9f858ea9e177916964bd88c3d37b91a1e84412765e29950777f265c4b75');
  });
});

describe('ripemd160', () => {
  it('hashes a buffer with RIPEMD160', () => {
    expect(toHex(ripemd160(TEST_STRING))).toBe('36297e108170a41b2e60a8b5897f2148ef39787a');
  });
});

describe('pbkdf2', () => {
  it('derives a key from a buffer and salt', () => {
    expect(toHex(pbkdf2(TEST_STRING, TEST_STRING))).toBe(
      '9b06ad712c999c6219f002257eb4288d7de90ab375e61cfbc8953ad679d7dfeab93d1dccae4bf01e83b94c00591377259d67b06554e32f3e8b99de39bd4349e6'
    );
  });
});
