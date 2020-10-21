declare module 'keccak' {
  import { Buffer } from 'buffer';

  type Algorithm =
    | 'keccak224'
    | 'keccak256'
    | 'keccak384'
    | 'keccak512'
    | 'sha3-224'
    | 'sha3-256'
    | 'sha3-384'
    | 'sha3-512'
    | 'shake128'
    | 'shake256';

  class Keccak {
    update(data: Buffer): Keccak;
    update(data: string, encoding: string): Keccak;

    digest(): Buffer;
    digest(encoding: string): string;
  }

  export default function createKeccakHash(algorithm: Algorithm): Keccak;
}
