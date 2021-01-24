import { fromHex, toHex } from '../utils';
import bip39 from './__fixtures__/bip-39.json';
import {
  entropyToMnemonic,
  generateMnemonic,
  isValidMnemonic,
  mnemonicToEntropy,
  mnemonicToSeed
} from './mnemonic-phrase';

describe('generateMnemonic', () => {
  it('generates a mnemonic phrase based on the specified number of bits', () => {
    expect(generateMnemonic(128).split(' ')).toHaveLength(12);
    expect(generateMnemonic(256).split(' ')).toHaveLength(24);
  });

  it('throws if the number of bits is not in 128-256', () => {
    expect(() => generateMnemonic(127)).toThrow();
    expect(() => generateMnemonic(257)).toThrow();
    expect(() => generateMnemonic(128)).not.toThrow();
    expect(() => generateMnemonic(256)).not.toThrow();
  });

  it('throws if the number of bits is not a multiple of 32', () => {
    expect(() => generateMnemonic(129)).toThrow();
    expect(() => generateMnemonic(255)).toThrow();
    expect(() => generateMnemonic(160)).not.toThrow();
    expect(() => generateMnemonic(224)).not.toThrow();
  });
});

describe('entropyToMnemonic', () => {
  it('generates a mnemonic phrase from pre-generated entropy', () => {
    for (const vector of bip39) {
      const entropy = fromHex(vector.entropy);
      expect(entropyToMnemonic(entropy)).toBe(vector.mnemonic);
    }
  });
});

describe('mnemonicToSeed', () => {
  it('derives a seed from a mnemonic phrase with a passphrase', () => {
    for (const vector of bip39) {
      // TREZOR is a hardcoded passphrase used in the test vectors
      expect(toHex(mnemonicToSeed(vector.mnemonic, 'TREZOR'))).toBe(vector.seed);
    }
  });

  it('derives a seed from a mnemonic phrase without a passphrase', () => {
    expect(
      toHex(
        mnemonicToSeed('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about')
      )
    ).toBe(
      '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4'
    );
    expect(
      toHex(
        mnemonicToSeed(
          'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon agent'
        )
      )
    ).toBe(
      '4975bb3d1faf5308c86a30893ee903a976296609db223fd717e227da5a813a34dc1428b71c84a787fc51f3b9f9dc28e9459f48c08bd9578e9d1b170f2d7ea506'
    );
  });
});

describe('mnemonicToEntropy', () => {
  it('gets the entropy used to generate a mnemonic phrase', () => {
    for (const vector of bip39) {
      expect(toHex(mnemonicToEntropy(vector.mnemonic))).toBe(vector.entropy);
    }
  });

  it('throws on invalid mnemonic phrase lengths', () => {
    expect(() =>
      mnemonicToEntropy('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon')
    ).toThrow();
    expect(() => mnemonicToEntropy('abandon')).toThrow();
    expect(() =>
      mnemonicToEntropy(
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about abandon'
      )
    ).toThrow();
  });

  it('throws on invalid words', () => {
    expect(() =>
      mnemonicToEntropy(
        'non-existent abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      )
    ).toThrow();
  });

  it('throws on invalid checksums', () => {
    expect(() =>
      mnemonicToEntropy(
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon'
      )
    ).toThrow();
  });
});

describe('isValidMnemonic', () => {
  it('returns true for valid mnemonic phrases', () => {
    for (const vector of bip39) {
      expect(isValidMnemonic(vector.mnemonic)).toBe(true);
    }
  });

  it('returns false for invalid mnemonic phrases', () => {
    expect(
      isValidMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon')
    ).toBe(false);
    expect(isValidMnemonic('abandon')).toBe(false);
    expect(
      isValidMnemonic(
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about abandon'
      )
    ).toBe(false);
    expect(
      isValidMnemonic(
        'non-existent abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      )
    ).toBe(false);
    expect(
      isValidMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon')
    ).toBe(false);
  });
});
