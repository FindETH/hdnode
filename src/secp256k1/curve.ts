import { bigIntToBuffer, bufferToBigInt } from '../utils';
import { add, power, squareRoots } from './mod';
import { Point } from './point';

/**
 * Minimal secp256k1 elliptic curve implementation. Thanks to the following projects:
 *  - https://github.com/Azero123/simple-js-ec-math
 *  - https://github.com/indutny/elliptic
 */
export interface Curve {
  readonly g: Point;
  readonly a: bigint;
  readonly b: bigint;
  readonly n: bigint;
  readonly p: bigint;
}

/**
 * Get a point from an x and y coordinate.
 *
 * @param {Buffer | bigint} x
 * @param {Buffer | bigint} y
 * @return {Point}
 */
export const getPoint = (x: Buffer | bigint, y: Buffer | bigint): Point => {
  return {
    x: typeof x === 'bigint' ? x : bufferToBigInt(x),
    y: typeof y === 'bigint' ? y : bufferToBigInt(y)
  };
};

/**
 * Get a point from an x coordinate.
 *
 * @param {Curve} curve
 * @param {Buffer} xBuffer
 * @param {boolean} isOdd
 * @return {Point}
 */
export const getPointFromX = (curve: Curve, xBuffer: Buffer, isOdd: boolean): Point => {
  const x = bufferToBigInt(xBuffer);

  const y2 = add(curve, power(curve, x, 3n), curve.b);
  const ys = squareRoots(curve, y2);

  let y = ys[1];
  if ((isOdd && y % 2n === 0n) || (!isOdd && y % 2n !== 0n)) {
    y = ys[0];
  }

  return getPoint(x, y);
};

/**
 * Decode a point from a SEC1 encoded Buffer. Throws if the format is unknown.
 *
 * @param {Curve} curve
 * @param {Buffer} bytes
 * @return {Point}
 */
export const decodePoint = (curve: Curve, bytes: Buffer): Point => {
  const length = bigIntToBuffer(curve.p).byteLength;

  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) && bytes.length - 1 === length * 2) {
    if (bytes[0] === 0x06 && bytes[bytes.length - 1] % 2 !== 0) {
      throw new Error('Unable to decode point: invalid format');
    }

    if (bytes[0] === 0x07 && bytes[bytes.length - 1] % 2 !== 1) {
      throw new Error('Unable to decode point: invalid format');
    }

    return getPoint(bytes.slice(1, length + 1), bytes.slice(length + 1, length * 2 + 1));
  }

  if ((bytes[0] === 0x02 || bytes[0] === 0x03) && bytes.length - 1 === length) {
    return getPointFromX(curve, bytes.slice(1, length + 1), bytes[0] === 0x03);
  }

  throw new Error('Unable to decode point: unknown format');
};
