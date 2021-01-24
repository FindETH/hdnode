import BN from 'bn.js';
import { ec } from 'elliptic';
import type { curve } from 'elliptic';
import { toBuffer } from './buffer';
import { ripemd160 } from './hash';

export const secp256k1 = new ec('secp256k1');

/**
 * Get a Uint8Array for a public key.
 *
 * @param {ec.KeyPair} keyPair
 * @param {boolean} compact
 * @return {Uint8Array}
 */
export const publicToBuffer = (keyPair: ec.KeyPair, compact: boolean): Uint8Array => {
  return toBuffer(keyPair.getPublic(compact, 'array'));
};

/**
 * Get a Uint8Array for a private key.
 *
 * @param {ec.KeyPair} keyPair
 * @return {Uint8Array}
 */
export const privateToBuffer = (keyPair: ec.KeyPair): Uint8Array => {
  return toBuffer(keyPair.getPrivate().toArray());
};

/**
 * Get a Uint8Array for a point.
 *
 * @param {curve.base.BasePoint} point
 * @param {boolean} compact
 * @return {Uint8Array}
 */
export const pointToBuffer = (point: curve.base.BasePoint, compact: boolean): Uint8Array => {
  return toBuffer(point.encode('array', compact));
};

/**
 * Compress a public key. This function takes both compressed and uncompressed public keys, and always returns the
 * compressed variant.
 *
 * @param publicKey
 */
export const compressPublicKey = (publicKey: Uint8Array): Uint8Array => {
  return publicToBuffer(secp256k1.keyFromPublic(publicKey), true);
};

/**
 * Decompress a public key. This function takes both compressed and uncompressed public keys, and always returns the
 * decompressed variant.
 *
 * @param {Uint8Array} publicKey
 * @return {Uint8Array}
 */
export const decompressPublicKey = (publicKey: Uint8Array): Uint8Array => {
  return publicToBuffer(secp256k1.keyFromPublic(publicKey), false);
};

/**
 * Get the public key for a private key.
 *
 * @param {Uint8Array} privateKey
 * @return {Uint8Array}
 */
export const getPublicKey = (privateKey: Uint8Array): Uint8Array => {
  return publicToBuffer(secp256k1.keyFromPrivate(privateKey), true);
};

/**
 * Get the fingerprint from a public key.
 *
 * @param {Uint8Array} publicKey
 * @return {number}
 */
export const getFingerprint = (publicKey: Uint8Array): number => {
  const fingerprint = ripemd160(publicKey).slice(0, 4);
  const dataView = new DataView(fingerprint.buffer);

  return dataView.getUint32(0);
};

/**
 * Add a tweak to a private key. This function throws if the result is invalid.
 *
 * @param {Uint8Array} privateKey
 * @param {Uint8Array} tweak
 * @return {Uint8Array}
 */
export const privateAdd = (privateKey: Uint8Array, tweak: Uint8Array): Uint8Array => {
  const n = secp256k1.n!;
  const bn = new BN(tweak);

  if (bn.cmp(n) >= 0) {
    throw new Error('Invalid tweak');
  }

  const add = bn.add(new BN(privateKey));
  if (add.cmp(n) >= 0) {
    const tweaked = add.sub(n);
    if (tweaked.isZero()) {
      throw new Error('Invalid resulting number');
    }

    return toBuffer(tweaked.toArray());
  }

  if (add.isZero()) {
    throw new Error('Invalid resulting number');
  }

  return toBuffer(add.toArray());
};

/**
 * Add a point to a public key. This function throws if the result is invalid.
 *
 * @param {Uint8Array} publicKey
 * @param {Uint8Array} tweak
 * @return {Uint8Array}
 */
export const publicAdd = (publicKey: Uint8Array, tweak: Uint8Array): Uint8Array => {
  const n = secp256k1.n!;
  const bn = new BN(tweak);

  if (bn.cmp(n) >= 0) {
    throw new Error('Invalid tweak');
  }

  const keyPair = secp256k1.keyFromPublic(publicKey);
  const point = keyPair.getPublic().add(secp256k1.g.mul(bn));

  if (point.isInfinity()) {
    throw new Error('Point is at infinity');
  }

  return pointToBuffer(point, true);
};
