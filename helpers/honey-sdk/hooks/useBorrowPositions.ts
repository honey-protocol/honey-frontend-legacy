import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getNFTAssociatedMetadata } from '..';
import { useHoney } from '../contexts/honey';
import { ObligationAccount } from '../helpers/honeyTypes';
import { SupportedWallet, TBorrowPosition } from '../helpers/types';
import { ConnectedWallet } from '../helpers/walletType';
import { useMarket } from './useMarket';

export const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export interface CollateralNFTPosition {
  mint: PublicKey;
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  image: string;
}

export interface LoanPosition {
  amount: number;
  tokenAccount: PublicKey;
}

export interface FungibleCollateralPosition {
  amount: number;
  tokenAccount: PublicKey;
}

export const useBorrowPositions = (
  connection: Connection,
  wallet: ConnectedWallet,
  honeyId: string,
  honeyMarketId: string,
) => {
  const [status, setStatus] = useState<{
    loading: boolean;
    collateralNFTPositions?: CollateralNFTPosition[];
    loanPositions?: LoanPosition[];
    fungibleCollateralPosition?: FungibleCollateralPosition[];
    error?: Error;
  }>({ loading: false });

  const { market, marketReserveInfo, parsedReserves } = useHoney();
  const { honeyUser } = useMarket(connection, wallet, honeyId, honeyMarketId);

  const fetchData = async () => {
    setStatus({ loading: true });

    const collateralNFTPositions: CollateralNFTPosition[] = [];
    const obligation = (await honeyUser.getObligationData()) as ObligationAccount;
    if (!obligation.market) {
      setStatus({ loading: false, error: new Error('Obligation does not have a valid market') });
      return;
    }
    const collateralNftMint: PublicKey[] = obligation.collateralNftMint;
    if (!collateralNftMint || collateralNftMint.length === 0) {
      setStatus({ loading: false, error: new Error('Obligation does not have a valid collateral nft mint') });
      return;
    }
    const promises = collateralNftMint.map(async (key: PublicKey, index: number) => {
      if (!key.equals(PublicKey.default)) {
        const [nftMetadata, metadataBump] = await PublicKey.findProgramAddress(
          [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), key.toBuffer()],
          METADATA_PROGRAM_ID,
        );
        const data = await getNFTAssociatedMetadata(connection, nftMetadata);
        if (!data) return;
        const tokenMetadata = new Metadata(nftMetadata, data);
        const arweaveData = await (await fetch(tokenMetadata.data.data.uri)).json();
        collateralNFTPositions.push({
          mint: new PublicKey(tokenMetadata?.data?.mint),
          updateAuthority: new PublicKey(tokenMetadata?.data?.updateAuthority),
          name: tokenMetadata?.data?.data?.name,
          symbol: tokenMetadata?.data?.data.symbol,
          uri: tokenMetadata?.data?.data.uri,
          image: arweaveData?.image,
        });
      }
    });

    await Promise.all(promises);

    // build outstanding loans in market
    const loanPositions: LoanPosition[] = [];

    obligation.loans.map((loan: any) => {
      if (loan.account.equals(PublicKey.default)) return;
      loanPositions.push({
        amount: loan.amount.toNumber() / LAMPORTS_PER_SOL,
        tokenAccount: loan.account,
      });
    });

    const fungibleCollateralPosition: FungibleCollateralPosition[] = [];
    obligation.collateral.map((collateral: any) => {
      if (collateral.account.equals(PublicKey.default)) return;
      fungibleCollateralPosition.push({
        amount: collateral.amount.toNumber() / LAMPORTS_PER_SOL,
        tokenAccount: collateral.account,
      });
    });

    setStatus({ loading: false, collateralNFTPositions, loanPositions, fungibleCollateralPosition });
  };

  // build borrow positions
  useEffect(() => {
    if (!honeyUser) {
      setStatus({ loading: false, error: new Error('HoneyUser is undefined') });
      return;
    }
    fetchData();
  }, [honeyUser]);

  return { ...status };
};
