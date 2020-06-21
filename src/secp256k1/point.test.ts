import { decodePoint } from './curve';
import { add, double, multiply, toBuffer } from './point';
import { secp256k1 } from './secp256k1';

describe('Point', () => {
  describe('add', () => {
    it('adds two points together', () => {
      const pointA = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );
      const pointB = decodePoint(
        secp256k1,
        Buffer.from('035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56', 'hex')
      );

      const point = add(secp256k1, pointA, pointB);
      expect(point.x).toBe(30347998096256373417869144279771261154180190543642016013579316471304529781780n);
      expect(point.y).toBe(9392405118907549772448249508043265569334782979219281543580438963582337328692n);
    });

    it('doubles a point if the points are the same', () => {
      const pointA = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );

      const point = add(secp256k1, pointA, pointA);
      expect(point).toStrictEqual(double(secp256k1, pointA));
    });
  });

  describe('double', () => {
    it('doubles a point', () => {
      const pointA = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );

      const point = double(secp256k1, pointA);
      expect(point.x).toBe(15537987317735321484116756156249768232803261060139213815428426931865346578867n);
      expect(point.y).toBe(89090042842010279433718918067096607650843661129351341187282994481688340724601n);
    });
  });

  describe('multiply', () => {
    it('multiplies a point by a value', () => {
      const pointA = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );

      const point = multiply(
        secp256k1,
        pointA,
        89090042842010279433718918067096607650843661129351341187282994481688340724601n
      );
      expect(point.x).toBe(56249009657808971414933312489914540557693461263082993510569303810732209554300n);
      expect(point.y).toBe(39678295885018172515793274498213993988138581698582319749269834919423055854578n);
    });

    it('returns the same point if the value is 1', () => {
      const pointA = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );

      const point = multiply(secp256k1, pointA, 1n);
      expect(point).toBe(pointA);
    });
  });

  describe('toBuffer', () => {
    it('returns the point as compressed SEC1 encoded buffer', () => {
      const point = decodePoint(
        secp256k1,
        Buffer.from(
          '046557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f259a34ffdc4c82e5cb68a96ccc6cb53e8765527148d1a85b52dfb8953d8d001fc',
          'hex'
        )
      );

      expect(toBuffer(secp256k1, point, true)).toStrictEqual(
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );
    });

    it('returns the point as uncompressed SEC1 encoded buffer', () => {
      const point = decodePoint(
        secp256k1,
        Buffer.from('026557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f2', 'hex')
      );

      expect(toBuffer(secp256k1, point, false)).toStrictEqual(
        Buffer.from(
          '046557fdda1d5d43d79611f784780471f086d58e8126b8c40acb82272a7712e7f259a34ffdc4c82e5cb68a96ccc6cb53e8765527148d1a85b52dfb8953d8d001fc',
          'hex'
        )
      );
    });
  });
});
