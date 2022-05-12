import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export class TokenAmount {
  constructor(public mint: PublicKey, public amount: anchor.BN) {}
}
