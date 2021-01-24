import getRandomValues from 'get-random-values';

export type BinaryLike = string | ArrayBufferLike | number[];

export const HEX_REGEX = /^[a-f0-9]+$/i;

/**
 * Returns an instance of `TextEncoder` that works with both Node.js and web browsers.
 *
 * @return {TextEncoder}
 */
export const getTextEncoder = (): TextEncoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Encoder = require('util').TextEncoder;
    return new Encoder();
  }

  return new TextEncoder();
};

/**
 * Returns an instance of `TextDecoder` that works with both Node.js and web browsers.
 *
 * @return {TextDecoder}
 */
export const getTextDecoder = (encoding = 'utf8'): TextDecoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Decoder = require('util').TextDecoder;
    return new Decoder(encoding);
  }

  return new TextDecoder(encoding);
};

/**
 * Get a Uint8Array as hexadecimal string
 *
 * @param {Uint8Array} data
 * @return {string}
 */
export const toHex = (data: Uint8Array): string => {
  return Array.from(data)
    .map((n) => `0${n.toString(16)}`.slice(-2))
    .join('');
};

/**
 * Get a hexadecimal string as Uint8Array.
 *
 * @param {string} data
 * @return {Uint8Array}
 */
export const fromHex = (data: string): Uint8Array => {
  if (data.startsWith('0x')) {
    data = data.slice(2);
  }

  if (data.length % 2 !== 0) {
    throw new Error('Length must be even');
  }

  if (!data.match(HEX_REGEX)) {
    throw new Error('Input must be hexadecimal');
  }

  return new Uint8Array(data.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};

/**
 * Attempt to parse a value as Uint8Array.
 *
 * @param {BinaryLike} data
 * @return {Uint8Array}
 */
export const toBuffer = (data: BinaryLike): Uint8Array => {
  if (typeof data === 'string') {
    return fromHex(data);
  }

  return new Uint8Array(data);
};

/**
 * Get a buffer as UTF-8 encoded string.
 *
 * @param {Uint8Array} data
 * @return {string}
 */
export const toUtf8 = (data: Uint8Array): string => {
  return getTextDecoder().decode(data);
};

/**
 * Get a UTF-8 encoded string as buffer.
 *
 * @param {string} data
 * @return {Uint8Array}
 */
export const fromUtf8 = (data: string): Uint8Array => {
  return getTextEncoder().encode(data);
};

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

/**
 * Safe function to merge multiple Uint8Arrays into a single Uint8array.
 *
 * @param {Uint8Array[]} buffers
 * @return {Uint8Array}
 */
export const concat = (buffers: Uint8Array[]): Uint8Array => {
  return buffers.reduce((a, b) => {
    const buffer = new Uint8Array(a.length + b.length);
    buffer.set(a);
    buffer.set(b, a.length);

    return buffer;
  }, new Uint8Array(0));
};

export const getRandomBytes = (length: number): Uint8Array => {
  return getRandomValues(new Uint8Array(length));
};
