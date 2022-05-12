import { HoneyReserve, Reserve } from '..';
import * as anchor from '@project-serum/anchor';
import { TokenAmount } from '../helpers/util';
import { PublicKey } from '@solana/web3.js';

const getEmptyReserve = (reserveMeta: HoneyReserve) => {
  const reserve: Reserve = {
    name: 'NFT PLACEHOLDER',
    abbrev: 'NFT ABBREV PLACEHOLDER',
    marketSize: TokenAmount.zero(0),
    outstandingDebt: TokenAmount.zero(0),
    utilizationRate: 0,
    depositRate: 0,
    borrowRate: 0,
    maximumLTV: 0,
    liquidationPremium: 0,
    price: 0,
    decimals: 0,
    depositNoteExchangeRate: new anchor.BN(0),
    loanNoteExchangeRate: new anchor.BN(0),
    accruedUntil: new anchor.BN(0),
    config: {
      utilizationRate1: 0,
      utilizationRate2: 0,
      borrowRate0: 0,
      borrowRate1: 0,
      borrowRate2: 0,
      borrowRate3: 0,
      minCollateralRatio: 0,
      liquidationPremium: 0,
      manageFeeCollectionThreshold: new anchor.BN(0),
      manageFeeRate: 0,
      loanOriginationFee: 0,
      liquidationSlippage: 0,
      _reserved0: 0,
      liquidationDexTradeMax: 0,
      _reserved1: [],
    },

    accountPubkey: reserveMeta.address,
    vaultPubkey: reserveMeta.data.vault,
    availableLiquidity: TokenAmount.zero(0),
    feeNoteVaultPubkey: reserveMeta.data.feeNoteVault,
    tokenMintPubkey: reserveMeta.data.tokenMint,
    tokenMint: PublicKey.default,
    faucetPubkey: null,
    depositNoteMintPubkey: reserveMeta.data.depositNoteMint,
    depositNoteMint: PublicKey.default,
    loanNoteMintPubkey: reserveMeta.data.loanNoteMint,
    loanNoteMint: PublicKey.default,
    pythPricePubkey: reserveMeta.data.pythPrice || reserveMeta.data.pythOraclePrice,
    pythProductPubkey: reserveMeta.data.pythProduct || reserveMeta.data.pythOracleProduct,
  } as unknown as Reserve;
  return reserve;
};
