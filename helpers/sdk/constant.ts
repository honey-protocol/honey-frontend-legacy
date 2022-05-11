import { PublicKey } from '@solana/web3.js';
import { buildCoderMap } from '@saberhq/anchor-contrib';
import type { GovernTypes } from '@tribecahq/tribeca-sdk';
import { GovernJSON } from '@tribecahq/tribeca-sdk';
import type { LockedVoterTypes } from 'helpers/programs/veHoney';
import { IDL } from 'helpers/types/ve_honey';

export const HONEY_WADS = 1000000;

export const HONEY_MINT = new PublicKey(
  'HonyeYAaTPgKUgQpayL914P6VAqbQZPrbkGMETZvW4iN'
);

export const HONEY_DECIMALS = 6;

export const PHONEY_MINT = new PublicKey(
  'PHnyhLEnsD9SiP9tk9kHHKiCxCTPFnymzPspDqAicMe'
);

export const WHITELIST_ENTRY = new PublicKey(
  'G62oYbYUbchjHMRddcFaDqRQ5CuNV9KE36kfzyYvFuDy'
);

export const PHONEY_DECIMALS = 6;

// See `Anchor.toml` for all addresses.
export const HONEY_DAO_ADDRESSES = {
  Govern: new PublicKey('Govz1VyoyLD5BL6CSCxUJLVLsQHRwjfFj1prNsdNg5Jw'),
  LockedVoter: new PublicKey(process.env.NEXT_PUBLIC_VOTE_PROGRAM_ID!)
};

/**
 * Program IDLs.
 */
export const HONEY_DAO_IDLS = {
  Govern: GovernJSON,
  LockedVoter: IDL
};

export const HONEY_DAO_CODERS = buildCoderMap<{
  Govern: GovernTypes;
  LockedVoter: LockedVoterTypes;
}>(HONEY_DAO_IDLS, HONEY_DAO_ADDRESSES);

export const PROPOSAL_TITLE_MAX_LEN = 140;

export const GOVERNOR_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS ||
    'CSFk5VQwpQVs5tVXRLi5jtqJVkySAPxBxAQPD4W2mePa'
);
