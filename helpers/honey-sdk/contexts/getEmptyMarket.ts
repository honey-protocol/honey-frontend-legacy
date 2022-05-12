import { PublicKey } from '@solana/web3.js';
import { Market } from '../helpers/honeyTypes';

export const getEmptyMarketState = (): Market => ({
  marketInit: false,
  accountPubkey: PublicKey.default,
  authorityPubkey: PublicKey.default,
  minColRatio: 0,
  programMinColRatio: 0,
  totalValueLocked: 0,
  reserves: {},
  reservesArray: [],
  nativeValues: false,
  rerender: false,
});
