import { DERIVATION_PATH, HARDENED_OFFSET, MASTER_KEY, PRIVATE_KEY_VERSION, PUBLIC_KEY_VERSION } from './constants';
import { isValidMnemonic, mnemonicToSeed } from './mnemonics';
import {
  decodeBase58,
  fromHex,
  encodeBase58,
  getAddress,
  getIndex,
  numberToBuffer,
  compressPublicKey,
  getPublicKey,
  privateAdd,
  publicAdd,
  hmacSHA512,
  toBuffer,
  getFingerprint,
  concat
} from './utils';

export interface ExtendedPublicKey {
  publicKey: string;
  chainCode: string;
}

export class HDNode {
  /**
   * Get an instance of HDNode from a mnemonic phrase.
   *
   * @param {string} mnemonicPhrase
   * @param {string} [passphrase]
   * @return {HDNode}
   */
  static fromMnemonicPhrase(mnemonicPhrase: string, passphrase?: string): HDNode {
    if (!isValidMnemonic(mnemonicPhrase)) {
      throw new Error('Mnemonic phrase is invalid');
    }

    return this.fromSeed(mnemonicToSeed(mnemonicPhrase, passphrase));
  }

  /**
   * Get an instance of HDNode from an arbitrary seed.
   *
   * @param {string | ArrayBufferLike} seed
   * @return {HDNode}
   */
  static fromSeed(seed: string | ArrayBufferLike): HDNode {
    const buffer = hmacSHA512(MASTER_KEY, toBuffer(seed));

    const privateKey = buffer.slice(0, 32);
    const publicKey = getPublicKey(privateKey);
    const chainCode = buffer.slice(32);

    return new HDNode(0x0, 0x0, chainCode, publicKey, privateKey);
  }

  /**
   * Get an instance of HDNode from a parent extended public key and child extended public key.
   *
   * @param {string} derivationPath
   * @param {ExtendedPublicKey} parentKey
   * @param {ExtendedPublicKey} childKey
   */
  static fromParentChildKey(derivationPath: string, parentKey: ExtendedPublicKey, childKey: ExtendedPublicKey): HDNode {
    const levels = derivationPath.split('/');

    const publicKey = compressPublicKey(fromHex(childKey.publicKey));
    const chainCode = fromHex(childKey.chainCode);
    const parentFingerprint = getFingerprint(fromHex(parentKey.publicKey));
    const index = getIndex(levels.slice(-1)[0]);

    return new HDNode(levels.length, index, chainCode, publicKey, undefined, parentFingerprint);
  }

  /**
   * Get an instance of HDNode from an extended public or private key.
   *
   * @param {string} extendedKey
   * @return {HDNode}
   */
  static fromExtendedKey(extendedKey: string): HDNode {
    const buffer = decodeBase58(extendedKey);
    const dataView = new DataView(buffer.buffer);

    if (buffer.length !== 78) {
      throw new Error(`Invalid extended key: expected length 78, got ${buffer.length}`);
    }

    const version = dataView.getUint32(0);
    if (version !== PUBLIC_KEY_VERSION && version !== PRIVATE_KEY_VERSION) {
      throw new Error('Invalid extended key: expected public or private version');
    }

    const depth = dataView.getUint8(4);
    const parentFingerprint = dataView.getUint32(5);
    const index = dataView.getUint32(9);
    const chainCode = buffer.slice(13, 45);
    const key = buffer.slice(45);

    if (version === PRIVATE_KEY_VERSION) {
      const privateKey = key.subarray(1);
      const publicKey = getPublicKey(privateKey);
      return new HDNode(depth, index, chainCode, publicKey, privateKey, parentFingerprint);
    }

    return new HDNode(depth, index, chainCode, key);
  }

  readonly fingerprint: number;

  constructor(
    readonly depth: number,
    readonly index: number,
    readonly chainCode: Uint8Array,
    readonly publicKey: Uint8Array,
    readonly privateKey?: Uint8Array,
    readonly parentFingerprint: number = 0
  ) {
    this.fingerprint = getFingerprint(publicKey);
  }

  /**
   * Extended public key serialised as base58 string.
   */
  get extendedPublicKey(): string {
    return this.serialise(PUBLIC_KEY_VERSION, this.publicKey);
  }

  /**
   * Extended private key serialised as base58 string.
   */
  get extendedPrivateKey(): string {
    if (!this.privateKey) {
      throw new Error('No private key');
    }

    return this.serialise(PRIVATE_KEY_VERSION, concat([new Uint8Array([0x00]), this.privateKey]));
  }

  /**
   * Checksummed Ethereum address
   *
   * @return {string}
   */
  get address(): string {
    return getAddress(this.publicKey);
  }

  /**
   * Derive a child key from this node. If the path is 'm' or 'M", the same HDNode is returned.
   *
   * @param {string} path
   * @return {HDNode}
   */
  derive(path: string): HDNode {
    if (path.toLowerCase() === 'm') {
      return this;
    }

    if (!path.match(DERIVATION_PATH)) {
      throw new Error('Invalid derivation path');
    }

    const segments = path.split('/').slice(1);

    return segments.reduce<HDNode>((hdNode, segment) => {
      const isHardened = segment.endsWith("'");
      const index = parseInt(segment, 10);

      if (isHardened) {
        return hdNode.deriveChild(index + HARDENED_OFFSET);
      }

      return hdNode.deriveChild(index);
    }, this);
  }

  /**
   * Derive a child node based on an index.
   *
   * @param {number} index
   * @return {HDNode}
   */
  private deriveChild(index: number): HDNode {
    const data = this.getChildData(index);

    const I = hmacSHA512(this.chainCode, data);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    if (this.privateKey) {
      try {
        const privateKey = privateAdd(this.privateKey, IL);
        const publicKey = getPublicKey(privateKey);

        return new HDNode(this.depth + 1, index, IR, publicKey, privateKey, this.fingerprint);
      } catch {
        // If `privateAdd` throws, derive next index instead
        return this.deriveChild(index + 1);
      }
    }

    try {
      const publicKey = publicAdd(this.publicKey, IL);
      return new HDNode(this.depth + 1, index, IR, publicKey, undefined, this.fingerprint);
    } catch {
      // If `publicAdd` throws, derive next index instead
      return this.deriveChild(index + 1);
    }
  }

  /**
   * Get child data used for derivation of child keys.
   *
   * @param {number} index
   * @return {Buffer}
   */
  private getChildData(index: number): Uint8Array {
    const indexBuffer = numberToBuffer(index, 4);

    if (index >= HARDENED_OFFSET) {
      if (!this.privateKey) {
        throw new Error('Cannot derive a hardened child key without a private key');
      }

      return concat([new Uint8Array([0x00]), this.privateKey, indexBuffer]);
    }

    return concat([this.publicKey, indexBuffer]);
  }

  /**
   * Serialise the node as base58 string.
   *
   * @param {number} version
   * @param {Buffer} key
   * @return {string}
   */
  private serialise(version: number, key: Uint8Array): string {
    const versionBuffer = numberToBuffer(version, 4);
    const depth = numberToBuffer(this.depth, 1);
    const parentFingerprint = numberToBuffer(this.parentFingerprint, 4);
    const index = numberToBuffer(this.index, 4);

    const buffer = concat([versionBuffer, depth, parentFingerprint, index, this.chainCode, key]);

    return encodeBase58(buffer);
  }
}
