import bip32 from './__fixtures__/bip-32.json';
import bip39 from './__fixtures__/bip-39.json';
import { HDNode } from './hdnode';
import { fromHex } from './utils';

/**
 * Test vectors using mnemonic phrases, as defined in the reference implementation if BIP-39.
 *
 * https://github.com/trezor/python-mnemonic/blob/b502451a33a440783926e04428115e0bed87d01f/vectors.json
 */

describe('HDNode', () => {
  describe('extendedPrivateKey', () => {
    it('returns the serialised extended private key', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);

        expect(hdNode.extendedPrivateKey).toBe(vector.expected.master.private);
      }
    });

    it('throws if no private key is set', () => {
      const hdNode = HDNode.fromExtendedKey(
        'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'
      );
      expect(() => hdNode.extendedPrivateKey).toThrow();
    });
  });

  describe('extendedPublicKey', () => {
    it('returns the serialised extended public key', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);

        expect(hdNode.extendedPublicKey).toBe(vector.expected.master.public);
      }
    });
  });

  describe('derive', () => {
    it('returns the same instance when deriving a master key', () => {
      const hdNode = HDNode.fromExtendedKey(
        'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'
      );
      expect(hdNode.derive('m')).toBe(hdNode);
      expect(hdNode.derive('M')).toBe(hdNode);
    });

    it('throws if the derivation path is invalid', () => {
      const hdNode = HDNode.fromExtendedKey(
        'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'
      );
      expect(() => hdNode.derive('m/')).toThrow();
      expect(() => hdNode.derive('0/0')).toThrow();
      expect(() => hdNode.derive("m/0'/'0")).toThrow();
    });

    it('throws when deriving a hardened index without private key', () => {
      const hdNode = HDNode.fromExtendedKey(
        'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'
      );
      expect(() => hdNode.derive("m/0'")).toThrow();
      expect(() => hdNode.derive("0/0/0'")).toThrow();
      expect(() => hdNode.derive("m/0'/0/0'")).toThrow();
    });

    it('derives a child extended private key based on a derivation path', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);

        Object.entries(vector.expected.levels).forEach(([path, value]) => {
          expect(hdNode.derive(path).extendedPrivateKey).toBe(value!.private);
        });
      }
    });

    it('derives a child extended public key based on a derivation path', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);

        Object.entries(vector.expected.levels).forEach(([path, value]) => {
          expect(hdNode.derive(path).extendedPublicKey).toBe(value!.public);
        });
      }
    });
  });

  describe('address', () => {
    it('returns the correct Ethereum address', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);

        Object.entries(vector.expected.levels).forEach(([path, value]) => {
          expect(hdNode.derive(path).address).toBe(value!.address);
        });
      }
    });
  });

  describe('fromMnemonicPhrase', () => {
    it('returns an instance of HDNode from a mnemonic phrase', () => {
      for (const vectors of bip39) {
        const hdNode = HDNode.fromMnemonicPhrase(vectors.mnemonic, 'TREZOR');
        expect(hdNode.extendedPrivateKey).toBe(vectors.extendedPrivateKey);
      }
    });
  });

  describe('fromExtendedKey', () => {
    it('throws if the key is not 78 bytes long', () => {
      expect(() => HDNode.fromExtendedKey('SQHFQMRT97ajZaP')).toThrow();
    });

    it('throws if the version is invalid', () => {
      expect(() =>
        HDNode.fromExtendedKey(
          'q96eN3qvaGTdfJe5BDJaAGu7aFmt8eJu5Mfx9NXmUaDvoxhm7pHkpekoS3b92Y11jXFZY7c9WRCJg8PVDGeJgXbNGmYpp1JpfHbALB4HWg7dmwnA'
        )
      ).toThrow();
    });

    it('returns an instance of HDNode from an extended private key', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);
        const hdNodeFromXpriv = HDNode.fromExtendedKey(vector.expected.master.private);

        expect(hdNode.extendedPrivateKey).toBe(hdNodeFromXpriv.extendedPrivateKey);
      }
    });

    it('returns an instance of HDNode from an extended public key', () => {
      for (const vector of bip32) {
        const seed = fromHex(vector.seed);
        const hdNode = HDNode.fromSeed(seed);
        const hdNodeFromXpub = HDNode.fromExtendedKey(vector.expected.master.public);

        expect(hdNode.extendedPublicKey).toBe(hdNodeFromXpub.extendedPublicKey);
      }
    });
  });
});
