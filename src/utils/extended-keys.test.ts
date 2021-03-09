import { ExtendedKeyVersion } from '../types';
import { getExtendedKeyVersion, isExtendedKey } from './extended-keys';

describe('isExtendedKey', () => {
  it('returns true if a key is an extended key', () => {
    expect(
      isExtendedKey(
        'xpub6DreGKvTo5gf1tXu5N86sz922cFfACvEj8oUrL1nJAbngaMriFQDYk3vA1vpXXGyD5MtH2tbQ8JJScFki5TNSJtRF9T2Qq6ZNLSDhRk2bqc'
      )
    ).toBe(true);
    expect(
      isExtendedKey(
        'xprv9zsHrpPZxi8MoQTRyLb6WrCHUaRAkkCPMust3wcAjq4oon2iAi5xzwjSJjTZPjnZ3dqVRni3hhnmwxUrRsj4JCwyYdvqbAdPSJLdN1AFwsN'
      )
    ).toBe(true);
  });

  it('returns false for keys with an invalid length', () => {
    expect(isExtendedKey('43bZJcTX6tt')).toBe(false);
  });

  it('returns false for keys with an invalid checksum', () => {
    expect(
      isExtendedKey(
        'xpub6DreGKvTo5gf1tXu5N86sz922cFfACvEj8oUrL1nJAbngaMriFQDYk3vA1vpXXGyD5MtH2tbQ8JJScFki5TNSJtRF9T2Qq6ZNLSDhRkffff'
      )
    ).toBe(false);
  });

  it('returns false for keys with an invalid version', () => {
    expect(
      isExtendedKey(
        '4s9bfpMBcCUk2NSCJ4m8qQrpGFvx8ymXsvaoRr2j7Z7gC7D79nozWrVUGfxfF9yqe6WS9aP4Smob6wa65qnJgviCZ9Uv5NzcPe4hhP3BdS9eXJzo'
      )
    ).toBe(false);
  });
});

describe('getExtendedKeyVersion', () => {
  it('returns ExtendedKeyVersion.Public for extended public keys', () => {
    expect(
      getExtendedKeyVersion(
        'xpub6DreGKvTo5gf1tXu5N86sz922cFfACvEj8oUrL1nJAbngaMriFQDYk3vA1vpXXGyD5MtH2tbQ8JJScFki5TNSJtRF9T2Qq6ZNLSDhRk2bqc'
      )
    ).toBe(ExtendedKeyVersion.Public);
  });

  it('returns ExtendedKeyVersion.Private for extended private keys', () => {
    expect(
      getExtendedKeyVersion(
        'xprv9zsHrpPZxi8MoQTRyLb6WrCHUaRAkkCPMust3wcAjq4oon2iAi5xzwjSJjTZPjnZ3dqVRni3hhnmwxUrRsj4JCwyYdvqbAdPSJLdN1AFwsN'
      )
    ).toBe(ExtendedKeyVersion.Private);
  });

  it('throws for invalid versions', () => {
    expect(() =>
      getExtendedKeyVersion(
        '4s9bfpMBcCUk2NSCJ4m8qQrpGFvx8ymXsvaoRr2j7Z7gC7D79nozWrVUGfxfF9yqe6WS9aP4Smob6wa65qnJgviCZ9Uv5NzcPe4hhP3BdS9eXJzo'
      )
    ).toThrow();
  });
});
