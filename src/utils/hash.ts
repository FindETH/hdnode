import { BinaryLike, fromHex, toBuffer, toHex } from '@findeth/abi';
import createHash from 'create-hash';
import createHmac from 'create-hmac';
import createKeccakHash from 'keccak';
import { pbkdf2Sync } from 'pbkdf2';

/**
 * Hash a buffer with provided key using HMAC-SHA512.
 *
 * @param {Uint8Array} key
 * @param {Uint8Array} buffer
 * @return {Uint8Array}
 */
export const hmacSHA512 = (key: Uint8Array, buffer: Uint8Array): Uint8Array => {
  // eslint-disable-next-line no-restricted-globals
  return createHmac('sha512', Buffer.from(key)).update(buffer).digest();
};

/**
 * Hash a buffer using SHA256.
 *
 * @param {Uint8Array} buffer
 * @return {Uint8Array}
 */
export const sha256 = (buffer: Uint8Array): Uint8Array => {
  return createHash('sha256').update(buffer).digest();
};

/**
 * Hash a buffer using RIPEMD160.
 *
 * @param {Uint8Array} buffer
 * @return {Uint8Array}
 */
export const ripemd160 = (buffer: Uint8Array): Uint8Array => {
  return createHash('ripemd160').update(createHash('sha256').update(buffer).digest()).digest();
};

/**
 * Returns the Keccak-256 hash of a string, as a hexadecimal string.
 *
 * @param {string} input
 * @return {string}
 */
export const keccak256 = (input: BinaryLike): Uint8Array => {
  const buffer = toBuffer(input);
  return fromHex(createKeccakHash('keccak256').update(toHex(buffer), 'hex').digest('hex'));
};

/**
 * Derive a key from a buffer and salt. Defaults to 2048 iterations, 64 byte key length and SHA512 as digest.
 *
 * @param {Uint8Array} buffer
 * @param {Uint8Array} salt
 * @param {number} [iterations]
 * @param {number} [length]
 * @param {string} [digest]
 * @return {Uint8Array}
 */
export const pbkdf2 = (
  buffer: Uint8Array,
  salt: Uint8Array,
  iterations = 2048,
  length = 64,
  digest = 'sha512'
): Uint8Array => {
  return pbkdf2Sync(buffer, salt, iterations, length, digest);
};
