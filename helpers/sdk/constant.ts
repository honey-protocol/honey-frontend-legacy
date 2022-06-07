import { PublicKey } from '@solana/web3.js';

export const HONEY_WADS = 1000000;

export const HONEY_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_HONEY_MINT ||
    'Bh7vMfPZkGsQJqUjBBGGfcAj6yQdkL8SoLtK5TCYeJtY'
);

export const HONEY_DECIMALS = 6;

export const PHONEY_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_PHONEY_MINT ||
    '7unYPivFG6cuDGeDVjhbutcjYDcMKPu2mBCnRyJ5Qki2'
);

export const WHITELIST_ENTRY = new PublicKey(
  'G62oYbYUbchjHMRddcFaDqRQ5CuNV9KE36kfzyYvFuDy'
);

export const PHONEY_DECIMALS = 6;

export const PROPOSAL_TITLE_MAX_LEN = 140;

export const GOVERNOR_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS ||
    'CSFk5VQwpQVs5tVXRLi5jtqJVkySAPxBxAQPD4W2mePa'
);

export const HONEY_MINT_WRAPPER = new PublicKey(
  process.env.NEXT_PUBLIC_HONEY_MINT_WRAPPER ||
    '9vMQwBT67tMN21BRkRoJQqJ7EaZjK3afkHFjZxTzARE7'
);
