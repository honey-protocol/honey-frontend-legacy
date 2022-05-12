import { PublicKey } from '@solana/web3.js';

export class DerivedAccount {
  public address: PublicKey;
  public bumpSeed: number;

  constructor(address: PublicKey, bumpSeed: number) {
    this.address = address;
    this.bumpSeed = bumpSeed;
  }
}
