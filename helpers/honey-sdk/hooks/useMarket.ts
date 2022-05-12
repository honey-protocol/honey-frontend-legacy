import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { HoneyClient, HoneyMarket, HoneyUser, HoneyReserve } from '..';
import { useAnchor } from '../contexts/anchor';
import { ConnectedWallet } from '../helpers/walletType';

export const useMarket = (
  connection: Connection,
  wallet: ConnectedWallet,
  honeyProgramId: string,
  honeyMarketId: string,
) => {
  const { isConfigured } = useAnchor();

  const [honeyClient, setHoneyClient] = useState<HoneyClient>();
  const [honeyMarket, setHoneyMarket] = useState<HoneyMarket>();
  const [honeyUser, setHoneyUser] = useState<HoneyUser>();
  const [honeyReserves, setHoneyReserves] = useState<HoneyReserve[]>();

  useEffect(() => {
    const fetchHoneyClient = async () => {
      if (!wallet) return;

      const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
      const client: HoneyClient = await HoneyClient.connect(provider, honeyProgramId, true);
      setHoneyClient(client);

      const honeyMarketPubKey: PublicKey = new PublicKey(honeyMarketId);
      const market: HoneyMarket = await HoneyMarket.load(client, honeyMarketPubKey);
      setHoneyMarket(market);

      // pull latest reserve data
      market.refresh();

      const reserves: HoneyReserve[] = market.reserves.map(
        (reserve) => new HoneyReserve(client, market, reserve.address),
      );
      Promise.all(
        reserves.map(async (reserve) => {
          if (reserve.address && reserve.address.toBase58() !== PublicKey.default.toBase58()) await reserve.refresh();
        }),
      );
      setHoneyReserves(reserves);

      const user: HoneyUser = await HoneyUser.load(client, market, new PublicKey(wallet.publicKey), reserves);
      setHoneyUser(user);
    };
    // load jet
    if (isConfigured && wallet && connection && honeyProgramId && honeyMarketId) {
      fetchHoneyClient();
    }
  }, [isConfigured, connection, wallet, honeyProgramId, honeyMarketId]);

  return {
    honeyClient,
    setHoneyClient,
    honeyMarket,
    setHoneyMarket,
    honeyUser,
    setHoneyUser,
    honeyReserves,
    setHoneyReserves,
  };
};
