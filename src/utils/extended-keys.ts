import { PRIVATE_KEY_VERSION, PUBLIC_KEY_VERSION } from '../constants';
import { ExtendedKeyVersion } from '../types';
import { decodeBase58 } from './base58';

export const isExtendedKey = (extendedKey: string): boolean => {
  try {
    const buffer = decodeBase58(extendedKey);
    const dataView = new DataView(buffer.buffer);

    if (buffer.length !== 78) {
      return false;
    }

    const version = dataView.getUint32(0);
    if (version !== PUBLIC_KEY_VERSION && version !== PRIVATE_KEY_VERSION) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

export const getExtendedKeyVersion = (extendedKey: string): ExtendedKeyVersion => {
  const buffer = decodeBase58(extendedKey);
  const dataView = new DataView(buffer.buffer);

  const version = dataView.getUint32(0);
  if (version === PUBLIC_KEY_VERSION) {
    return ExtendedKeyVersion.Public;
  }

  if (version === PRIVATE_KEY_VERSION) {
    return ExtendedKeyVersion.Private;
  }

  throw new Error('Invalid extended key: expected public or private version');
};
