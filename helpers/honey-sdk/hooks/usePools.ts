import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useHoney } from '../contexts/honey';
import { ObligationAccount } from '../helpers/honeyTypes';
import { TPool } from '../helpers/types';
import { ConnectedWallet } from '../helpers/walletType';
import { useMarket } from './useMarket';

export const usePools = (
  connection: Connection,
  wallet: ConnectedWallet,
  honeyProgramId: string,
  honeyMarketId: string,
) => {
  const { market } = useHoney();
  const { honeyUser } = useMarket(connection, wallet, honeyProgramId, honeyMarketId);
  const [status, setStatus] = useState<{
    loading: boolean;
    data?: TPool[];
    error?: Error;
  }>({ loading: false, data: [] });

  // useEffect(() => {
  //   const fetchPools = async () => {
  //     if (!market.reserves || !honeyUser) {
  //       setStatus({ loading: false, error: new Error('Setup data needed is missing') });
  //       return;
  //     }

  //     setStatus({ loading: true });
  //     // const reserve = market.reserves.SOL;
  //     console.log(market);
  //     const obligation = (await honeyUser.getObligationData()) as ObligationAccount;
  //     if (!obligation.collateralNftMint) {
  //       setStatus({ loading: false, error: new Error('Obligation does not have a valid collateral nft mint') });
  //       return;
  //     }
  //     const collateralNftMint: PublicKey[] = obligation.collateralNftMint;
  //     const numOfPositions =
  //       !collateralNftMint || collateralNftMint.length === 0
  //         ? 0
  //         : collateralNftMint.filter((mint) => !mint.equals(PublicKey.default)).length;
  //     const data = {
  //       id: '3uT1ULwpnxNRrtbrwnNvEoGG7jZhxiNuQ7Rnw4kaR2x8',
  //       imageUrl: 'https://www.arweave.net/rr6teTGplFJsnp0LdGNEqLPVU1gnFLGo5ay_HRNLTpY?ext=png',
  //       publicKey: PublicKey.default,
  //       title: 'Test Net Bees',
  //       totalSupplied: reserve?.marketSize?.uiAmount,
  //       totalBorrowed: (reserve?.marketSize?.uiAmountFloat - reserve?.availableLiquidity?.uiAmountFloat).toString(),
  //       userDeposit: {
  //         sol: user?.assets?.tokens?.SOL?.depositNoteBalance?.uiAmountFloat,
  //         usdc: 0,
  //       },
  //       userBorrowStatus: {
  //         numOfPositions,
  //         positionHealths: [0],
  //       },
  //       borrowRate: reserve?.borrowRate,
  //       interestRate: reserve?.depositRate,
  //       APY: reserve?.borrowRate, // same as borrowRate
  //       collateralEvaluation: 5000, // todo do we need this?
  //     };
  //     setStatus({ loading: false, data: [data as unknown as TPool] });
  //   };
  //   fetchPools();
  // }, [market.reserves, user.assets, honeyUser]);

  return { ...status };
};
