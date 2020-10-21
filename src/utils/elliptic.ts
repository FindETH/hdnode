import { Buffer } from 'buffer';
import BN from 'bn.js';
import { curve, ec } from 'elliptic';

export const secp256k1 = new ec('secp256k1');

export const publicToBuffer = (keyPair: ec.KeyPair, compact: boolean): Buffer => {
  return Buffer.from(keyPair.getPublic(compact, 'array'));
};

export const privateToBuffer = (keyPair: ec.KeyPair): Buffer => {
  return keyPair.getPrivate().toBuffer();
};

export const pointToBuffer = (point: curve.base.BasePoint, compact: boolean): Buffer => {
  return Buffer.from(point.encode('array', compact));
};

export const compressPublicKey = (publicKey: Buffer): Buffer => {
  return publicToBuffer(secp256k1.keyFromPublic(publicKey), true);
};

export const getPublicKey = (privateKey: Buffer): Buffer => {
  return publicToBuffer(secp256k1.keyFromPrivate(privateKey), true);
};

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

    return tweaked.toBuffer();
  }

  if (add.isZero()) {
    throw new Error('Invalid resulting number');
  }

  return add.toBuffer();
};

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
