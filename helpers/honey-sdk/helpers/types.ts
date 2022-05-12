import { PublicKey } from '@solana/web3.js';
import { SolongWallet, Wallet } from './honeyTypes';

export type TAsset = {
  name: String;
  value: number;
};
export type TBorrowPosition = {
  collateralTokenId: String;
  stakeTime: number;
  assetsBorrowed: TAsset[];
  name: String;
  image: String;
  liquidationThreshold: number;
  totalInterest: number;
  tokenId: PublicKey;
};

type TUserDepositedAsset = {
  sol: number;
  usdc: number;
};

type TUserBorrowStatus = {
  numOfPositions: number;
  positionHealths: number[];
};

export type TPool = {
  id: string;
  publicKey: PublicKey;
  imageUrl: string;
  title: string;
  totalSupplied: number;
  totalBorrowed: number;
  userDeposit: TUserDepositedAsset;
  userBorrowStatus?: TUserBorrowStatus;
  borrowRate: number;
  APY: number;
  interestRate: number;
  collateralEvaluation: number;
};

export type SupportedWallet = Wallet | SolongWallet | null;
