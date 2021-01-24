import { fromUtf8 } from './utils/buffer';

export const MASTER_KEY = fromUtf8('Bitcoin seed');
export const PUBLIC_KEY_VERSION = 0x0488b21e;
export const PRIVATE_KEY_VERSION = 0x0488ade4;
export const HARDENED_OFFSET = 0x80000000;
export const DERIVATION_PATH = /^[mM](?:\/[0-9]+'?)*$/;
