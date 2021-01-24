import { fromUtf8, toHex } from './buffer';
import { decompressPublicKey } from './elliptic';
import { keccak256 } from './hash';

/**
 * Get the checksummed version of an address.
 *
 * @param {string} address
 * @return {string}
 */
export const toChecksumAddress = (address: string): string => {
  const hash = toHex(keccak256(fromUtf8(address)));

  return address.split('').reduce<string>((addressWithChecksum, character, index) => {
    if (parseInt(hash[index], 16) >= 8) {
      return addressWithChecksum + character.toUpperCase();
    }

    return addressWithChecksum + character;
  }, '0x');
};

/**
 * Get the Ethereum address for a public key.
 *
 * @param {Buffer} publicKey
 * @return {string}
 */
export const getAddress = (publicKey: Uint8Array): string => {
  const buffer = decompressPublicKey(publicKey).subarray(1);

  const hash = toHex(keccak256(buffer).subarray(-20));
  return toChecksumAddress(hash);
};
