import { bigIntToBuffer, bufferToBigInt } from '../utils';
import { Curve } from './curve';
import { divide, mod, multiply as modMultiply, subtract } from './mod';

/**
 * A point on an elliptic curve.
 */
export interface Point {
  readonly x: bigint;
  readonly y: bigint;
}

/**
 * Add two points together. Returns a new point.
 *
 * @param {Curve} curve
 * @param {Point} left
 * @param {Point} right
 * @return {Point}
 */
export const add = (curve: Curve, left: Point, right: Point): Point => {
  if (isEqual(left, right)) {
    return double(curve, left);
  }

  const ys = subtract(curve, right.y, left.y);
  const xs = subtract(curve, right.x, left.x);
  const s = divide(curve, ys, xs);

  const x = subtract(curve, subtract(curve, modMultiply(curve, s, s), left.x), right.x);
  const y = subtract(curve, modMultiply(curve, s, subtract(curve, left.x, x)), left.y);

  return {
    x,
    y
  };
};

/**
 * Doubles the point provided. Returns a new point.
 *
 * @param {Curve} curve
 * @param {Point} point
 * @return {Point}
 */
export const double = (curve: Curve, point: Point): Point => {
  const sn = point.x ** 2n * 3n + curve.a;
  const sd = 2n * point.y;
  const s = divide(curve, sn, sd);

  const x = mod(curve, s ** 2n - point.x * 2n);
  const y = mod(curve, s * (point.x - x) - point.y);

  return {
    x,
    y
  };
};

/**
 * Multiply a point by a bigint or Buffer. If the value is `1`, the same point will be returned. Otherwise, it returns a
 * new point.
 *
 * @param {Curve} curve
 * @param {Point} point
 * @param {Buffer | bigint} value
 */
export const multiply = (curve: Curve, point: Point, value: Buffer | bigint): Point => {
  if (typeof value !== 'bigint') {
    value = bufferToBigInt(value);
  }

  if (value === 1n) {
    return point;
  }

  const s = value.toString(2);
  const binaryLength = s.length - 1;

  const addings: Point[] = [];
  for (let i = binaryLength; i >= 0; i--) {
    const char = s[i];
    if (char === '1') {
      addings.push(point);
    }

    point = double(curve, point);
  }

  let newPoint = addings[0];
  addings.shift();
  while (addings[0]) {
    newPoint = add(curve, newPoint, addings[0]);
    addings.shift();
  }

  return newPoint;
};

/**
 * Get a point as a SEC1 encoded Buffer.
 *
 * @param {Curve} curve
 * @param {Point} point
 * @param {boolean} compact
 * @return {Buffer}
 */
export const toBuffer = (curve: Curve, point: Point, compact = false): Buffer => {
  const length = Buffer.from(curve.p.toString(16), 'hex').byteLength;
  const x = bigIntToBuffer(point.x, length);

  if (compact) {
    const isEven = point.y % 2n === 0n;
    return Buffer.concat([Buffer.from([isEven ? 0x02 : 0x03]), x]);
  }

  const y = bigIntToBuffer(point.y, length);

  return Buffer.concat([Buffer.from([0x04]), x, y]);
};

/**
 * Check if two points are equal.
 *
 * @param {Point} left
 * @param {Point} right
 * @return {boolean}
 */
export const isEqual = (left: Point, right: Point): boolean => {
  return left.x === right.x && left.y === right.y;
};
