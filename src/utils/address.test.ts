import { toChecksumAddress } from './address';

describe('toChecksumAddress', () => {
  it('returns the checksummed version of an address', () => {
    expect(toChecksumAddress('6b175474e89094c44da98b954eedeac495271d0f')).toBe(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    );
    expect(toChecksumAddress('a74476443119a942de498590fe1f2454d7d4ac0d')).toBe(
      '0xa74476443119A942dE498590Fe1f2454d7D4aC0d'
    );
  });
});
