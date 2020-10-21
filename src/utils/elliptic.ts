import { Buffer } from 'buffer';
import BN from 'bn.js';
import { curve, ec } from 'elliptic';

export const secp256k1 = new ec('secp256k1');

/**
 * Get a buffer for a public key.
 *
 * @param {ec.KeyPair} keyPair
 * @param {boolean} compact
 * @return {Buffer}
 */
export const publicToBuffer = (keyPair: ec.KeyPair, compact: boolean): Buffer => {
  return Buffer.from(keyPair.getPublic(compact, 'array'));
};

/**
 * Get a buffer for a private key.
 *
 * @param {ec.KeyPair} keyPair
 * @return {Buffer}
 */
export const privateToBuffer = (keyPair: ec.KeyPair): Buffer => {
  return keyPair.getPrivate().toBuffer();
};

/**
 * Get a buffer for a point.
 *
 * @param {curve.base.BasePoint} point
 * @param {boolean} compact
 * @return {Buffer}
 */
export const pointToBuffer = (point: curve.base.BasePoint, compact: boolean): Buffer => {
  return Buffer.from(point.encode('array', compact));
};

/**
 * Compress a public key. This function takes both compressed and uncompressed public keys, and always returns the
 * compressed variant.
 *
 * @param publicKey
 */
export const compressPublicKey = (publicKey: Buffer): Buffer => {
  return publicToBuffer(secp256k1.keyFromPublic(publicKey), true);
};

/**
 * Decompress a public key. This function takes both compressed and uncompressed public keys, and always returns the
 * decompressed variant.
 *
 * @param {Buffer} publicKey
 * @return {Buffer}
 */
export const decompressPublicKey = (publicKey: Buffer): Buffer => {
  return publicToBuffer(secp256k1.keyFromPublic(publicKey), false);
};

/**
 * Get the public key for a private key.
 *
 * @param {Buffer} privateKey
 * @return {Buffer}
 */
export const getPublicKey = (privateKey: Buffer): Buffer => {
  return publicToBuffer(secp256k1.keyFromPrivate(privateKey), true);
};

/**
 * Add a tweak to a private key. This function throws if the result is invalid.
 *
 * @param {Buffer} privateKey
 * @param {Buffer} tweak
 * @return {Buffer}
 */
export const privateAdd = (privateKey: Buffer, tweak: Buffer): Buffer => {
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

    return Buffer.from(tweaked.toArray());
  }

  if (add.isZero()) {
    throw new Error('Invalid resulting number');
  }

  return Buffer.from(add.toArray());
};

/**
 * Add a point to a public key. This function throws if the result is invalid.
 *
 * @param {Buffer} publicKey
 * @param {Buffer} tweak
 * @return {Buffer}
 */
export const publicAdd = (publicKey: Buffer, tweak: Buffer): Buffer => {
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
