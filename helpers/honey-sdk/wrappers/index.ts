import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { u64 } from '@solana/spl-token';

export { HoneyClient } from './client';
export { HoneyMarket, MarketFlags, CreateMarketParams } from './market';
export { HoneyReserve, CreateReserveParams } from './reserve';
export type { ReserveConfig } from './reserve';
export { HoneyUser, SOLVENT_FEE_ACCOUNT_DEVNET, SOLVENT_PROGRAM } from './user';
export * from './derived-account';

export const PLACEHOLDER_ACCOUNT = PublicKey.default;

export type AmountUnits = { tokens?: {}; depositNotes?: {}; loanNotes?: {} };

export class Amount {
  constructor(public units: AmountUnits, public value: anchor.BN) {}

  static tokens(amount: number | u64): Amount {
    return new Amount({ tokens: {} }, new anchor.BN(amount));
  }

  static depositNotes(amount: number | u64): Amount {
    return new Amount({ depositNotes: {} }, new anchor.BN(amount));
  }

  static loanNotes(amount: number | u64): Amount {
    return new Amount({ loanNotes: {} }, new anchor.BN(amount));
  }
}
