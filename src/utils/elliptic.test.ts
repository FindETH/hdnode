import { fromHex, toHex } from './buffer';
import {
  compressPublicKey,
  decompressPublicKey,
  getPublicKey,
  privateAdd,
  privateToBuffer,
  publicAdd,
  publicToBuffer,
  secp256k1
} from './elliptic';

const PRIVATE_KEY = fromHex('044ce8e536ea4e4c61b42862bc98f8c574942fb77121e27f316cb15a96d9c99a');
const PUBLIC_KEY = fromHex('03e6159bb12479339ce9be03fa724f53692893e7c91de9be2c00ca8d554fca8f51');
const UNCOMPRESSED_PUBLIC_KEY = fromHex(
  '04e6159bb12479339ce9be03fa724f53692893e7c91de9be2c00ca8d554fca8f518cceae20d3126e2b0895a9073a918ee4bd1f5ff82f61c5cc2f99215412865c4d'
);

const TWEAK = fromHex('04bfb2dd60fa8921c2a4085ec15507a921f49cdc839f27f0f280e9c1495d44b5');
const INVALID_TWEAK = fromHex('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');

describe('publicToBuffer', () => {
  it('returns a public key buffer for a keypair', () => {
    const keyPair = secp256k1.keyFromPublic(PUBLIC_KEY);
    expect(publicToBuffer(keyPair, true)).toEqual(PUBLIC_KEY);
  });
});

describe('privateToBuffer', () => {
  it('returns a private key buffer for a keypair', () => {
    const keyPair = secp256k1.keyFromPrivate(PRIVATE_KEY);
    expect(privateToBuffer(keyPair)).toEqual(PRIVATE_KEY);
  });
});

describe('compressPublicKey', () => {
  it('compresses a public key', () => {
    expect(compressPublicKey(UNCOMPRESSED_PUBLIC_KEY)).toEqual(PUBLIC_KEY);
    expect(compressPublicKey(PUBLIC_KEY)).toEqual(PUBLIC_KEY);
  });
});

describe('decompressPublicKey', () => {
  it('decompresses a public key', () => {
    expect(decompressPublicKey(UNCOMPRESSED_PUBLIC_KEY)).toEqual(UNCOMPRESSED_PUBLIC_KEY);
    expect(decompressPublicKey(PUBLIC_KEY)).toEqual(UNCOMPRESSED_PUBLIC_KEY);
  });
});

describe('getPublicKey', () => {
  it('returns the public key for a private key', () => {
    expect(getPublicKey(PRIVATE_KEY)).toEqual(PUBLIC_KEY);
  });
});

describe('privateAdd', () => {
  it('adds a tweak to the private key', () => {
    expect(toHex(privateAdd(PRIVATE_KEY, TWEAK))).toBe(
      '090c9bc297e4d76e245830c17dee006e9688cc93f4c10a7023ed9b1be0370e4f'
    );
  });

  it('throws if the tweak is invalid', () => {
    expect(() => privateAdd(PRIVATE_KEY, INVALID_TWEAK)).toThrow();
  });
});

describe('publicAdd', () => {
  it('adds a tweak to the public key', () => {
    expect(toHex(publicAdd(PUBLIC_KEY, TWEAK))).toBe(
      '0270cffe1a4d8e742d38d2fd9c199232907fb623f13cfabcf94d31fd41d4336ec1'
    );
  });

  it('throws if the tweak is invalid', () => {
    expect(() => publicAdd(PUBLIC_KEY, INVALID_TWEAK)).toThrow();
  });
});
