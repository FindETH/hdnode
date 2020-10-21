import { Buffer } from 'buffer';
import createHash from 'create-hash';
import createHmac from 'create-hmac';
import createKeccakHash from 'keccak';
import { pbkdf2Sync } from 'pbkdf2';
import { hexify } from './buffer';

/**
 * Hash a buffer with provided key using HMAC-SHA512.
 *
 * @param key
 * @param buffer
 * @return {Buffer}
 */
export const hmacSHA512 = (key: Buffer, buffer: Buffer): Buffer => {
  return createHmac('sha512', key)
    .update(buffer)
    .digest();
};

/**
 * Hash a buffer using SHA256.
 *
 * @param {Buffer} buffer
 * @return {Buffer}
 */
export const sha256 = (buffer: Buffer): Buffer => {
  return createHash('sha256')
    .update(buffer)
    .digest();
};

/**
 * Hash a buffer using RIPEMD160.
 *
 * @param {Buffer} buffer
 * @return {Buffer}
 */
export const ripemd160 = (buffer: Buffer): Buffer => {
  return createHash('ripemd160')
    .update(
      createHash('sha256')
        .update(buffer)
        .digest()
    )
    .digest();
};

/**
 * Hash a buffer using KECCAK256.
 *
 * @param {Buffer} buffer
 * @return {Buffer}
 */
export const keccak256 = (buffer: Buffer): Buffer => {
  return Buffer.from(
    createKeccakHash('keccak256')
      .update(hexify(buffer), 'hex')
      .digest('hex'),
    'hex'
  );
};

/**
 * Derive a key from a buffer and salt. Defaults to 2048 iterations, 64 byte key length and SHA512 as digest.
 *
 * @param {Buffer} buffer
 * @param {Buffer} salt
 * @param {number} [iterations]
 * @param {number} [length]
 * @param {string} [digest]
 * @return {Buffer}
 */
export const pbkdf2 = (buffer: Buffer, salt: Buffer, iterations = 2048, length = 64, digest = 'sha512'): Buffer => {
  return pbkdf2Sync(buffer, salt, iterations, length, digest);
};
