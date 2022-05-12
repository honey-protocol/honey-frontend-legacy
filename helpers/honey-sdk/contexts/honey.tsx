import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { HoneyMarketReserveInfo } from '../helpers/honeyTypes';
import { useAnchor } from './anchor';
import * as anchor from "@project-serum/anchor";
import { MarketReserveInfoList, ReserveStateLayout } from '../helpers/layout';
import { ConnectedWallet } from '../helpers/walletType';
import { useMarket } from '../hooks';
import { Connection, PublicKey } from '@solana/web3.js';

interface HoneyContext {
  market: IMarket | null,
  marketReserveInfo: HoneyMarketReserveInfo[] | null,
  parsedReserves: IReserve[] | null;
}
const HoneyContext = React.createContext<HoneyContext>({
  market: null,
  marketReserveInfo: null,
  parsedReserves: null
});

export const useHoney = () => {
  const context = useContext(HoneyContext);
  return context;
};

export interface HoneyProps {
  children: ReactNode,
  wallet: ConnectedWallet | null;
  connection: Connection,
  honeyProgramId: string;
  honeyMarketId: string;
}

export interface IMarket {
  authorityBumpSeed: number[],
  authoritySeed: PublicKey,
  flags: number,
  marketAuthority: PublicKey,
  nftCollectionCreator: PublicKey,
  owner: PublicKey,
  quoteCurrency: number[],
  quoteExponent: number,
  quoteTokenMint: PublicKey,
  reserved: number[],
  reserves: number[],
  version: 0
}

export interface IReserve {
  config: any;
  depositNoteMint: PublicKey;
  dexMarketA: PublicKey;
  dexMarketB: PublicKey;
  dexOpenOrdersA: PublicKey;
  dexOpenOrdersB: PublicKey;
  dexSwapTokens: PublicKey;
  exponent: number;
  feeNoteVault: PublicKey;
  index: number;
  loanNoteMint: PublicKey;
  market: PublicKey;
  nftDropletMint: PublicKey;
  nftDropletVault: PublicKey;
  protocolFeeNoteVault: PublicKey;
  pythOraclePrice: PublicKey;
  pythOracleProduct: PublicKey;
  reserved0: number[];
  reserved1: number[];
  state: number[];
  tokenMint: PublicKey;
  vault: PublicKey;
  version: number;
  reserveState: ReserveState;
}

export interface ReserveState {
  accruedUntil: number;
  invalidated: number;
  lastUpdated: number;
  outstandingDebt: number;
  totalDepositNotes: number;
  totalDeposits: number;
  totalLoanNotes: number;
  uncollectedFees: number;
  _UNUSED_0_: Uint8Array;
  _UNUSED_1_: Uint8Array;
}

export const HoneyProvider: FC<HoneyProps> = ({
  children,
  wallet,
  connection,
  honeyProgramId,
  honeyMarketId
}) => {
  const { program, coder } = useAnchor();
  const { honeyMarket } = useMarket(connection, wallet, honeyProgramId, honeyMarketId)

  const [market, setMarket] = useState<IMarket | null>(null);
  const [marketReserveInfo, setMarketReserveInfo] = useState<HoneyMarketReserveInfo[]>()
  const [parsedReserves, setReserves] = useState<IReserve[] | null>();

  useEffect(() => {
    if (!program?.provider?.connection || !coder || !honeyMarket?.address)
      return

    const fetchMarket = async () => {
      // market info
      const marketValue = await program.account.market.fetch(honeyMarket.address);
      setMarket(marketValue as IMarket);

      // reserve info
      const reserveInfoData = new Uint8Array(marketValue.reserves as any as number[]);
      const reserveInfoList = MarketReserveInfoList.decode(reserveInfoData) as HoneyMarketReserveInfo[];
      setMarketReserveInfo(reserveInfoList);

      const reservesList = [] as IReserve[];
      for (const reserve of reserveInfoList) {
        if (reserve.reserve.equals(PublicKey.default)) return;
        const reserveValue = await program.account.reserve.fetch(reserve.reserve) as IReserve;
        const reserveState = ReserveStateLayout.decode(Buffer.from(reserveValue.state as any as number[])) as ReserveState;
        reserveValue.reserveState = reserveState;
        reservesList.push(reserveValue);
        setReserves(reservesList);

      }
      console.log("resreves list", reservesList);
      setReserves(reservesList);
    }

    fetchMarket();

  }, [honeyMarket, program?.provider?.connection]);

  const honeyContext = {
    market,
    marketReserveInfo,
    parsedReserves
  }
  return (
    <HoneyContext.Provider
      value={honeyContext}>
      {children}
    </HoneyContext.Provider>
  )
}

