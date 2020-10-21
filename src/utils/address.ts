import { Buffer } from 'buffer';
import { hexify } from './buffer';
import { publicToBuffer, secp256k1 } from './elliptic';
import { keccak256 } from './hash';

/**
 * Get the checksummed version of an address.
 *
 * @param {string} address
 * @return {string}
 */
export const toChecksumAddress = (address: string): string => {
  const hash = keccak256(Buffer.from(address, 'utf8')).toString('hex');

  return address.split('').reduce<string>((addressWithChecksum, character, index) => {
    if (parseInt(hash[index], 16) >= 8) {
      return addressWithChecksum + character.toUpperCase();
    }

    return addressWithChecksum + character;
  }, '0x');
};

export const getAddress = (publicKey: Buffer): string => {
  const keyPair = secp256k1.keyFromPublic(publicKey);
  const buffer = publicToBuffer(keyPair, false).subarray(1);

  const hash = hexify(keccak256(buffer).subarray(-20));
  return toChecksumAddress(hash);
};
