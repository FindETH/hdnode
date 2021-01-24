import baseX from 'base-x';
import { concat, toBuffer } from './buffer';
import { sha256 } from './hash';

const BASE_58_CHARACTERS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export const base58 = baseX(BASE_58_CHARACTERS);

/**
 * Encode a Buffer as Base58 string with a checksum applied.
 *
 * @param {Buffer} data
 * @return {string}
 */
export const encodeBase58 = (data: Uint8Array): string => {
  const checksum = sha256(sha256(data)).slice(0, 4);

  return base58.encode(concat([data, checksum]));
};

/**
 * Decode a Base58 string to a Buffer. Throws an error if the checksum is invalid.
 *
 * @param {string} encoded
 * @return {Buffer}
 */
export const decodeBase58 = (encoded: string): Uint8Array => {
  const buffer = base58.decode(encoded);

  const data = buffer.slice(0, -4);
  const checksum = buffer.slice(-4);
  const newChecksum = sha256(sha256(data)).slice(0, 4);

  if (checksum.compare(newChecksum) !== 0) {
    throw new Error('Invalid checksum');
  }

  return toBuffer(data);
};
