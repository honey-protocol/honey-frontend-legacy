import { PublicKey } from '@solana/web3.js';
import { TxnResponse } from '../helpers/honeyTypes';
import { Amount, HoneyReserve, HoneyUser } from '../wrappers';
import { deriveAssociatedTokenAccount } from './borrow';
import { TxResponse } from './types';

export const deposit = async (
  honeyUser: HoneyUser,
  tokenAmount: number,
  depositTokenMint: PublicKey,
  depositReserves: HoneyReserve[],
): Promise<TxResponse> => {
  console.log('depositReserves',depositReserves );

  const depositReserve = depositReserves.filter((reserve: HoneyReserve) =>
    reserve?.data?.tokenMint?.equals(depositTokenMint),
  )[0];
  const associatedTokenAccount: PublicKey | undefined = await deriveAssociatedTokenAccount(
    depositTokenMint,
    honeyUser.address,
  );
  const amount = Amount.tokens(tokenAmount);

  console.log('amount', amount);
  if (!associatedTokenAccount) {
    console.error(`Could not find the associated token account: ${associatedTokenAccount}`);
    return [TxnResponse.Failed, []];
  }
  return await honeyUser.deposit(depositReserve, associatedTokenAccount, amount);
};

export const depositCollateral = async (
  honeyUser: HoneyUser,
  tokenAmount: number,
  depositTokenMint: PublicKey,
  depositReserves: HoneyReserve[],
): Promise<TxResponse> => {
  const depositReserve = depositReserves.filter((reserve: HoneyReserve) =>
    reserve?.data?.tokenMint.equals(depositTokenMint),
  )[0];
  return await honeyUser.depositCollateral(depositReserve, Amount.tokens(tokenAmount));
};

export const withdraw = async (
  honeyUser: HoneyUser,
  tokenAmount: number,
  withdrawTokenMint: PublicKey,
  withdrawReserves: HoneyReserve[],
): Promise<TxResponse> => {
  const withdrawReserve = withdrawReserves.filter((reserve: HoneyReserve) =>
    reserve?.data?.tokenMint.equals(withdrawTokenMint),
  )[0];
  const associatedTokenAccount: PublicKey | undefined = await deriveAssociatedTokenAccount(
    withdrawTokenMint,
    honeyUser.address,
  );
  const amount = Amount.tokens(tokenAmount);
  if (!associatedTokenAccount) {
    console.error(`Could not find the associated token account: ${associatedTokenAccount}`);
    return [TxnResponse.Failed, []];
  }
  return await honeyUser.withdraw(withdrawReserve, associatedTokenAccount, amount);
};

export const withdrawCollateral = async (
  honeyUser: HoneyUser,
  tokenAmount: number,
  withdrawTokenMint: PublicKey,
  withdrawReserves: HoneyReserve[],
): Promise<TxResponse> => {
  const withdrawReserve = withdrawReserves.find((reserve: HoneyReserve) =>
    reserve?.data?.tokenMint.equals(withdrawTokenMint),
  )[0];
  if (!withdrawReserve) {
    console.error(`Reserve with token mint ${withdrawTokenMint} does not exist`);
    return [TxnResponse.Failed, []];
  }
  const withdrawCollateralTx = await honeyUser.withdrawCollateral(withdrawReserve, Amount.tokens(tokenAmount));
  return withdrawCollateralTx;
};
