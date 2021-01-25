import getRandomValues from 'get-random-values';

export { stripPrefix, toUtf8, fromUtf8, toHex, fromHex, toBuffer, concat } from '@findeth/abi';

/**
 * Write a number to a Uint8Array with arbitrary length.
 *
 * @param {number} data
 * @param {number} byteLength
 * @return {Uint8Array}
 */
export const numberToBuffer = (data: number, byteLength: 1 | 2 | 4): Uint8Array => {
  const buffer = new ArrayBuffer(byteLength);
  const dataView = new DataView(buffer);

  switch (byteLength) {
    case 1:
      dataView.setUint8(0, data);
      break;
    case 2:
      dataView.setUint16(0, data);
      break;
    case 4:
      dataView.setUint32(0, data);
      break;
  }

  return new Uint8Array(dataView.buffer);
};

export const getRandomBytes = (length: number): Uint8Array => {
  return getRandomValues(new Uint8Array(length));
};
